import { useEffect, useState } from 'react';

// Tiny toast system on top of daisyUI's toast + alert classes.
// Usage: toast.success('Saved'), toast.error('Oops'), toast('Info', { action: { label, onClick } })
let listener = null;
let nextId = 1;

function push(type, message, opts = {}) {
  listener?.({ id: nextId++, type, message, action: opts.action });
}

export const toast = Object.assign((message, opts) => push('info', message, opts), {
  success: (message, opts) => push('success', message, opts),
  error: (message, opts) => push('error', message, opts),
});

const ALERT_CLASS = { success: 'alert-success', error: 'alert-error', info: 'alert-info' };

export function Toaster() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    listener = (item) => {
      setItems((list) => [...list, item]);
      setTimeout(() => setItems((list) => list.filter((t) => t.id !== item.id)), item.action ? 7000 : 4000);
    };
    return () => {
      listener = null;
    };
  }, []);

  const dismiss = (id) => setItems((list) => list.filter((t) => t.id !== id));

  return (
    <div className="toast toast-top toast-center z-[100]" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} role="status" className={`alert ${ALERT_CLASS[t.type]} shadow-lg`}>
          <span>{t.message}</span>
          {t.action && (
            <button
              className="btn btn-sm"
              onClick={() => {
                dismiss(t.id);
                t.action.onClick();
              }}
            >
              {t.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
