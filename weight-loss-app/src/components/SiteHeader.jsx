import { Link, NavLink } from 'react-router-dom';
import { DropdownMenu } from 'radix-ui';
import { Menu } from 'lucide-react';
import { cx } from '@/lib/cx';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';

const NAV = [
  { to: '/weight-suggestions', label: 'Weight suggestions' },
  { to: '/meal-plan-generator', label: 'Meal planner' },
];

const linkClass = ({ isActive }) =>
  cx(
    'relative rounded-full px-3.5 py-2 text-[0.95rem] font-semibold transition-colors duration-200',
    isActive ? 'bg-well text-ink' : 'text-muted hover:text-ink'
  );

const menuItem =
  'flex cursor-pointer items-center rounded-xl px-3 py-2.5 text-[0.95rem] font-semibold outline-none data-[highlighted]:bg-well';

// Wordmark left, plain links right (per the direction contract).
export default function SiteHeader({ isAuthenticated, onLogout }) {
  return (
    <header className="page sticky top-0 z-40 flex h-16 items-center gap-6 border-b border-rule bg-ground/85 backdrop-blur-md">
      <Logo />

      <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Main">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} className={linkClass}>
            {n.label}
          </NavLink>
        ))}
        {isAuthenticated !== null && <span aria-hidden="true" className="mx-2 h-5 w-px bg-rule" />}
        {isAuthenticated === true && (
          <>
            <NavLink to="/account" className={linkClass}>
              Account
            </NavLink>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              Log out
            </Button>
          </>
        )}
        {isAuthenticated === false && (
          <>
            <NavLink to="/login" className={linkClass}>
              Log in
            </NavLink>
            <Button asChild size="sm" className="ml-1">
              <Link to="/register">Sign up</Link>
            </Button>
          </>
        )}
      </nav>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="ghost" size="icon" className="ml-auto md:hidden" aria-label="Open menu">
            <Menu />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={8}
            className="z-50 w-60 rounded-2xl bg-panel p-1.5 shadow-pop ring-1 ring-rule data-[state=open]:animate-rise"
          >
            {NAV.map((n) => (
              <DropdownMenu.Item key={n.to} asChild className={menuItem}>
                <Link to={n.to}>{n.label}</Link>
              </DropdownMenu.Item>
            ))}
            <DropdownMenu.Separator className="my-1.5 h-px bg-rule" />
            {isAuthenticated ? (
              <>
                <DropdownMenu.Item asChild className={menuItem}>
                  <Link to="/account">Account</Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item className={menuItem} onSelect={onLogout}>
                  Log out
                </DropdownMenu.Item>
              </>
            ) : (
              <>
                <DropdownMenu.Item asChild className={menuItem}>
                  <Link to="/login">Log in</Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild className={menuItem}>
                  <Link to="/register">Sign up</Link>
                </DropdownMenu.Item>
              </>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  );
}
