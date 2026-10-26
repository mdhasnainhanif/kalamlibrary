import Link from "next/link";

export default function ReportErrorLink({ title }: { title: string }) {
  const subject = `Report an error: ${title}`;
  return (
    <p className="mt-8 text-center text-xs text-gray-400 max-w-xl mx-auto leading-relaxed">
      Lyrics are digitized from printed books with an AI-assisted pipeline and may contain mistakes.
      {" "}
      <Link
        href={`/contact?subject=${encodeURIComponent(subject)}`}
        rel="nofollow"
        className="cursor-pointer text-emerald-400 hover:text-gold-500 font-semibold underline underline-offset-2"
      >
        Report an error
      </Link>
      .
    </p>
  );
}
