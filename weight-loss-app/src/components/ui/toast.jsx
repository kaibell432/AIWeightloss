import { useEffect, useState } from 'react';
import { Toast as T } from 'radix-ui';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';

// Module-level API on top of Radix Toast:
// toast.success('Saved'), toast.error('Oops'), toast('Note', { action: { label, onClick } })
let push = null;
let nextId = 1;
const emit = (type) => (message, opts = {}) => push?.({ id: nextId++, type, message, action: opts.action });
export const toast = Object.assign(emit('info'), { success: emit('success'), error: emit('error') });

const ICON = {
  success: <CircleCheck className="size-5 shrink-0 text-route" />,
  error: <CircleAlert className="size-5 shrink-0 text-danger" />,
  info: <Info className="size-5 shrink-0 text-under" />,
};

export function Toaster() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    push = (item) => setItems((list) => [...list, item]);
    return () => {
      push = null;
    };
  }, []);

  const remove = (id) => setItems((list) => list.filter((t) => t.id !== id));

  return (
    <T.Provider swipeDirection="down">
      {items.map((t) => (
        <T.Root
          key={t.id}
          duration={t.action ? 7000 : 4500}
          onOpenChange={(open) => !open && remove(t.id)}
          className="flex items-center gap-3 rounded-2xl bg-panel py-3 pr-2 pl-4 shadow-pop ring-1 ring-rule data-[state=open]:animate-rise"
        >
          {ICON[t.type]}
          <T.Description className="flex-1 text-[0.95rem]">{t.message}</T.Description>
          {t.action && (
            <T.Action altText={t.action.label} asChild>
              <button
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-route-ink hover:bg-route-soft"
                onClick={t.action.onClick}
              >
                {t.action.label}
              </button>
            </T.Action>
          )}
          <T.Close aria-label="Dismiss" className="rounded-full p-1.5 text-muted hover:bg-well">
            <X className="size-4" />
          </T.Close>
        </T.Root>
      ))}
      <T.Viewport className="fixed bottom-6 left-1/2 z-[100] flex w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 flex-col gap-2 outline-none" />
    </T.Provider>
  );
}
