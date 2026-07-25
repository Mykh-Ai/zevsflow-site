import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
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

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});

test("renders the real OfficeFlow demo as user-controlled video", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-video`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  const html = await response.text();
  assert.match(html, /<video(?=[^>]*\bcontrols="")(?=[^>]*\bpreload="metadata")[^>]*>/i);
  assert.match(html, /<source[^>]*src="\/media\/officeflow-demo\.mp4"[^>]*type="video\/mp4"/i);
  assert.doesNotMatch(html, /<video[^>]*\bautoplay/i);
});

test("renders product, security, and public information routes", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-routes`);
  const { default: worker } = await import(workerUrl.href);
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
    const response = await worker.fetch(
      new Request(`http://localhost${route}`, { headers: { accept: "text/html" } }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );
    const html = await response.text();
    assert.equal(response.status, 200, route);
    assert.match(html, /<main[^>]*id="main"/i, route);
    assert.match(html, /href="\/privacy"/i, route);
    assert.match(html, /href="\/google-data"/i, route);
  }
});

test("marks legal copy as a working draft", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-legal`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://localhost/privacy", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const html = await response.text();
  assert.match(html, /Pracovn(?:ý|&#xFD;) n(?:á|&#xE1;)vrh/i);
  assert.match(html, /slovensk(?:ý|&#xFD;) pr(?:á|&#xE1;)vny/i);
});
