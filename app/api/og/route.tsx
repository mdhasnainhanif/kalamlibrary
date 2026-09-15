import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get("title") || "Kalam Library";
    const poet = searchParams.get("poet");
    const sub = searchParams.get("sub") || "Islamic Poetry, Hamd & Naat Lyrics Archive";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 80px",
            backgroundColor: "#020806",
            backgroundImage:
              "radial-gradient(circle at 50% 10%, rgba(16, 185, 129, 0.18) 0%, transparent 60%), radial-gradient(circle at 90% 90%, rgba(234, 179, 8, 0.12) 0%, transparent 50%)",
            fontFamily: "sans-serif",
            color: "#ffffff",
            position: "relative",
          }}
        >
          {/* Decorative Corner Borders */}
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 24,
              right: 24,
              bottom: 24,
              border: "1px solid rgba(234, 179, 8, 0.25)",
              borderRadius: "16px",
              pointerEvents: "none",
            }}
          />

          {/* Header Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "#eab308",
                  boxShadow: "0 0 16px #eab308",
                }}
              />
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  color: "#eab308",
                  textTransform: "uppercase",
                }}
              >
                Kalam Library
              </span>
            </div>

            <span
              style={{
                fontSize: "18px",
                color: "rgba(16, 185, 129, 0.9)",
                letterSpacing: "0.1em",
                fontWeight: 600,
              }}
            >
              kalamlibrary.me
            </span>
          </div>

          {/* Main Title & Poet Section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              margin: "auto 0",
              maxWidth: "1000px",
            }}
          >
            <h1
              style={{
                fontSize: title.length > 40 ? "46px" : "56px",
                fontWeight: 900,
                color: "#facc15",
                lineHeight: 1.2,
                textShadow: "0 2px 20px rgba(0, 0, 0, 0.8)",
                margin: 0,
              }}
            >
              {title}
            </h1>

            {poet && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "26px",
                  color: "#9ca3af",
                  fontWeight: 500,
                }}
              >
                <span>Written by</span>
                <span
                  style={{
                    color: "#34d399",
                    fontWeight: 700,
                  }}
                >
                  {poet}
                </span>
              </div>
            )}
          </div>

          {/* Footer Subtitle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(16, 185, 129, 0.2)",
              paddingTop: "20px",
              width: "100%",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                color: "#6b7280",
                letterSpacing: "0.05em",
              }}
            >
              {sub}
            </span>
            <span
              style={{
                fontSize: "16px",
                color: "#eab308",
                fontWeight: 600,
              }}
            >
              Read Lyrics & Translations
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    console.error("OG Image generation failed:", e);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
