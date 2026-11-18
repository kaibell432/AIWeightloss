import { useEffect, useState } from 'react';

// Render's free tier sleeps after ~15 min idle; the first request can take ~1 min.
// Show a friendly notice if the initial auth check is slow.
export default function ServerWaking({ ready }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (ready) return setSlow(false);
    const t = setTimeout(() => setSlow(true), 2500);
    return () => clearTimeout(t);
  }, [ready]);

  if (ready || !slow) return null;

  return (
    <div role="status" className="alert alert-info alert-soft rounded-none px-4 sm:px-6 lg:px-10">
      <span className="loading loading-spinner loading-sm" />
      <span>Waking up the server. This can take up to a minute after it has been idle.</span>
    </div>
  );
}
