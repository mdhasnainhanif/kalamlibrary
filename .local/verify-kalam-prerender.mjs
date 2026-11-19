const base = (process.argv[2] || "http://127.0.0.1:8787").replace(/\/$/, "");
const paths = [
  "/kalam/salam",
  "/kalam/salam/urdu",
  "/kalam/salam/hindi",
  "/kalam/salam/bangla",
  "/kalam/khatm-e-qadria",
  "/kalam/khatm-e-qadria/urdu",
  "/kalam/tala-al-badru-alayna",
  "/kalam/tala-al-badru-alayna/hindi",
];

function extract(html) {
  return {
    head: html.match(/<head[^>]*>[\s\S]*?<\/head>/i)?.[0] ?? "",
    main: html.match(/<main[^>]*>[\s\S]*?<\/main>/i)?.[0] ?? "",
  };
}

const rows = [];
for (const path of paths) {
  const res = await fetch(`${base}${path}`, { redirect: "manual", headers: { Accept: "text/html" } });
  const html = res.status >= 200 && res.status < 400 ? await res.text() : "";
  rows.push({
    path,
    status: res.status,
    location: res.headers.get("location") || "",
    cacheControl: res.headers.get("cache-control") || "",
    xNextjsCache: res.headers.get("x-nextjs-cache") || "",
    ...extract(html),
  });
  console.log(
    `${path} status=${res.status} cc=${res.headers.get("cache-control")} x-nextjs-cache=${res.headers.get("x-nextjs-cache") || "-"} location=${res.headers.get("location") || ""}`
  );
}
const fs = await import("node:fs");
fs.writeFileSync(".local/verify-after-prerender.json", JSON.stringify({ rows }, null, 2));
