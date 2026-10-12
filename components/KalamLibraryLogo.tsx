import Image from "next/image";
import Link from "next/link";

const LOGO_SRC = "/kalam-library-logo.png";

type KalamLibraryLogoProps = {
  size?: "nav" | "footer" | "hero" | "share";
  className?: string;
  priority?: boolean;
  linked?: boolean;
};

const sizeClass: Record<NonNullable<KalamLibraryLogoProps["size"]>, string> = {
  nav: "h-9 w-auto max-w-[200px] md:h-11 md:max-w-[240px]",
  footer: "h-10 w-auto max-w-[220px]",
  hero: "h-14 w-auto max-w-[280px] md:h-[4.5rem] md:max-w-[360px]",
  share: "h-6 w-auto max-w-[130px] sm:h-7 sm:max-w-[150px]",
};

export default function KalamLibraryLogo({
  size = "nav",
  className = "",
  priority = false,
  linked = false,
}: KalamLibraryLogoProps) {
  const img = (
    <Image
      src={LOGO_SRC}
      alt="Kalam Library"
      width={360}
      height={90}
      priority={priority}
      className={`object-contain object-left ${sizeClass[size]} ${className}`}
    />
  );

  if (linked) {
    return (
      <Link href="/" aria-label="Kalam Library Home" className="inline-flex shrink-0 items-center">
        {img}
      </Link>
    );
  }

  return <span className="inline-flex shrink-0 items-center">{img}</span>;
}
