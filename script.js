const year = document.querySelector("#year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const TRACKING_ENDPOINT = "";

const cookieName = "tr_visitor_id";
const getCookie = (name) => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
};

const setCookie = (name, value) => {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${name}=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax; Secure`;
};

const getVisitorId = () => {
  const existing = getCookie(cookieName);
  if (existing) return existing;
  const id = crypto.randomUUID();
  setCookie(cookieName, id);
  return id;
};

const getUtm = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_content: params.get("utm_content"),
    utm_term: params.get("utm_term"),
  };
};

const sendEvent = (eventName, target = "", extra = {}) => {
  if (!TRACKING_ENDPOINT) return;

  const payload = {
    event_name: eventName,
    event_target: target,
    page_url: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
    referrer: document.referrer || null,
    visitor_id: getVisitorId(),
    language: navigator.language || null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
    screen_width: window.screen?.width || null,
    screen_height: window.screen?.height || null,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    ...getUtm(),
    ...extra,
  };

  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon(TRACKING_ENDPOINT, new Blob([body], { type: "application/json" }));
    return;
  }

  fetch(TRACKING_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
};

sendEvent("page_view", window.location.pathname);

document.querySelectorAll("[data-track]").forEach((element) => {
  element.addEventListener("click", () => {
    sendEvent(element.dataset.track, element.dataset.trackTarget || element.textContent.trim(), {
      link_url: element.href || null,
      text: element.textContent.trim().slice(0, 240),
    });
  });
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".site-nav a")];

const setActiveNav = () => {
  const current = sections
    .map((section) => ({
      id: section.id,
      top: Math.abs(section.getBoundingClientRect().top - 90),
    }))
    .sort((a, b) => a.top - b.top)[0];

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current?.id}`);
  });
};

setActiveNav();
window.addEventListener("scroll", setActiveNav, { passive: true });
