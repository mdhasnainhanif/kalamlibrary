/** Same eight-point tile as HeroIslamicPattern — for PNG/share backgrounds (Satori). */
export function getIslamicHeroPatternDataUri(stroke = "#eab308", opacity = 0.32): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
<path d="M60 8 L72 48 L112 60 L72 72 L60 112 L48 72 L8 60 L48 48 Z" fill="none" stroke="${stroke}" stroke-width="0.65" opacity="${opacity}"/>
<path d="M60 28 L60 92 M28 60 L92 60 M36 36 L84 84 M36 84 L84 36" fill="none" stroke="${stroke}" stroke-width="0.45" opacity="${opacity}"/>
<circle cx="60" cy="60" r="10" fill="none" stroke="${stroke}" stroke-width="0.5" opacity="${opacity}"/>
<path d="M60 42 L66 60 L60 78 L54 60 Z" fill="none" stroke="${stroke}" stroke-width="0.4" opacity="${opacity}"/>
<path d="M0 0 L30 0 L0 30 Z M120 0 L90 0 L120 30 Z M0 120 L30 120 L0 90 Z M120 120 L90 120 L120 90 Z" fill="none" stroke="${stroke}" stroke-width="0.35" opacity="${opacity * 0.85}"/>
<path d="M0 60 Q30 30 60 0 M60 0 Q90 30 120 60 M120 60 Q90 90 60 120 M60 120 Q30 90 0 60" fill="none" stroke="${stroke}" stroke-width="0.3" opacity="${opacity * 0.75}"/>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
