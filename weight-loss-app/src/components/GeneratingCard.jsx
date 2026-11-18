import { useEffect, useState } from 'react';

// Loading state for AI calls, with an elapsed timer so long waits feel alive.
export default function GeneratingCard({ message, className = '' }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={`card card-border bg-base-100 ${className}`} aria-live="polite" aria-busy="true">
      <div className="card-body gap-4">
        <div className="flex items-center gap-3 text-base-content/70">
          <span className="loading loading-spinner text-primary" />
          <span>{message}</span>
          <span className="ml-auto tabular-nums">{seconds}s</span>
        </div>
        {seconds > 30 && (
          <p className="text-sm text-base-content/70">
            The AI service is busy right now, so we're trying a backup model. Hang tight.
          </p>
        )}
        <div className="space-y-3">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
