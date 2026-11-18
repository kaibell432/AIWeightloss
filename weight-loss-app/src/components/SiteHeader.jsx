import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Leaf, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ThemeToggle from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

const NAV = [
  { to: '/weight-suggestions', label: 'Weight Suggestions' },
  { to: '/meal-plan-generator', label: 'Meal Planner' },
];

const linkClass = ({ isActive }) =>
  cn(
    'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground',
    isActive ? 'text-foreground' : 'text-muted-foreground'
  );

export default function SiteHeader({ isAuthenticated, onLogout }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const authLinks =
    isAuthenticated === null ? null : isAuthenticated ? (
      <>
        <NavLink to="/account" className={linkClass} onClick={close}>
          Account
        </NavLink>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            close();
            onLogout();
          }}
        >
          Log out
        </Button>
      </>
    ) : (
      <>
        <NavLink to="/login" className={linkClass} onClick={close}>
          Log in
        </NavLink>
        <Button asChild size="sm">
          <Link to="/register" onClick={close}>
            Sign up
          </Link>
        </Button>
      </>
    );

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Leaf className="size-5 text-primary" />
          <span>Weight Loss App</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={linkClass}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-1 md:flex">
          {authLinks}
          <ThemeToggle />
        </div>

        <div className="ml-auto flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col items-start gap-1 px-4">
                {NAV.map((n) => (
                  <NavLink key={n.to} to={n.to} className={linkClass} onClick={close}>
                    {n.label}
                  </NavLink>
                ))}
                <div className="my-2 h-px w-full bg-border" />
                {authLinks}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
