import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const THEMES = { light: 'emerald', dark: 'forest' };
const KEY = 'theme';

function initialMode() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function ThemeToggle() {
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', THEMES[mode]);
  }, [mode]);

  const toggle = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable */
    }
  };

  return (
    <button
      className="btn btn-ghost btn-square btn-sm"
      onClick={toggle}
      aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {mode === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}
