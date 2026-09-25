"""Check crawlable static pages, identity metadata, and local links."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent
BASE = "https://tejasramdassds-sudo.github.io/"
CORNELL = "https://sites.coecis.cornell.edu/tejasramdas/"
SCHOLAR = "https://scholar.google.com/citations?user=CXrL68IAAAAJ"


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.meta = {}
        self.canonicals = []
        self.refs = []
        self.ids = []
        self.h1 = 0
        self.schemas = []
        self.in_title = False
        self.in_schema = False
        self.schema_text = ""
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title":
            self.in_title = True
        if tag == "meta":
            name = attrs.get("name", attrs.get("property", ""))
            assert name not in self.meta, f"Duplicate metadata: {name}"
            self.meta[name] = attrs.get("content", "")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonicals.append(attrs["href"])
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.in_schema = True
            self.schema_text = ""
        if tag == "h1":
            self.h1 += 1
        if "id" in attrs:
            self.ids.append(attrs["id"])
        for key in ("href", "src"):
            if key in attrs:
                self.refs.append(attrs[key])

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "script" and self.in_schema:
            self.schemas.append(json.loads(self.schema_text))
            self.in_schema = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_schema:
            self.schema_text += data


pages = {p.name: Page(p.read_text(encoding="utf-8")) for p in ROOT.glob("*.html")}
assert len(pages) == 18
assert len({p.title for p in pages.values()}) == len(pages)
urls = set()
links_checked = 0
for filename, page in pages.items():
    url = BASE if filename == "index.html" else BASE + filename
    urls.add(url)
    assert page.canonicals == [url], filename
    assert page.meta["description"].strip(), filename
    assert "noindex" not in page.meta["robots"], filename
    assert page.meta["og:url"] == url, filename
    assert page.h1 == 1, filename
    assert len(page.ids) == len(set(page.ids)), filename
    graph = page.schemas[0]["@graph"]
    person = next(n for n in graph if n["@type"] == "Person")
    assert person["name"] == "Tejas Ramdas"
    assert CORNELL in person["sameAs"]
    assert SCHOLAR in person["sameAs"]
    assert "https://github.com/tejasramdas" not in page.refs
    webpage = next(n for n in graph if n["@id"] == url + "#webpage")
    assert webpage["url"] == url
    if filename == "index.html":
        assert webpage["@type"] == "ProfilePage"
        assert webpage["mainEntity"]["@id"] == person["@id"]
        assert page.meta["google-site-verification"]
        assert SCHOLAR in page.refs
    for ref in page.refs:
        parsed = urlsplit(urljoin(url, ref))
        if parsed.netloc != urlsplit(BASE).netloc:
            continue
        path = unquote(parsed.path).lstrip("/") or "index.html"
        assert (ROOT / path).is_file(), (filename, ref)
        if parsed.fragment and path in pages:
            assert unquote(parsed.fragment) in pages[path].ids, (filename, ref)
        links_checked += 1

sitemap = ET.parse(ROOT / "sitemap.xml")
assert SCHOLAR in pages["profiles-and-papers.html"].refs
ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
entries = sitemap.findall("s:url", ns)
assert {e.find("s:loc", ns).text for e in entries} == urls
assert len(entries) == len(urls)
assert "Sitemap: " + BASE + "sitemap.xml" in (ROOT / "robots.txt").read_text()
assert "Disallow: /" not in (ROOT / "robots.txt").read_text()
print(json.dumps({"pages": len(pages), "local_links_checked": links_checked,
                  "canonical_urls": "pass", "structured_data": "pass",
                  "sitemap": "pass", "verification_tag": "present"}))
