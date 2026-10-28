import { SITE_CONFIG } from "@/utils/seoConfig";
import { buildWhatsAppForwardUrl } from "@/utils/shareKalamPost";
import { shareCardCaptureBackground, type SharePostTheme } from "@/utils/sharePostTheme";

export type ShareCardPayload = {
  title: string;
  author?: string;
  stanzas: string[];
  pageUrl: string;
};

export function normalizeSharePageUrl(href: string): string {
  try {
    const u = new URL(href);
    if (u.hostname === "localhost" || u.hostname === "127.0.0.1") {
      return `${SITE_CONFIG.url}${u.pathname}${u.search}`;
    }
    return href;
  } catch {
    return href;
  }
}

async function captureShareCardFromDom(): Promise<Blob> {
  const node = document.getElementById("kalam-share-card");
  if (!node) {
    throw new Error("Share preview card not found");
  }
  const captureBg =
    node.getAttribute("data-share-capture-bg") ||
    shareCardCaptureBackground(node.getAttribute("data-share-theme") === "light" ? "light" : "dark");
  const { toPng } = await import("html-to-image");
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
    backgroundColor: captureBg,
    skipFonts: false,
    style: {
      transform: "none",
    },
  });
  const res = await fetch(dataUrl);
  return res.blob();
}

/** Prefer on-screen card (pattern + Urdu fonts match preview); API is fallback. */
export async function fetchShareCardBlob(_payload: ShareCardPayload): Promise<Blob> {
  if (typeof document !== "undefined" && document.getElementById("kalam-share-card")) {
    try {
      return await captureShareCardFromDom();
    } catch {
      /* fall through */
    }
  }

  let theme: SharePostTheme = "dark";
  if (typeof document !== "undefined") {
    const el = document.getElementById("kalam-share-card");
    if (el?.getAttribute("data-share-theme") === "light") theme = "light";
    else if (document.documentElement.classList.contains("light")) theme = "light";
  }

  const res = await fetch("/api/share-card", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ..._payload,
      pageUrl: normalizeSharePageUrl(_payload.pageUrl),
      theme,
    }),
  });
  if (!res.ok) {
    throw new Error("Could not generate share image");
  }
  const blob = await res.blob();
  if (blob.size < 800) {
    throw new Error("Could not generate share image");
  }
  return blob;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export type WhatsAppShareResult = "native-with-image" | "whatsapp-text" | "text-plus-download";

/**
 * Share the composed post on WhatsApp (any contact).
 * Mobile: system share with image+caption when supported; else WhatsApp app + text.
 * Desktop: WhatsApp Web with caption; downloads PNG to attach when image exists.
 */
export async function sharePostOnWhatsApp(params: {
  caption: string;
  title: string;
  imageBlob?: Blob | null;
}): Promise<WhatsAppShareResult> {
  const { caption, title, imageBlob } = params;

  if (imageBlob) {
    const file = new File([imageBlob], "kalam-post.png", { type: "image/png" });
    const payload: ShareData = { text: caption, files: [file] };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        if (!navigator.canShare || navigator.canShare(payload)) {
          await navigator.share({
            title: `${title} | ${SITE_CONFIG.name}`,
            ...payload,
          });
          return "native-with-image";
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") throw err;
      }
    }
  }

  const forwardUrl = buildWhatsAppForwardUrl(caption);
  const mobile =
    typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (mobile) {
    window.location.assign(forwardUrl);
  } else {
    window.open(forwardUrl, "_blank", "noopener,noreferrer");
  }

  if (imageBlob) {
    downloadBlob(imageBlob, "kalam-post.png");
    return "text-plus-download";
  }
  return "whatsapp-text";
}
