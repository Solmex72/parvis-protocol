// Flat config with NO imports, so it adds no dependency. reference/package.json
// is required by CI to stay at zero dependencies, and this file honours that —
// run it with `npm run lint`, which fetches eslint through npx at call time
// rather than vendoring it.
//
// The surfaces (console.html, docs/index.html) carry their JavaScript inline, so
// eslint cannot see them directly. `npm run lint:html` extracts the script
// blocks to a temp dir first and lints those.

const node = [
  "console","process","Buffer","URL","URLSearchParams","TextEncoder","TextDecoder",
  "setTimeout","clearTimeout","setInterval","clearInterval","fetch","structuredClone",
  "globalThis","performance","AbortController","queueMicrotask",
];
const browser = [
  "console","window","document","performance","requestAnimationFrame","cancelAnimationFrame",
  "setTimeout","clearTimeout","setInterval","clearInterval","fetch","getComputedStyle",
  "location","history","localStorage","sessionStorage","navigator","Event","CustomEvent",
  "URL","URLSearchParams","matchMedia","devicePixelRatio","ResizeObserver","structuredClone",
];
const readonly = (names) => Object.fromEntries(names.map((n) => [n, "readonly"]));

const rules = {
  // The two that have actually caught real defects in this repo:
  // a called-but-undefined function, and a var reused for two purposes in one
  // function scope.
  "no-undef": "error",
  "no-redeclare": "error",
  "no-unused-vars": ["warn", { args: "none", varsIgnorePattern: "^_" }],
  "no-dupe-keys": "error",
  "no-dupe-args": "error",
  "no-unreachable": "error",
  "no-fallthrough": "error",
  "no-self-assign": "error",
  "no-cond-assign": "error",
  "no-irregular-whitespace": "error",
  "valid-typeof": "error",
  "use-isnan": "error",
  "no-empty": ["warn", { allowEmptyCatch: true }],
};

export default [
  { ignores: ["**/node_modules/**", "docs/**", "**/*.html"] },
  {
    files: ["reference/**/*.mjs", "reference/**/*.js"],
    languageOptions: { ecmaVersion: 2023, sourceType: "module", globals: readonly(node) },
    rules,
  },
  {
    files: ["**/*.inline.js"],
    languageOptions: { ecmaVersion: 2023, sourceType: "script", globals: readonly(browser) },
    rules,
  },
];
