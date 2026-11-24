import assert from "node:assert/strict";
import { test } from "node:test";
import { getInstagramPosts } from "../lib/instagram.ts";

test("Instagram feed handles configuration, responses and failures", async (t) => {
  const originalFetch = globalThis.fetch;
  const originalToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const originalError = console.error;
  const originalWarn = console.warn;
  const errors = [];
  const warnings = [];
  console.error = (message) => errors.push(message);
  console.warn = (message) => warnings.push(message);
  t.after(() => {
    globalThis.fetch = originalFetch;
    if (originalToken === undefined) delete process.env.INSTAGRAM_ACCESS_TOKEN;
    else process.env.INSTAGRAM_ACCESS_TOKEN = originalToken;
    console.error = originalError;
    console.warn = originalWarn;
  });

  globalThis.fetch = () => { throw new Error("unexpected request"); };
  assert.deepEqual(await getInstagramPosts(), []);
  delete process.env.INSTAGRAM_ACCESS_TOKEN;
  assert.deepEqual(await getInstagramPosts({ enabled: true, accountId: "123" }), []);
  assert.equal(errors.length, 1);

  process.env.INSTAGRAM_ACCESS_TOKEN = "test-secret";
  assert.deepEqual(await getInstagramPosts({ enabled: true, accountId: "bad/id" }), []);
  assert.deepEqual(await getInstagramPosts({ enabled: true, accountId: "123", limit: 13 }), []);
  assert.equal(errors.length, 3);

  globalThis.fetch = async (url, options) => {
    assert.equal(url.origin, "https://graph.facebook.com");
    assert.equal(url.pathname, "/v27.0/123/media");
    assert.equal(url.searchParams.get("limit"), "3");
    assert.ok(!url.href.includes("test-secret"));
    assert.equal(options.headers.Authorization, "Bearer test-secret");
    assert.equal(options.next.revalidate, 900);
    return Response.json({ data: [
      { id: "1", media_type: "IMAGE", media_url: "https://cdn.example/image.jpg", permalink: "https://www.instagram.com/p/one/", alt_text: "Kuva" },
      { id: "2", media_type: "VIDEO", thumbnail_url: "https://cdn.example/video.jpg", permalink: "https://www.instagram.com/reel/two/" },
      { id: "3", media_type: "VIDEO", permalink: "https://www.instagram.com/reel/three/" },
      { id: "4", media_type: "IMAGE", media_url: "https://cdn.example/unsafe.jpg", permalink: "https://instagram.com.example/p/four/" },
    ] });
  };
  assert.deepEqual(await getInstagramPosts({ enabled: true, accountId: "123", limit: 3 }), [
    { id: "1", imageUrl: "https://cdn.example/image.jpg", permalink: "https://www.instagram.com/p/one/", alt: "Kuva" },
    { id: "2", imageUrl: "https://cdn.example/video.jpg", permalink: "https://www.instagram.com/reel/two/", alt: "" },
  ]);
  assert.equal(warnings.length, 2);

  globalThis.fetch = async () => new Response(null, { status: 401 });
  assert.deepEqual(await getInstagramPosts({ enabled: true, accountId: "123" }), []);
  globalThis.fetch = async () => new Response("not JSON");
  assert.deepEqual(await getInstagramPosts({ enabled: true, accountId: "123" }), []);
  globalThis.fetch = async () => { throw new Error("test-secret"); };
  assert.deepEqual(await getInstagramPosts({ enabled: true, accountId: "123" }), []);
  assert.equal(errors.length, 6);
  assert.ok(errors.every((message) => !message.includes("test-secret")));
});
