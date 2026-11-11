type Props = {
  rating: number;
  label?: string;
};

export default function ReviewStars({ rating, label }: Props) {
  const value = Math.max(1, Math.min(5, Math.round(rating)));
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={label || `${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`text-sm ${i < value ? "text-gold-500" : "text-gray-400/50 dark:text-gray-600"}`}
          aria-hidden
        >
          ★
        </span>
      ))}
    </span>
  );
}
