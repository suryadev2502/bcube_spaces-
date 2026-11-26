"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-6 text-center">
      <div>
        <h1 className="text-4xl">Something went wrong.</h1>
        <p className="mt-3 text-ink-500">Please try again in a moment.</p>
        <button onClick={reset} className="btn-dark mt-6">Try again</button>
      </div>
    </div>
  );
}
