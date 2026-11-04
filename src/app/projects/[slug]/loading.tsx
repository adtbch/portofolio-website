export default function ProjectLoading() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mb-8 h-3 w-32 animate-pulse bg-border" />
        <div className="mb-4 h-10 w-2/3 animate-pulse bg-border" />
        <div className="mb-10 h-4 w-1/3 animate-pulse bg-border" />
        <div className="mb-10 aspect-video w-full animate-pulse bg-surface" />
        <div className="space-y-3">
          <div className="h-3 w-full animate-pulse bg-border" />
          <div className="h-3 w-11/12 animate-pulse bg-border" />
          <div className="h-3 w-4/5 animate-pulse bg-border" />
        </div>
      </div>
    </div>
  );
}
