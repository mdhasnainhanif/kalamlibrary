import { supabase } from "@/utils/supabase";
import { filterListedAuthors, getAuthorUrduName, sortAuthorsForPoetsNav } from "@/utils/authorHelper";
import Navbar, { type NavPoet } from "@/components/Navbar";

function slugifyAuthorName(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-");
}

export default async function NavbarWithPoets() {
  const { data: authors } = await supabase
    .from("authors")
    .select("name_roman, name_urdu")
    .order("name_roman", { ascending: true });

  const poets: NavPoet[] = sortAuthorsForPoetsNav(filterListedAuthors(authors)).map((author) => ({
    nameRoman: author.name_roman,
    nameUrdu: getAuthorUrduName(author),
    href: `/author/${slugifyAuthorName(author.name_roman)}`,
  }));

  return <Navbar poets={poets} />;
}
