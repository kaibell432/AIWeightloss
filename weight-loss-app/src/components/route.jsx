import { useEffect, useRef, useState } from 'react';
import { Collapsible } from 'radix-ui';
import { ChevronDown } from 'lucide-react';
import { cx } from '@/lib/cx';

// Spaced separator dot (the font's middle dot sits too tight).
export function Dot() {
  return <span aria-hidden="true" className="mx-1.5 inline-block size-[3px] -translate-y-[0.2em] rounded-full bg-current opacity-60" />;
}

/* ------------------------------------------------------------------ */
/* Station dot: the one mark the whole world is built from.           */
/* ------------------------------------------------------------------ */
export function Station({ tone = 'ink', size = 'md', className }) {
  const ring = { ink: 'border-ink', route: 'border-route', stop: 'border-ink bg-stop' }[tone];
  const dims = { sm: 'size-4 border-[3.5px]', md: 'size-5 border-[4.5px]', lg: 'size-6 border-[5px]' }[size];
  return <span aria-hidden="true" className={cx('block shrink-0 rounded-full bg-panel', dims, ring, className)} />;
}

/* ------------------------------------------------------------------ */
/* Hero route: one winding line with the day's stops (desktop).       */
/* Example data, labelled as such in the UI.                          */
/* ------------------------------------------------------------------ */
const HERO_STOPS = [
  { x: 70, y: 70, label: 'Breakfast', meal: 'Greek yogurt, berries, oats', kcal: 420, lx: 48, ly: 128 },
  { x: 520, y: 200, label: 'Lunch', meal: 'Chicken and rice bowl', kcal: 640, lx: 556, ly: 186 },
  { x: 700, y: 390, label: 'Snack', meal: 'Apple and peanut butter', kcal: 230, lx: 420, ly: 396 },
  { x: 760, y: 640, label: 'Dinner', meal: 'Lemon herb chicken, greens', kcal: 760, lx: 470, ly: 632, end: true },
];
const HERO_PATH = 'M70 70 H460 a60 60 0 0 1 60 60 V270 a60 60 0 0 0 60 60 H640 a60 60 0 0 1 60 60 V520 a60 60 0 0 0 60 60 V640';

// Draws the line once on mount. The resting (CSS) state is the drawn line, so a
// capture, print, or restored page never shows it missing.
function useDrawOnce() {
  const ref = useRef(null);
  useEffect(() => {
    const path = ref.current;
    if (!path?.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const len = path.getTotalLength();
    const anim = path.animate(
      [
        { strokeDasharray: `${len} ${len}`, strokeDashoffset: len },
        { strokeDasharray: `${len} ${len}`, strokeDashoffset: 0 },
      ],
      { duration: 1100, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );
    return () => anim.cancel();
  }, []);
  return ref;
}

export function RouteMap({ className }) {
  const pathRef = useDrawOnce();
  return (
    <figure className={cx('relative', className)}>
      <figcaption className="mb-3 ml-[8%] text-sm font-semibold text-muted">Example day, 2,050 kcal</figcaption>
      <svg viewBox="0 0 860 720" className="h-auto w-full overflow-visible" role="img" aria-labelledby="route-title">
        <title id="route-title">Example day: breakfast, lunch, snack and dinner, 2,050 calories in total</title>
        <path
          ref={pathRef}
          d={HERO_PATH}
          stroke="var(--color-route)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {HERO_STOPS.map((s, i) => (
          <g key={s.label} className="animate-settle" style={{ animationDelay: `${250 + i * 220}ms` }}>
            <circle cx={s.x} cy={s.y} r={s.end ? 22 : 18} fill={s.end ? 'var(--color-stop)' : 'var(--color-panel)'} stroke="var(--color-ink)" strokeWidth="7" />
            <text x={s.lx} y={s.ly} className="fill-ink text-[26px] font-bold">
              {s.label}
            </text>
            <text x={s.lx} y={s.ly + 30} className="fill-muted text-[20px]">
              {s.meal}
            </text>
            <text x={s.lx} y={s.ly + 58} className="tnum fill-muted text-[20px] font-semibold">
              {s.kcal} kcal
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Vertical route: a list of stops joined by the line (any width).    */
/* ------------------------------------------------------------------ */
const LINE_TONE = { ok: 'bg-route', over: 'bg-over', under: 'bg-under' };

export function RouteList({ stops, className, compact = false, status }) {
  return (
    <ol className={cx('relative', className)}>
      {stops.map((s, i) => (
        <li
          key={i}
          className={cx('animate-rise relative flex gap-4', compact ? 'pb-4 last:pb-0' : 'pb-6 last:pb-0')}
          style={{ animationDelay: `${120 + i * 110}ms` }}
        >
          {i < stops.length - 1 && (
            <span
              aria-hidden="true"
              className={cx('route-grow absolute top-3 -bottom-3 left-[9px] w-1 origin-top rounded-full', LINE_TONE[status] || 'bg-route')}
              style={{ animationDelay: `${i * 110}ms` }}
            />
          )}
          <Station tone={s.end ? 'stop' : 'ink'} className="relative mt-0.5" />
          <div className="min-w-0 flex-1">{s.content}</div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* A meal plan as its own line: meals are stops, portions fold away.  */
/* ------------------------------------------------------------------ */
const sumProtein = (items) => items.reduce((s, i) => s + (Number(i.protein) || 0), 0);
const MEAL_ORDER = { Breakfast: 0, Lunch: 1, Snack: 2, Dinner: 3 };
const byMealTime = (a, b) => (MEAL_ORDER[a.mealType] ?? 2) - (MEAL_ORDER[b.mealType] ?? 2);

export function PlanRoute({ plan, defaultOpen = false, status }) {
  const [open, setOpen] = useState(defaultOpen);
  const meals = [...plan.meals].sort(byMealTime);
  const stops = meals.map((meal, i) => ({
    end: i === meals.length - 1,
    content: (
      <>
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p className="text-sm font-semibold text-muted">{meal.mealType}</p>
          <p className="tnum text-sm text-muted">
            {meal.calories} kcal<Dot />{meal.protein ?? sumProtein(meal.items)}g protein
          </p>
        </div>
        <p className="font-semibold leading-snug">{meal.mealName}</p>
        <Collapsible.Content className="overflow-hidden data-[state=closed]:animate-[collapse_220ms_ease-out] data-[state=open]:animate-[expand_260ms_var(--ease-out-expo)]">
          <ul className="mt-2 space-y-1 text-sm">
            {meal.items.map((item, j) => (
              <li key={j} className="flex justify-between gap-3 border-b border-rule pb-1 last:border-0">
                <span>{item.item}</span>
                <span className="tnum shrink-0 text-muted">
                  {item.calories} kcal<Dot />{item.protein}g
                </span>
              </li>
            ))}
          </ul>
        </Collapsible.Content>
      </>
    ),
  }));

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <RouteList stops={stops} compact status={status} />
      <Collapsible.Trigger className="mt-4 inline-flex items-center gap-1 rounded-full px-2 py-1 -ml-2 text-sm font-semibold text-route-ink hover:bg-route-soft">
        {open ? 'Hide portions' : 'Show portions'}
        <ChevronDown className={cx('size-4 transition-transform duration-300', open && 'rotate-180')} />
      </Collapsible.Trigger>
    </Collapsible.Root>
  );
}

/* ------------------------------------------------------------------ */
/* Progress: a marker travels the line while the AI works.            */
/* ------------------------------------------------------------------ */
export function TravelProgress({ message, className }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div role="status" aria-live="polite" className={cx('rounded-panel bg-panel p-6 shadow-panel sm:p-8', className)}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-semibold">{message}</p>
        <p className="tnum text-sm text-muted">{seconds}s</p>
      </div>
      <div className="relative mt-6 h-5">
        <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-rule" />
        <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-route/30" />
        <span className="animate-travel absolute top-0 size-5 rounded-full border-[4.5px] border-ink bg-stop" />
      </div>
      <p className="mt-4 text-sm text-muted">
        {seconds > 30
          ? 'The AI service is busy, so we switched to a backup model. Almost there.'
          : 'Reading your details and mapping each stop.'}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Target scale: the calorie range as a segment of a track.           */
/* ------------------------------------------------------------------ */
export function TargetScale({ min, max, floor = 1200, ceil = 3200 }) {
  const pct = (v) => Math.min(100, Math.max(0, ((v - floor) / (ceil - floor)) * 100));
  const fmt = (n) => n.toLocaleString();
  return (
    <div>
      <div className="relative h-6" aria-hidden="true">
        <span className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-rule" />
        <span
          className="route-grow-x absolute top-1/2 h-1.5 origin-left -translate-y-1/2 rounded-full bg-route"
          style={{ left: `${pct(min)}%`, width: `${pct(max) - pct(min)}%` }}
        />
        <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${pct(min)}%` }}>
          <Station size="lg" />
        </span>
        <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${pct(max)}%` }}>
          <Station size="lg" tone="stop" />
        </span>
      </div>
      <div className="tnum mt-2 flex justify-between text-xs text-muted">
        <span>{fmt(floor)}</span>
        <span>{fmt(ceil)} kcal</span>
      </div>
    </div>
  );
}
