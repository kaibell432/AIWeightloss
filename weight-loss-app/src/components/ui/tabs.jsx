import { Tabs as T } from 'radix-ui';
import { cx } from '@/lib/cx';

export const Tabs = T.Root;
export const TabsContent = T.Content;

export function TabsList({ className, ...props }) {
  return <T.List className={cx('inline-flex rounded-full bg-well p-1', className)} {...props} />;
}

export function TabsTrigger({ className, ...props }) {
  return (
    <T.Trigger
      className={cx(
        'rounded-full px-4 py-2 text-sm font-semibold text-muted transition-[background-color,color,box-shadow] duration-200',
        'hover:text-ink data-[state=active]:bg-panel data-[state=active]:text-ink data-[state=active]:shadow-panel',
        className
      )}
      {...props}
    />
  );
}
