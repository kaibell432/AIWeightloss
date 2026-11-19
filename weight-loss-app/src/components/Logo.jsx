import { Link } from 'react-router-dom';

// Two stations joined by the line: the product's mark.
export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 rounded-full font-bold whitespace-nowrap">
      <svg viewBox="0 0 40 20" className="h-5 w-10" aria-hidden="true">
        <path d="M8 10 H32" stroke="var(--color-route)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="8" cy="10" r="6" fill="var(--color-panel)" stroke="var(--color-ink)" strokeWidth="3.5" />
        <circle cx="32" cy="10" r="6" fill="var(--color-stop)" stroke="var(--color-ink)" strokeWidth="3.5" />
      </svg>
      <span className="text-[1.05rem] tracking-tight">Weight Loss App</span>
    </Link>
  );
}
