import Link from "next/link";
import { kalamHref } from "@/utils/kalam";
import { kalamGridCardClass, kalamGridCardFooterClass } from "@/utils/kalamCardStyles";

export type DuroodKalamItem = {
  id: string;
  slug: string;
  primary_title_roman: string;
  primary_title_urdu: string | null;
  authorName: string;
};

type DuroodKalamListProps = {
  kalams: DuroodKalamItem[];
  ariaLabel?: string;
};

export default function DuroodKalamList({ kalams, ariaLabel = "Durood and Salam kalams" }: DuroodKalamListProps) {
  return (
    <section
      aria-label={ariaLabel}
      className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {kalams.map((kalam) => (
        <Link
          key={kalam.id}
          href={kalamHref(kalam.slug)}
          className={kalamGridCardClass}
          aria-label={
            kalam.authorName
              ? `Read ${kalam.primary_title_roman} by ${kalam.authorName}`
              : `Read ${kalam.primary_title_roman}`
          }
        >
          <div className="kalam-list-card__body space-y-1.5">
            <h2 className="kalam-list-title kalam-list-title--4 text-sm font-semibold leading-snug text-slate-800 transition-colors group-hover:text-gold-500 dark:text-gray-100">
              {kalam.primary_title_roman}
            </h2>
            {kalam.primary_title_urdu ? (
              <p lang="ur" dir="rtl" className="kalam-list-urdu font-urdu text-base text-emerald-700 dark:text-emerald-400/90">
                {kalam.primary_title_urdu}
              </p>
            ) : null}
          </div>
          <div className={kalamGridCardFooterClass}>
            {kalam.authorName ? (
              <span className="kalam-card-author text-xs text-gray-500 dark:text-gray-400">{kalam.authorName}</span>
            ) : null}
          </div>
        </Link>
      ))}
    </section>
  );
}
