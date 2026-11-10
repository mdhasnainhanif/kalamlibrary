/**
 * Calls planKalamRoutes with mock translations. No database, no network.
 *
 *   node scripts/check-kalam-routing.mjs
 */
import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { registerHooks } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const warningFlag = "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON";
if (!process.execArgv.includes(warningFlag)) {
  const result = spawnSync(
    process.execPath,
    [warningFlag, ...process.execArgv, fileURLToPath(import.meta.url), ...process.argv.slice(2)],
    { stdio: "inherit" }
  );
  process.exit(result.status ?? 1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (!specifier.startsWith("@/")) return nextResolve(specifier, context);
    const base = path.join(root, specifier.slice(2));
    const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}.mjs`];
    const hit = candidates.find((file) => existsSync(file) && statSync(file).isFile());
    if (!hit) throw new Error(`Cannot resolve ${specifier}`);
    return nextResolve(pathToFileURL(hit).href, context);
  },
});

const { planKalamRoutes, BASE_REDIRECTS_TO_LANGUAGE } = await import("../utils/kalamRouting.ts");
const { contentRedirect } = await import("../utils/contentRedirect.ts");

const SITE = "https://www.kalamlibrary.me";

function lyric(language, text = "line") {
  return { language, lyrics: text };
}

const cases = [
  {
    name: "Urdu-only",
    slug: "sample-urdu-only",
    translations: [lyric("urdu", "اردو")],
    expect(plan) {
      assert(plan.urduRedirectsToBase === true, "urdu redirects to the base");
      assert(plan.baseRedirectPath === null, "base does not redirect away");
      assertEqual(plan.indexPaths, ["/kalam/sample-urdu-only"]);
      assertEqual(plan.alternates, {
        "ur-PK": `${SITE}/kalam/sample-urdu-only`,
        "x-default": `${SITE}/kalam/sample-urdu-only`,
      });
    },
  },
  {
    name: "Urdu plus other languages",
    slug: "sample-multilingual",
    translations: [
      lyric("roman_english", "roman"),
      lyric("urdu", "اردو"),
      lyric("hindi", "हिंदी"),
      lyric("bangla", "বাংলা"),
      { language: "hindi", lyrics: "   " },
    ],
    expect(plan) {
      assert(plan.urduRedirectsToBase === false, "urdu stays a separate URL");
      assert(plan.baseRedirectPath === null, "base does not redirect away");
      assertEqual(plan.indexPaths, [
        "/kalam/sample-multilingual",
        "/kalam/sample-multilingual/urdu",
        "/kalam/sample-multilingual/hindi",
        "/kalam/sample-multilingual/bangla",
      ]);
      assertEqual(plan.alternates, {
        "x-default": `${SITE}/kalam/sample-multilingual`,
        "ur-Latn": `${SITE}/kalam/sample-multilingual`,
        "ur-PK": `${SITE}/kalam/sample-multilingual/urdu`,
        "hi-IN": `${SITE}/kalam/sample-multilingual/hindi`,
        "bn-BD": `${SITE}/kalam/sample-multilingual/bangla`,
      });
    },
  },
  {
    name: "Base redirects to a language URL",
    slug: Object.keys(BASE_REDIRECTS_TO_LANGUAGE)[0],
    translations: [
      lyric("urdu", "اردو"),
      lyric("hindi", "हिंदी"),
      lyric("bangla", "বাংলা"),
      lyric("roman_english", "roman"),
    ],
    expect(plan) {
      const lang = BASE_REDIRECTS_TO_LANGUAGE[plan.basePath.split("/").pop()];
      const languagePath = `/kalam/${this.slug}/${lang}`;
      assert(plan.urduRedirectsToBase === false, "urdu-only rule does not also apply");
      assertEqual(plan.baseRedirectPath, languagePath);
      assertEqual(plan.indexPaths, [languagePath]);
      assert(!plan.indexPaths.includes(plan.basePath), "base URL is not indexed");
      assertEqual(plan.alternates, {
        "ur-PK": `${SITE}${languagePath}`,
        "x-default": `${SITE}${languagePath}`,
      });
    },
  },
];

let failed = 0;

for (const item of cases) {
  const plan = planKalamRoutes(item.slug, item.translations);
  console.log(`\n${item.name} (${item.slug})`);
  console.log(`  basePath: ${plan.basePath}`);
  console.log(`  baseRedirectPath: ${plan.baseRedirectPath ?? "(none)"}`);
  console.log(`  urduRedirectsToBase: ${plan.urduRedirectsToBase}`);
  console.log(`  indexPaths: ${plan.indexPaths.join(", ")}`);
  for (const [lang, href] of Object.entries(plan.alternates)) {
    console.log(`  hreflang ${lang}: ${href}`);
  }
  try {
    item.expect(plan);
    console.log("  ok");
  } catch (error) {
    failed += 1;
    console.log(`  FAIL ${error.message}`);
  }
}

if (!cases[2].slug) {
  console.error("\nFAIL base-redirect map is empty");
  process.exit(1);
}

const queryCases = [
  ["/kalam/salam", "", null],
  ["/kalam/salam?x=1", "?x=1", { pathname: "/kalam/salam", status: 301 }],
  ["/kalam/salam/hindi?utm_source=x", "?utm_source=x", { pathname: "/kalam/salam/hindi", status: 301 }],
  ["/kalam/Salam?x=1", "?x=1", { pathname: "/kalam/salam", status: 308 }],
  ["/kalam/salam/roman-english?x=1", "?x=1", { pathname: "/kalam/salam", status: 301 }],
  ["/kalam/khatm-e-qadria?x=1", "?x=1", { pathname: "/kalam/khatm-e-qadria/urdu", status: 308 }],
  ["/author/someone", "", null],
  ["/author/someone?x=1", "?x=1", { pathname: "/author/someone", status: 301 }],
  ["/search?q=naat", "?q=naat", null],
  ["/api/search?q=naat", "?q=naat", null],
  ["/api/og?title=x", "?title=x", null],
  ["/contact?subject=hi", "?subject=hi", null],
  ["/ads.txt?x=1", "?x=1", null],
  ["/robots.txt", "", null],
  ["/sitemap.xml?x=1", "?x=1", null],
  ["/kalams?page=2", "?page=2", null],
];

console.log("\nQuery-string redirects");
for (const [name, search, expected] of queryCases) {
  const pathname = String(name).split("?")[0];
  const actual = contentRedirect(pathname, search);
  try {
    assertEqual(actual, expected);
    console.log(`  ok ${name}`);
  } catch (error) {
    failed += 1;
    console.log(`  FAIL ${name}: ${error.message}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} case(s) failed`);
  process.exit(1);
}

console.log("\n3 cases passed");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected) {
  const left = JSON.stringify(actual);
  const right = JSON.stringify(expected);
  if (left !== right) throw new Error(`expected ${right}, got ${left}`);
}
