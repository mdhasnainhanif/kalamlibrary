export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 animate-pulse">
      <div className="w-12 h-12 rounded-full border-3 border-amber-500/20 border-t-amber-400 animate-spin mb-6" />
      <div className="h-6 w-48 bg-emerald-950/70 border border-emerald-800/30 rounded-lg mb-3" />
      <div className="h-4 w-72 bg-emerald-950/40 rounded-md" />
    </div>
  );
}
