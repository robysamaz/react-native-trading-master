const path = require("path");

// `babel-preset-expo` is nested under `node_modules/expo/node_modules` (not
// hoisted to the project root), so resolve it through the `expo` package
// instead of by bare name — otherwise Babel can't find it from here.
const babelPresetExpo = require.resolve("babel-preset-expo", {
  paths: [path.dirname(require.resolve("expo/package.json"))],
});

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // `unstable_transformImportMeta` rewrites `import.meta` so dependencies
      // that use it (e.g. zustand's middleware bundle) run under Hermes.
      [babelPresetExpo, { unstable_transformImportMeta: true }],
    ],
  };
};
