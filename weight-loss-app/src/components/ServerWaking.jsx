import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

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
    <div className="border-b bg-muted/60">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Waking up the server. This can take up to a minute after it has been idle.
      </div>
    </div>
  );
}
