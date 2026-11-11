type Props = {
  className?: string;
};

/** Same Urdu wordmark as the public navbar (not the PNG logo). */
export default function KalamLibraryWordmark({ className = "" }: Props) {
  return (
    <span lang="ur" dir="rtl" className={`font-urdu font-bold leading-none text-gold-500 ${className}`.trim()}>
      کلام لائبریری
    </span>
  );
}
