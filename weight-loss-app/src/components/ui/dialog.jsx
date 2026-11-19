import { AlertDialog as AD, Dialog as D } from 'radix-ui';
import { X } from 'lucide-react';
import { cx } from '@/lib/cx';
import { Button } from '@/components/ui/button';

const overlay = 'fixed inset-0 z-50 bg-ink/35 data-[state=open]:animate-[fade_200ms_ease-out]';
const content =
  'fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-panel bg-panel p-6 shadow-pop ' +
  'max-h-[88svh] overflow-y-auto focus:outline-none sm:p-8';

export function Dialog({ open, onOpenChange, title, description, children, footer, className }) {
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay className={overlay} />
        <D.Content className={cx(content, 'max-w-3xl', className)}>
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <D.Title className="text-xl font-bold">{title}</D.Title>
              {description && <D.Description className="mt-1 text-muted">{description}</D.Description>}
            </div>
            <D.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close">
                <X />
              </Button>
            </D.Close>
          </div>
          {children}
          {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}

export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel, onConfirm }) {
  return (
    <AD.Root open={open} onOpenChange={onOpenChange}>
      <AD.Portal>
        <AD.Overlay className={overlay} />
        <AD.Content className={cx(content, 'max-w-md')}>
          <AD.Title className="text-xl font-bold">{title}</AD.Title>
          <AD.Description className="mt-2 text-muted">{description}</AD.Description>
          <div className="mt-6 flex justify-end gap-2">
            <AD.Cancel asChild>
              <Button variant="ghost">Cancel</Button>
            </AD.Cancel>
            <AD.Action asChild>
              <Button variant="danger" onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </AD.Action>
          </div>
        </AD.Content>
      </AD.Portal>
    </AD.Root>
  );
}
