import { unstable_cache } from "next/cache";
import { supabase } from "@/utils/supabase";
import { PAGE_REVALIDATE_SECONDS } from "@/utils/cacheConfig";
import { filterListedAuthors, getAuthorUrduName } from "@/utils/authorHelper";
import Navbar, { type NavPoet } from "@/components/Navbar";

/** The menu lists this many poets (most kalams first) plus "All poets"; the rest live on /authors. */
const NAV_TOP_POETS = 6;

function slugifyAuthorName(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-");
}

function kalamCount(row: { kalams?: Array<{ count: number }> | null }): number {
  return row.kalams?.[0]?.count ?? 0;
}

const loadNavPoets = unstable_cache(
  async (): Promise<NavPoet[]> => {
    const { data: authors } = await supabase
      .from("authors")
      .select("name_roman, name_urdu, kalams(count)");

    return filterListedAuthors(authors)
      .sort((a, b) => kalamCount(b) - kalamCount(a) || a.name_roman.localeCompare(b.name_roman))
      .slice(0, NAV_TOP_POETS)
      .map((author) => ({
        nameRoman: author.name_roman,
        nameUrdu: getAuthorUrduName(author),
        href: `/author/${slugifyAuthorName(author.name_roman)}`,
      }));
  },
  ["navbar-top-poets"],
  { revalidate: PAGE_REVALIDATE_SECONDS }
);

export default async function NavbarWithPoets() {
  const poets = await loadNavPoets();
  return <Navbar poets={poets} />;
}
