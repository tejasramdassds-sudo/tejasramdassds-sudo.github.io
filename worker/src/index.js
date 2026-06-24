const allowedOrigins = new Set([
  "https://tejasramdassds-sudo.github.io",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
]);

const corsHeaders = (origin) => ({
  "Access-Control-Allow-Origin": allowedOrigins.has(origin) ? origin : "https://tejasramdassds-sudo.github.io",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
  "Vary": "Origin",
});

const json = (body, status = 200, origin = "") =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(origin),
    },
  });

const clean = (value, limit = 500) => {
  if (value === undefined || value === null) return null;
  return String(value).slice(0, limit);
};

const intOrNull = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : null;
};

const getIp = (request) =>
  request.headers.get("CF-Connecting-IP") ||
  request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
  null;

const requireAdmin = (request, env) => {
  if (!env.ADMIN_TOKEN) return false;
  const expected = `Bearer ${env.ADMIN_TOKEN}`;
  return request.headers.get("Authorization") === expected;
};

async function collect(request, env, origin) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400, origin);
  }

  const cf = request.cf || {};
  const extra = {
    botManagement: cf.botManagement || null,
    clientTcpRtt: cf.clientTcpRtt || null,
    tlsVersion: cf.tlsVersion || null,
  };

  await env.DB.prepare(
    `INSERT INTO events (
      event_name, event_target, visitor_id, ip_address, country, region, city,
      timezone, colo, asn, as_organization, user_agent, referrer, page_url,
      page_path, page_title, link_url, text, language, screen_width,
      screen_height, viewport_width, viewport_height, utm_source, utm_medium,
      utm_campaign, utm_content, utm_term, extra_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      clean(payload.event_name, 120) || "unknown",
      clean(payload.event_target, 240),
      clean(payload.visitor_id, 80),
      getIp(request),
      clean(cf.country, 8),
      clean(cf.region, 120),
      clean(cf.city, 120),
      clean(payload.timezone || cf.timezone, 120),
      clean(cf.colo, 16),
      intOrNull(cf.asn),
      clean(cf.asOrganization, 240),
      clean(request.headers.get("User-Agent"), 800),
      clean(payload.referrer, 1000),
      clean(payload.page_url, 1000),
      clean(payload.page_path, 500),
      clean(payload.page_title, 240),
      clean(payload.link_url, 1000),
      clean(payload.text, 240),
      clean(payload.language, 80),
      intOrNull(payload.screen_width),
      intOrNull(payload.screen_height),
      intOrNull(payload.viewport_width),
      intOrNull(payload.viewport_height),
      clean(payload.utm_source, 240),
      clean(payload.utm_medium, 240),
      clean(payload.utm_campaign, 240),
      clean(payload.utm_content, 240),
      clean(payload.utm_term, 240),
      JSON.stringify(extra)
    )
    .run();

  return json({ ok: true }, 202, origin);
}

async function events(request, env, origin) {
  if (!requireAdmin(request, env)) {
    return json({ ok: false, error: "Unauthorized" }, 401, origin);
  }

  const url = new URL(request.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 100, 1), 500);
  const result = await env.DB.prepare(
    `SELECT id, created_at, event_name, event_target, visitor_id, ip_address,
      country, region, city, as_organization, user_agent, referrer, page_path,
      page_title, link_url, utm_source, utm_medium, utm_campaign, utm_content
     FROM events
     ORDER BY id DESC
     LIMIT ?`
  )
    .bind(limit)
    .all();

  return json({ ok: true, events: result.results || [] }, 200, origin);
}

async function summary(request, env, origin) {
  if (!requireAdmin(request, env)) {
    return json({ ok: false, error: "Unauthorized" }, 401, origin);
  }

  const [topEvents, topTargets, recentIps] = await Promise.all([
    env.DB.prepare("SELECT event_name, COUNT(*) AS count FROM events GROUP BY event_name ORDER BY count DESC").all(),
    env.DB.prepare("SELECT event_target, COUNT(*) AS count FROM events WHERE event_target IS NOT NULL GROUP BY event_target ORDER BY count DESC LIMIT 25").all(),
    env.DB.prepare("SELECT ip_address, country, as_organization, COUNT(*) AS count, MAX(created_at) AS last_seen FROM events WHERE ip_address IS NOT NULL GROUP BY ip_address, country, as_organization ORDER BY last_seen DESC LIMIT 50").all(),
  ]);

  return json(
    {
      ok: true,
      top_events: topEvents.results || [],
      top_targets: topTargets.results || [],
      recent_ips: recentIps.results || [],
    },
    200,
    origin
  );
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (url.pathname === "/collect" && request.method === "POST") {
      return collect(request, env, origin);
    }

    if (url.pathname === "/events" && request.method === "GET") {
      return events(request, env, origin);
    }

    if (url.pathname === "/summary" && request.method === "GET") {
      return summary(request, env, origin);
    }

    return json({ ok: true, service: "tejas-website-event-logger" }, 200, origin);
  },
};
