import { SITE_CONFIG } from "@/utils/seoConfig";

export type SharePostInput = {
  title: string;
  author?: string;
  /** Each item is one couplet/band (lines joined with newlines). */
  selectedStanzas: string[];
  pageUrl: string;
  siteUrl?: string;
  whatsappUrl?: string;
  whatsappDisplay?: string;
};

export function stanzaLinesToText(lines: string[]): string {
  return lines.join("\n").trim();
}

export function getShareContactDefaults() {
  return {
    siteUrl: SITE_CONFIG.url,
    whatsappUrl: SITE_CONFIG.whatsappUrl,
    whatsappDisplay:
      process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY?.trim() || "+92 317 4731957",
  };
}

/** Short caption when sharing image or compact text (no raw wa.me line). */
export function buildShareCaption(input: SharePostInput): string {
  const {
    title,
    author,
    selectedStanzas,
    pageUrl,
    siteUrl = SITE_CONFIG.url,
    whatsappDisplay = getShareContactDefaults().whatsappDisplay,
  } = input;

  const parts: string[] = [];
  parts.push(title.trim());
  if (author?.trim()) parts.push(author.trim());
  parts.push("");

  if (selectedStanzas.length > 0) {
    parts.push(selectedStanzas.map((s) => s.trim()).filter(Boolean).join("\n\n"));
    parts.push("");
  }

  parts.push(SITE_CONFIG.name);
  parts.push(pageUrl.trim());
  parts.push(siteUrl.replace(/^https?:\/\//, ""));
  parts.push(`Contact me: ${whatsappDisplay}`);

  return parts.join("\n").trim();
}

/** Plain-text post for clipboard & WhatsApp (includes contact line). */
export function buildSharePost(input: SharePostInput): string {
  return buildShareCaption(input);
}

/** User picks any contact — forward post (not the site support number). */
export function buildWhatsAppForwardUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** Message to a specific number (e.g. site support). */
export function buildWhatsAppShareUrl(text: string, whatsappUrl = SITE_CONFIG.whatsappUrl): string {
  const base = whatsappUrl.split("?")[0];
  return `${base}?text=${encodeURIComponent(text)}`;
}
