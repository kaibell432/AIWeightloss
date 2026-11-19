import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="page flex flex-col items-center py-28 text-center">
      <svg viewBox="0 0 200 40" className="h-10 w-50" aria-hidden="true">
        <path d="M20 20 H120" stroke="var(--color-route)" strokeWidth="8" strokeLinecap="round" />
        <path d="M140 20 H180" stroke="var(--color-rule)" strokeWidth="8" strokeLinecap="round" strokeDasharray="2 14" />
        <circle cx="20" cy="20" r="11" fill="var(--color-panel)" stroke="var(--color-ink)" strokeWidth="6" />
        <circle cx="120" cy="20" r="11" fill="var(--color-panel)" stroke="var(--color-ink)" strokeWidth="6" />
      </svg>
      <h1 className="mt-8 text-3xl font-bold tracking-tight">This stop isn't on the line</h1>
      <p className="mt-2 text-muted">The page you're looking for doesn't exist or has moved.</p>
      <Button asChild className="mt-8">
        <Link to="/">Back to the start</Link>
      </Button>
    </div>
  );
}
