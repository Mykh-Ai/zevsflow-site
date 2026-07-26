import assert from "node:assert/strict";
import test from "node:test";

async function fetchRoute(path, suffix, env = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${suffix}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(new URL(path, "https://zevsflow.sk"), {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
      ...env,
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders production-ready ZevsFlow metadata and keeps indexing disabled", async () => {
  const response = await fetchRoute("/", "metadata");
  const html = await response.text();
  const legacyBrand = ["Office", "Flow"].join("");

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(html, /<title>ZevsFlow — AI automatizácia na mieru<\/title>/i);
  assert.match(
    html,
    /<meta(?=[^>]*\bname="robots")(?=[^>]*\bcontent="noindex, nofollow")[^>]*>/i,
  );
  assert.match(
    html,
    /<meta(?=[^>]*\bproperty="og:site_name")(?=[^>]*\bcontent="ZevsFlow")[^>]*>/i,
  );
  assert.match(
    html,
    /<meta(?=[^>]*\bproperty="og:url")(?=[^>]*\bcontent="https:\/\/zevsflow\.sk")[^>]*>/i,
  );
  assert.match(
    html,
    /<meta(?=[^>]*\bproperty="og:image")(?=[^>]*\bcontent="https:\/\/zevsflow\.sk\/opengraph-image\.png")[^>]*>/i,
  );
  assert.doesNotMatch(html, /codex-preview/i);
  assert.ok(!html.includes(legacyBrand));
});

test("renders the real ZevsFlow demo as user-controlled video", async () => {
  const response = await fetchRoute("/", "video");
  const html = await response.text();

  assert.match(html, /<video(?=[^>]*\bcontrols="")(?=[^>]*\bpreload="metadata")[^>]*>/i);
  assert.match(html, /<source[^>]*src="\/media\/zevsflow-demo\.mp4"[^>]*type="video\/mp4"/i);
  assert.doesNotMatch(html, /<video[^>]*\bautoplay/i);
});

test("makes the pilot and implementation prices visible on the homepage", async () => {
  const response = await fetchRoute("/", "pilot-offer");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /href="\/pilot"/i);
  assert.match(html, /Pilot za 200/i);
  assert.match(html, /Implement(?:á|&#xE1;)cia od 750/i);
  assert.match(html, /nie je platite(?:ľ|&#x13E;)om DPH/i);
  assert.doesNotMatch(html, /S(?:ú|&#xFA;)kromn(?:ý|&#xFD;) pracovn(?:ý|&#xFD;) n(?:á|&#xE1;)h(?:ľ|&#x13E;)ad/i);
  assert.doesNotMatch(html, /nie verejn(?:á|&#xE1;) ponuka/i);
});

test("renders product, pilot, security, and public information routes", async () => {
  const routes = [
    "/pilot",
    "/automatizacia-na-mieru",
    "/data-a-bezpecnost",
    "/privacy",
    "/terms",
    "/cookies",
    "/google-data",
    "/data-deletion",
    "/support",
  ];

  for (const route of routes) {
    const response = await fetchRoute(route, `route-${route}`);
    const html = await response.text();

    assert.equal(response.status, 200, route);
    assert.match(html, /<main[^>]*id="main"/i, route);
    assert.match(html, /href="\/privacy"/i, route);
    assert.match(html, /href="\/google-data"/i, route);
  }
});

test("renders the pilot scope without payment or file-upload controls", async () => {
  const response = await fetchRoute("/pilot", "pilot-page");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Pilot jed(?:n|ného|n&#xE9;ho) procesu za 200/i);
  assert.match(html, /nie je platite(?:ľ|&#x13E;)om DPH/i);
  assert.match(html, /Implement(?:á|&#xE1;)cia od 750/i);
  assert.match(html, /nie je objedn(?:á|&#xE1;)vkou/i);
  assert.doesNotMatch(html, /type="file"/i);
  assert.doesNotMatch(html, /checkout|platobn(?:á|&#xE1;) br(?:á|&#xE1;)na/i);
});

test("serves robots and sitemap from the canonical domain", async () => {
  const robotsResponse = await fetchRoute("/robots.txt", "robots");
  const robots = await robotsResponse.text();

  assert.equal(robotsResponse.status, 200);
  assert.match(robots, /User-Agent:\s*\*/i);
  assert.match(robots, /Disallow:\s*\//i);
  assert.match(robots, /Sitemap:\s*https:\/\/zevsflow\.sk\/sitemap\.xml/i);
  assert.match(robots, /Host:\s*https:\/\/zevsflow\.sk/i);

  const sitemapResponse = await fetchRoute("/sitemap.xml", "sitemap");
  const sitemap = await sitemapResponse.text();

  assert.equal(sitemapResponse.status, 200);
  assert.match(sitemap, /<loc>https:\/\/zevsflow\.sk\/<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/zevsflow\.sk\/pilot<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/zevsflow\.sk\/automatizacia-na-mieru<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/zevsflow\.sk\/data-deletion<\/loc>/i);
});

test("keeps the pilot form disabled until Cloudflare runtime bindings are configured", async () => {
  const response = await fetchRoute("/api/pilot-config", "pilot-config");
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.enabled, false);
  assert.equal(body.siteKey, null);
  assert.equal(body.fallbackEmail, "officezevs2024@gmail.com");
});

test("renders a branded 404 page with a real 404 status", async () => {
  const response = await fetchRoute("/tato-stranka-neexistuje", "not-found");
  const html = await response.text();

  assert.equal(response.status, 404);
  assert.match(html, /Táto stránka neexistuje\./i);
  assert.match(html, /href="\/"/i);
  assert.match(html, /href="\/support"/i);
});

test("keeps internal launch commentary out of public support pages", async () => {
  const response = await fetchRoute("/support", "support-copy");
  const html = await response.text();

  assert.match(html, /Napíšte nám/i);
  assert.doesNotMatch(html, /Pracovn(?:ý|&#xFD;) n(?:á|&#xE1;)vrh/i);
  assert.doesNotMatch(html, /slovensk(?:ý|&#xFD;) pr(?:á|&#xE1;)vny špecialista/i);
  assert.doesNotMatch(html, /samostatn(?:ých|&#xFD;ch) dom(?:é|&#xE9;)nov(?:ých|&#xFD;ch) adries/i);
});
