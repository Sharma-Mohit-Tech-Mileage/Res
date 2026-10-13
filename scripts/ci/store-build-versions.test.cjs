const { test } = require("node:test");
const assert = require("node:assert/strict");
const { generateKeyPairSync } = require("node:crypto");
const { mkdtempSync, writeFileSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join } = require("node:path");
const {
  nextVersion,
  iosVersions,
} = require("./store-build-versions.cjs");

test("empty stores start at 1; existing maximum advances independently", () => {
  assert.equal(nextVersion([], "android"), 1);
  assert.equal(nextVersion([], "ios"), 1);
  assert.equal(nextVersion(["1"], "android"), 2);
  assert.equal(nextVersion(["12", "276461", "99"], "android"), 276462);
  assert.equal(nextVersion(["161", "9"], "ios"), 162);
  assert.equal(nextVersion(["4.2.1"], "ios"), 5);
  assert.throws(() => nextVersion(["invalid"], "ios"));
  assert.throws(() => nextVersion(["2100000000"], "android"));
});

test("paginates Apple build history and rejects API errors", async () => {
  const directory = mkdtempSync(join(tmpdir(), "store-versions-"));
  const originalFetch = global.fetch;
  try {
    const ec = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
    const apple = join(directory, "apple.p8");
    writeFileSync(
      apple,
      ec.privateKey.export({ type: "pkcs8", format: "pem" }),
    );
    const env = {
      ASC_KEY_PATH: apple,
      APP_BUNDLE_ID: "test.app",
      ASC_KEY_ID: "test",
      IOS_MARKETING_VERSION: "31.0.1",
      ASC_ISSUER_ID: "test",
    };
    const build = (version, expired, release = "current") => ({
      attributes: {version, expired},
      relationships: {preReleaseVersion: {data: {id: release}}},
    });
    const included = [
      {id:"current", type:"preReleaseVersions", attributes:{version:"31.0.1", platform:"IOS"}},
      {id:"old", type:"preReleaseVersions", attributes:{version:"29.1.1", platform:"IOS"}},
    ];
    global.fetch = async (url) => {
      const parsed = new URL(url);
      const path = parsed.pathname;
      if (path === "/v1/builds" && !parsed.searchParams.has("page")) {
        assert.equal(parsed.searchParams.get("limit"), "200", "Apple List Builds maximum page size is 200");
        assert.equal(parsed.searchParams.get("include"), "preReleaseVersion");
      }
      const payload = path.endsWith("/apps")
        ? {data:[{id:"app"}]}
        : url.includes("page=2")
        ? {data:[build("3",false),build("90000",false,"old")], included, links:{}}
        : {data:[build("23039",true),build("217",true),build("1",false),build("2",false)], included,
           links:{next:"https://api.appstoreconnect.apple.com/v1/builds?page=2"}};
      return new Response(JSON.stringify(payload), {status:200});
    };
    assert.equal(nextVersion(await iosVersions(env), "ios"), 4);
    global.fetch = async url => new Response(JSON.stringify(new URL(url).pathname.endsWith("/apps")
      ? {data:[{id:"app"}]} : {data:[build("1",true)],included,links:{}}), {status:200});
    await assert.rejects(iosVersions(env), /already exists as an expired build/);
    global.fetch = async () => new Response("{}", { status: 403 });
    await assert.rejects(iosVersions(env), /HTTP 403/);
  } finally {
    global.fetch = originalFetch;
    rmSync(directory, { recursive: true, force: true });
  }
});
