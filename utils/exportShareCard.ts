import { SITE_CONFIG } from "@/utils/seoConfig";
import { buildWhatsAppForwardUrl } from "@/utils/shareKalamPost";
import { captureShareCardNode } from "@/utils/shareCardDesign";

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

/** Capture the on-screen #kalam-share-card (matches preview). */
export async function fetchShareCardBlob(_payload: ShareCardPayload): Promise<Blob> {
  const node = document.getElementById("kalam-share-card");
  if (!node) {
    throw new Error("Share preview card not found");
  }
  const bg = node.getAttribute("data-share-capture-bg") || "#031510";
  return captureShareCardNode(node, bg);
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
