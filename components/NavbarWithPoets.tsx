import { unstable_cache } from "next/cache";
import { supabase } from "@/utils/supabase";
import { PAGE_REVALIDATE_SECONDS } from "@/utils/cacheConfig";
import { filterListedAuthors, getAuthorUrduName, sortAuthorsForPoetsNav } from "@/utils/authorHelper";
import Navbar, { type NavPoet } from "@/components/Navbar";

function slugifyAuthorName(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-");
}

const loadNavPoets = unstable_cache(
  async (): Promise<NavPoet[]> => {
    const { data: authors } = await supabase
      .from("authors")
      .select("name_roman, name_urdu")
      .order("name_roman", { ascending: true });

    return sortAuthorsForPoetsNav(filterListedAuthors(authors)).map((author) => ({
      nameRoman: author.name_roman,
      nameUrdu: getAuthorUrduName(author),
      href: `/author/${slugifyAuthorName(author.name_roman)}`,
    }));
  },
  ["navbar-poets"],
  { revalidate: PAGE_REVALIDATE_SECONDS }
);

export default async function NavbarWithPoets() {
  const poets = await loadNavPoets();
  return <Navbar poets={poets} />;
}
