interface StatCardProps {
  label: string;
  value: number | string;
  variant?: "default" | "warning";
}

export default function StatCard({ label, value, variant = "default" }: StatCardProps) {
  return (
    <article className={`stat-card stat-card-${variant}`}>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </article>
  );
}
