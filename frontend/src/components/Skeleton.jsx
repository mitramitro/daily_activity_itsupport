export function SkeletonCard({ className = "" }) {
  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

export function SkeletonLine({ width = "full", className = "" }) {
  return (
    <div className={`h-4 bg-gray-200 rounded animate-pulse ${className}`}
      style={{ width: width === "full" ? "100%" : width }}
    />
  );
}

export function SkeletonCircle({ size = 10, className = "" }) {
  return (
    <div className={`bg-gray-200 rounded-full animate-pulse ${className}`}
      style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
    />
  );
}

export function SkeletonStatCards() {
  return (
    <div className="grid grid-cols-3 gap-3 mt-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl bg-white/20 p-3 animate-pulse">
          <div className="h-3 bg-white/30 rounded w-2/3 mb-2" />
          <div className="h-7 bg-white/30 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonRecentList() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
