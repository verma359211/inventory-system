interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`skeleton ${className}`.trim()} aria-hidden="true" />;
}

export function StatCardsSkeleton() {
  return (
    <div className="stat-grid" aria-busy="true" aria-label="Loading statistics">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="stat-card">
          <Skeleton className="skeleton-stat-label" />
          <Skeleton className="skeleton-stat-value" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card table-card" aria-busy="true" aria-label="Loading table">
      <div className="table-skeleton">
        <Skeleton className="skeleton-table-header" />
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="skeleton-table-row" />
        ))}
      </div>
    </div>
  );
}
