import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 text-muted-foreground">That page doesn't exist or has moved.</p>
      <Button asChild className="mt-6">
        <Link to="/">Go home</Link>
      </Button>
    </div>
  );
}
