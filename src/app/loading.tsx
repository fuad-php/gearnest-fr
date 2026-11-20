export default function Loading() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative size-12">
          <span className="absolute inset-0 rounded-full border-2 border-border" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary" />
        </div>
        <p className="label-mono text-muted-foreground">Loading GearNest</p>
      </div>
    </div>
  );
}
