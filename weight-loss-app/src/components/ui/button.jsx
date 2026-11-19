import { forwardRef } from 'react';
import { Slot } from 'radix-ui';
import { cx } from '@/lib/cx';

const VARIANTS = {
  primary: 'bg-ink text-white hover:bg-[#2c3633] active:bg-black',
  route: 'bg-route text-white hover:bg-[#278a5f] active:bg-route-ink',
  outline: 'bg-panel text-ink ring-1 ring-inset ring-rule hover:ring-ink/40 hover:bg-well',
  ghost: 'text-ink hover:bg-well',
  danger: 'bg-danger text-white hover:bg-[#9a1d14]',
  'danger-ghost': 'text-danger hover:bg-danger-soft',
};

const SIZES = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-5 text-[0.95rem] gap-2',
  lg: 'h-13 px-7 text-base gap-2',
  icon: 'size-10 justify-center',
};

export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', asChild = false, className, ...props },
  ref
) {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      ref={ref}
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold whitespace-nowrap',
        'transition-[background-color,box-shadow,transform,color] duration-200 ease-out-expo active:scale-[0.98]',
        'disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-[1.1em] [&_svg]:shrink-0',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    />
  );
});

export function Spinner({ className }) {
  return (
    <span
      aria-hidden="true"
      className={cx('inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent', className)}
    />
  );
}
