import LanguageFonts from "@/components/LanguageFonts";

export default function KalamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LanguageFonts>{children}</LanguageFonts>;
}
