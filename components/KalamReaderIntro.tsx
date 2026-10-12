type KalamReaderIntroProps = {
  text: string;
};

export default function KalamReaderIntro({ text }: KalamReaderIntroProps) {
  return (
    <section
      aria-label="About this kalam"
      className="mx-auto mb-6 w-full max-w-3xl rounded-xl border border-emerald-500/10 bg-white/60 px-4 py-3 text-left dark:bg-emerald-950/30"
    >
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
        About this naat
      </h2>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{text}</p>
    </section>
  );
}
