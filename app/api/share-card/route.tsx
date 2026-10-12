import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/utils/seoConfig";
import { getShareContactDefaults } from "@/utils/shareKalamPost";

const MAX_STANZAS = 4;
const MAX_LINE_LEN = 120;

const NOTO_NASTALIQ_TTF =
  "https://fonts.gstatic.com/s/notonastaliqurdu/v23/LhWNMUPbN-oZdNFcBy1-DJYsEoTq5pudQ9L940pGPkB3Qt_-DK0.ttf";

function truncateLine(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

async function loadUrduFont(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(NOTO_NASTALIQ_TTF, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    return res.arrayBuffer();
  } catch {
    return null;
  }
}

type Body = {
  title?: string;
  author?: string;
  stanzas?: string[];
  pageUrl?: string;
  theme?: "light" | "dark";
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const title = (body.title || "Kalam Library").slice(0, 120);
    const author = body.author?.slice(0, 80);
    const pageUrl = (body.pageUrl || SITE_CONFIG.url).slice(0, 200);
    const stanzas = (body.stanzas || [])
      .slice(0, MAX_STANZAS)
      .map((s) =>
        s
          .split("\n")
          .map((l) => truncateLine(l, MAX_LINE_LEN))
          .join("\n")
      )
      .filter(Boolean);

    const urduFont = await loadUrduFont();
    const fontFamily = urduFont ? "NotoNastaliqUrdu" : "sans-serif";
    const fonts = urduFont
      ? [
          {
            name: "NotoNastaliqUrdu",
            data: urduFont,
            style: "normal" as const,
            weight: 400 as const,
          },
        ]
      : [];

    const displayHost =
      pageUrl.replace(/^https?:\/\/(www\.)?/, "").split("/")[0] || "kalamlibrary.me";

    const isLight = body.theme === "light";
    const palette = isLight
      ? {
          bg: "#faf6ec",
          bgGrad:
            "linear-gradient(165deg, #faf6ec 0%, #f2ecdd 55%, #ebe3d0 100%)",
          border: "2px solid #d4c9ae",
          brand: "#2f4a33",
          host: "#5c5748",
          title: "#243a28",
          author: "#5c5748",
          lyrics: "#2a2a22",
          stanzaBorder: "1px solid #d4c9ae",
          stanzaBg: "rgba(255,255,255,0.95)",
          footer: "#5c5748",
          footerAccent: "#2f4a33",
          headerBorder: "1px solid #d4c9ae",
          dot: "#9a7b2e",
        }
      : {
          bg: "#020806",
          bgGrad:
            "radial-gradient(circle at 18% 22%, rgba(234,179,8,0.14) 0%, transparent 42%), radial-gradient(circle at 82% 78%, rgba(16,185,129,0.12) 0%, transparent 45%), linear-gradient(165deg, #031510 0%, #020806 50%, #0a2e22 100%)",
          border: "2px solid rgba(234,179,8,0.28)",
          brand: "#eab308",
          host: "#34d399",
          title: "#fcd34d",
          author: "#9ca3af",
          lyrics: "#ecfdf5",
          stanzaBorder: "1px solid rgba(16,185,129,0.35)",
          stanzaBg: "rgba(0,0,0,0.22)",
          footer: "#6b7280",
          footerAccent: "#34d399",
          headerBorder: "1px solid rgba(16,185,129,0.25)",
          dot: "#eab308",
        };

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "44px 52px",
            backgroundColor: palette.bg,
            backgroundImage: palette.bgGrad,
            color: palette.lyrics,
            fontFamily,
            border: palette.border,
            borderRadius: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: palette.headerBorder,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: palette.dot,
                }}
              />
              <span style={{ fontSize: 22, fontWeight: 800, color: palette.brand, letterSpacing: 3 }}>
                KALAM LIBRARY
              </span>
            </div>
            <span style={{ fontSize: 17, color: palette.host }}>{displayHost}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: palette.title, lineHeight: 1.25 }}>
              {title}
            </div>
            {author ? <div style={{ fontSize: 20, color: palette.author }}>{author}</div> : null}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flexGrow: 1,
              gap: 22,
              textAlign: "center",
              fontSize: 26,
              lineHeight: 1.65,
              color: palette.lyrics,
            }}
          >
            {stanzas.length > 0 ? (
              stanzas.map((block, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    padding: "14px 18px",
                    borderRadius: 12,
                    border: palette.stanzaBorder,
                    backgroundColor: palette.stanzaBg,
                  }}
                >
                  {block.split("\n").map((line, j) => (
                    <div key={j}>{line}</div>
                  ))}
                </div>
              ))
            ) : (
              <div style={{ fontSize: 22, color: "#6b7280" }}>Kalam Library</div>
            )}
          </div>

          <div
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: palette.headerBorder,
              fontSize: 17,
              color: palette.footer,
              textAlign: "center",
            }}
          >
            Read full naat on {SITE_CONFIG.name}
            <div style={{ marginTop: 8, fontSize: 15, color: palette.footerAccent }}>
              Contact me: {getShareContactDefaults().whatsappDisplay}
            </div>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1350,
        fonts,
      }
    );
  } catch (e) {
    console.error("share-card failed:", e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
