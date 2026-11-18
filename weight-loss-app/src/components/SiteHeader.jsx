import { Link, NavLink } from 'react-router-dom';
import { Leaf, Menu } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const NAV = [
  { to: '/weight-suggestions', label: 'Weight Suggestions' },
  { to: '/meal-plan-generator', label: 'Meal Planner' },
];

const navClass = ({ isActive }) => (isActive ? 'menu-active' : '');

// Closes the mobile dropdown after a choice (daisyUI dropdowns open on focus).
const blur = () => document.activeElement?.blur();

export default function SiteHeader({ isAuthenticated, onLogout }) {
  const authItems =
    isAuthenticated === null ? null : isAuthenticated ? (
      <>
        <li>
          <NavLink to="/account" className={navClass} onClick={blur}>
            Account
          </NavLink>
        </li>
        <li>
          <button
            onClick={() => {
              blur();
              onLogout();
            }}
          >
            Log out
          </button>
        </li>
      </>
    ) : (
      <>
        <li>
          <NavLink to="/login" className={navClass} onClick={blur}>
            Log in
          </NavLink>
        </li>
      </>
    );

  return (
    <header className="navbar sticky top-0 z-40 border-b border-base-300 bg-base-100/90 px-4 backdrop-blur sm:px-6 lg:px-10">
      <div className="navbar-start gap-2">
        <div className="dropdown lg:hidden">
          <button tabIndex={0} className="btn btn-ghost btn-square btn-sm" aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <ul tabIndex={0} className="menu dropdown-content z-50 mt-3 w-56 rounded-box bg-base-100 p-2 shadow-lg">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} className={navClass} onClick={blur}>
                  {n.label}
                </NavLink>
              </li>
            ))}
            <li className="menu-title">Account</li>
            {authItems}
            {isAuthenticated === false && (
              <li>
                <NavLink to="/register" className={navClass} onClick={blur}>
                  Sign up
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        <Link to="/" className="flex items-center gap-2 whitespace-nowrap text-base font-bold sm:text-lg">
          <Leaf className="size-6 text-primary" />
          Weight Loss App
        </Link>
      </div>

      <nav className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-1">
          {NAV.map((n) => (
            <li key={n.to}>
              <NavLink to={n.to} className={navClass}>
                {n.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="navbar-end gap-1">
        <ul className="menu menu-horizontal hidden gap-1 lg:flex">{authItems}</ul>
        {isAuthenticated === false && (
          <Link to="/register" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Sign up
          </Link>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
