import { useEffect, useRef } from 'react';

// daisyUI modal on a native <dialog>. Controlled with `open`; Esc/backdrop call onClose.
export default function Modal({ open, onClose, children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className="modal" onClose={onClose}>
      <div className={`modal-box ${className}`}>{children}</div>
      <form method="dialog" className="modal-backdrop">
        <button aria-label="Close">close</button>
      </form>
    </dialog>
  );
}
