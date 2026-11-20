interface AdsterraBannerProps {
  referralUrl?: string;
  className?: string;
}

const DEFAULT_BANNER_SRC =
  "https://landings-cdn.adsterratech.com/referralBanners/png/728%20x%2090%20px.png";
const DEFAULT_REFERRAL_URL = "https://beta.publishers.adsterra.com/referral/PWhpxNfhui";

export default function AdsterraBanner({
  referralUrl = DEFAULT_REFERRAL_URL,
  className = "",
}: AdsterraBannerProps) {
  return (
    <div
      aria-label="Sponsored advertisement"
      className={`w-full flex justify-center items-center my-4 overflow-hidden px-2 ${className}`}
    >
      <a
        href={referralUrl}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className="block max-w-[728px] w-full rounded-xl overflow-hidden border border-emerald-500/15 shadow-sm hover:opacity-95 hover:border-gold-500/40 transition-all"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={DEFAULT_BANNER_SRC}
          alt="Monetize your traffic with Adsterra"
          width={728}
          height={90}
          className="w-full h-auto max-h-[90px] object-contain mx-auto rounded-xl"
          loading="lazy"
        />
      </a>
    </div>
  );
}
