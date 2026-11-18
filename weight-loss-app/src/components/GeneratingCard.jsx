import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Loading state for AI calls, with an elapsed timer so long waits feel alive.
export default function GeneratingCard({ message, className }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <Card className={cn(className)} aria-live="polite" aria-busy="true">
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-primary" />
          <span>{message}</span>
          <span className="ml-auto tabular-nums">{seconds}s</span>
        </div>
        {seconds > 30 && (
          <p className="text-sm text-muted-foreground">
            The AI service is busy right now, so we're trying a backup model. Hang tight.
          </p>
        )}
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
    </Card>
  );
}
