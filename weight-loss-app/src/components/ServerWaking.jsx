import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/button';

// Render's free tier sleeps after ~15 min idle; the first request can take ~1 min.
export default function ServerWaking({ ready }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (ready) return setSlow(false);
    const t = setTimeout(() => setSlow(true), 2500);
    return () => clearTimeout(t);
  }, [ready]);

  if (ready || !slow) return null;

  return (
    <div role="status" className="page flex items-center gap-3 bg-well py-2.5 text-sm text-ink">
      <Spinner />
      Waking up the server. This can take up to a minute after it has been idle.
    </div>
  );
}
