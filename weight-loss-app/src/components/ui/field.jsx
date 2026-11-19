import { forwardRef } from 'react';
import { cx } from '@/lib/cx';

export const inputClass =
  'h-12 w-full rounded-field bg-well px-4 text-[0.95rem] text-ink placeholder:text-muted/80 ' +
  'ring-1 ring-inset ring-transparent transition-[box-shadow,background-color] duration-200 ' +
  'hover:ring-rule focus:bg-panel focus:ring-2 focus:ring-route focus:outline-none ' +
  'disabled:cursor-not-allowed disabled:text-muted disabled:hover:ring-transparent';

export function Field({ label, htmlFor, hint, error, className, children }) {
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : (
        hint && <p className="text-sm text-muted">{hint}</p>
      )}
    </div>
  );
}

export const Input = forwardRef(function Input({ className, suffix, ...props }, ref) {
  if (!suffix) return <input ref={ref} className={cx(inputClass, className)} {...props} />;
  return (
    <div className="relative">
      <input ref={ref} className={cx(inputClass, 'pr-12', className)} {...props} />
      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-muted">
        {suffix}
      </span>
    </div>
  );
});
