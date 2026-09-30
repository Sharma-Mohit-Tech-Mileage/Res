const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
// Agent checkouts repeatedly replace node_modules. Read the filesystem directly
// in CI instead of relying on a long-lived Watchman index from earlier jobs.
const isCI =
  process.env.TF_BUILD === "True" ||
  process.env.TF_BUILD === "true" ||
  process.env.CI === "true";
const config = isCI ? { resolver: { useWatchman: false } } : {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
