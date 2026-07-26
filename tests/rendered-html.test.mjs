import assert from "node:assert/strict";
import test from "node:test";

async function fetchRoute(path, suffix) {
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

test("renders product, security, and public information routes", async () => {
  const routes = [
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
  assert.match(sitemap, /<loc>https:\/\/zevsflow\.sk\/automatizacia-na-mieru<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/zevsflow\.sk\/data-deletion<\/loc>/i);
});

test("renders a branded 404 page with a real 404 status", async () => {
  const response = await fetchRoute("/tato-stranka-neexistuje", "not-found");
  const html = await response.text();

  assert.equal(response.status, 404);
  assert.match(html, /Táto stránka neexistuje\./i);
  assert.match(html, /href="\/"/i);
  assert.match(html, /href="\/support"/i);
});

test("marks legal copy as a working draft", async () => {
  const response = await fetchRoute("/privacy", "legal");
  const html = await response.text();

  assert.match(html, /Pracovn(?:ý|&#xFD;) n(?:á|&#xE1;)vrh/i);
  assert.match(html, /slovensk(?:ý|&#xFD;) pr(?:á|&#xE1;)vny/i);
});
