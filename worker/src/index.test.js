import test from "node:test";
import assert from "node:assert/strict";
import worker from "./index.js";

function environment(rows = []) {
  const writes = [];
  return {
    ADMIN_TOKEN: "unit-test-token",
    writes,
    DB: { prepare(sql) {
      return { bind(...values) { this.values = values; return this; },
        async run() { writes.push({ sql, values: this.values }); },
        async all() { return { results: rows }; },
      };
    } },
  };
}
const cornell = "https://sites.coecis.cornell.edu";
const personal = "https://tejasramdassds-sudo.github.io";
const post = (origin, payload) => new Request("https://logger.example/collect", {
  method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: JSON.stringify(payload),
});

test("personal events retain their existing contract", async () => {
  const env = environment();
  const result = await worker.fetch(post(personal, { page_url: personal + "/", event_name: "page_view" }), env);
  assert.equal(result.status, 202);
  assert.equal(env.writes.length, 1);
});
test("Cornell consent and path scope are enforced", async () => {
  const env = environment();
  const payload = { page_url: cornell + "/tejasramdas/", event_name: "page_view" };
  assert.equal((await worker.fetch(post(cornell, payload), env)).status, 400);
  assert.equal((await worker.fetch(post(cornell, { ...payload, analytics_consent: "granted" }), env)).status, 202);
  assert.equal((await worker.fetch(post(cornell, { ...payload, page_url: cornell + "/another-site/", analytics_consent: "granted" }), env)).status, 403);
  assert.equal(env.writes.length, 1);
});
test("unrelated origins and mismatched sites cannot collect", async () => {
  const env = environment();
  assert.equal((await worker.fetch(post("https://example.com", { page_url: personal + "/" }), env)).status, 403);
  assert.equal((await worker.fetch(post(cornell, { page_url: personal + "/" }), env)).status, 403);
  assert.equal((await worker.fetch(post(cornell, null), env)).status, 403);
  assert.equal(env.writes.length, 0);
});
test("private event exports include URL-derived site labels", async () => {
  const env = environment([{ page_url: personal + "/" }, { page_url: cornell + "/tejasramdas/research/" }, { page_url: "invalid" }]);
  const request = new Request("https://logger.example/events", { headers: { Authorization: "Bearer unit-test-token" } });
  const result = await (await worker.fetch(request, env)).json();
  assert.deepEqual(result.events.map(event => event.site), ["personal", "cornell", "unknown"]);
  assert.equal((await worker.fetch(new Request("https://logger.example/events"), env)).status, 401);
});
test("Cornell preflight accepts the exact origin", async () => {
  const result = await worker.fetch(new Request("https://logger.example/collect", { method: "OPTIONS", headers: { Origin: cornell } }), environment());
  assert.equal(result.status, 204);
  assert.equal(result.headers.get("Access-Control-Allow-Origin"), cornell);
});
