export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-7 border-b border-border pb-6">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="mt-3 h-8 w-64 rounded bg-muted" />
        <div className="mt-3 h-3 w-full max-w-lg rounded bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="h-40 rounded-2xl border border-border bg-card" />
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="h-64 rounded-2xl border border-border bg-card" />
        <div className="h-64 rounded-2xl border border-border bg-card" />
      </div>
    </div>
  );
}
