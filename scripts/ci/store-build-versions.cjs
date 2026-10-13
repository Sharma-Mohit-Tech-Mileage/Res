const { readFileSync } = require("node:fs");
const { sign } = require("node:crypto");

function nextVersion(values, platform) {
  let maximum = 0;
  for (const value of values) {
    // An integer greater than a dotted Apple build is also monotonically greater.
    const pattern = platform === "ios" ? /^\d+(\.\d+){0,2}$/ : /^\d+$/;
    if (!pattern.test(String(value)))
      throw new Error(`Invalid ${platform} store build number`);
    maximum = Math.max(maximum, Number(String(value).split(".")[0]));
  }
  const next = maximum + 1;
  if (
    !Number.isSafeInteger(next) ||
    (platform === "android" && next > 2100000000)
  ) {
    throw new Error(`${platform} build number exceeds its supported range`);
  }
  return next;
}

function jwt(header, claims, key, algorithm) {
  const encode = (value) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  const body = `${encode(header)}.${encode(claims)}`;
  const signature = sign(
    "sha256",
    Buffer.from(body),
    algorithm === "ES256" ? { key, dsaEncoding: "ieee-p1363" } : key,
  );
  return `${body}.${signature.toString("base64url")}`;
}

async function request(url, token, method = "GET", body) {
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(60000),
  });
  // Never print response bodies or tokens: they can contain credential details.
  if (!response.ok)
    throw new Error(
      `Store API ${method} ${new URL(url).pathname}: HTTP ${response.status}`,
    );
  return response.status === 204 ? {} : response.json();
}

async function iosVersions(env) {
  const now = Math.floor(Date.now() / 1000);
  const token = jwt(
    { alg: "ES256", kid: env.ASC_KEY_ID, typ: "JWT" },
    {
      iss: env.ASC_ISSUER_ID,
      iat: now,
      exp: now + 1200,
      aud: "appstoreconnect-v1",
    },
    readFileSync(env.ASC_KEY_PATH, "utf8"),
    "ES256",
  );
  const origin = "https://api.appstoreconnect.apple.com";
  const apps = await request(
    `${origin}/v1/apps?${new URLSearchParams({
      "filter[bundleId]": env.APP_BUNDLE_ID,
    })}`,
    token,
  );
  if (apps.data?.length !== 1)
    throw new Error("Expected exactly one existing App Store Connect app");
  let url = `${origin}/v1/builds?${new URLSearchParams({
    "filter[app]": apps.data[0].id,
    include: "preReleaseVersion",
    // Apple caps List Builds at 200; follow links.next for remaining pages.
    limit: "200",
  })}`;
  const versions = [];
  const usedVersions = [];
  while (url) {
    if (new URL(url).origin !== origin)
      throw new Error("Unexpected Apple pagination host");
    const page = await request(url, token);
    if (!Array.isArray(page.data))
      throw new Error("Invalid Apple builds response");
    const releases = new Map(
      (page.included || [])
        .filter((item) => item.type === "preReleaseVersions")
        .map((item) => [item.id, item.attributes]),
    );
    for (const build of page.data) {
      const release = releases.get(
        build.relationships?.preReleaseVersion?.data?.id,
      );
      if (!release)
        throw new Error(
          "Apple response is missing the build prerelease version",
        );
      if (
        release.platform !== "IOS" ||
        release.version !== env.IOS_MARKETING_VERSION
      )
        continue;
      if (typeof build.attributes.expired !== "boolean")
        throw new Error("Apple response is missing build expiration status");
      usedVersions.push(String(build.attributes.version));
      if (!build.attributes.expired) versions.push(build.attributes.version);
    }
    url = page.links?.next;
  }
  const candidate = nextVersion(versions, "ios");
  if (usedVersions.includes(String(candidate))) {
    throw new Error(
      `iOS build ${candidate} already exists as an expired build for ${env.IOS_MARKETING_VERSION}; choose a new marketing version rather than reuse it.`,
    );
  }
  console.log(
    `iOS ${env.IOS_MARKETING_VERSION}: ${versions.length} non-expired builds; next build ${candidate}`,
  );
  return versions;
}

async function main(env = process.env) {
  for (const key of [
    "APP_BUNDLE_ID",
    "IOS_MARKETING_VERSION",
    "ASC_KEY_ID",
    "ASC_ISSUER_ID",
    "ASC_KEY_PATH",
  ]) {
    if (!env[key] || env[key].startsWith("$("))
      throw new Error(`Missing configuration: ${key}`);
  }
  const ios = nextVersion(await iosVersions(env), "ios");
  for (const [key, value] of Object.entries({
    iosBuildNumber: ios,
  })) {
    console.log(
      `${key}: ${value} (current iOS version non-expired maximum + 1; no builds starts at 1)`,
    );
    console.log(`##vso[task.setvariable variable=${key}]${value}`);
    console.log(
      `##vso[task.setvariable variable=${key};isOutput=true]${value}`,
    );
  }
}
if (require.main === module)
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
module.exports = { nextVersion, jwt, iosVersions };
