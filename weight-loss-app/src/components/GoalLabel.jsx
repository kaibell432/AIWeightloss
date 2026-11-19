import { cx } from '@/lib/cx';

// Colour plus words: state never depends on colour alone.
const STYLES = {
  ok: ['On target', 'bg-route-soft text-route-ink'],
  over: ['Over goal', 'bg-over-soft text-over'],
  under: ['Under goal', 'bg-under-soft text-under'],
};

export default function GoalLabel({ status }) {
  if (!status) return null;
  const [label, tone] = STYLES[status];
  return (
    <span className={cx('inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold', tone)}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
