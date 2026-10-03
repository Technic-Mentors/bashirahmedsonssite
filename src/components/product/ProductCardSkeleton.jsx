export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-4/5 rounded-lg bg-stone-200" />
      <div className="mt-1.5 h-4 w-3/4 rounded bg-stone-200" />
      <div className="mt-1.5 h-3 w-1/3 rounded bg-stone-200" />
      <div className="mt-1.5 h-4 w-1/4 rounded bg-stone-200" />
    </div>
  );
}
