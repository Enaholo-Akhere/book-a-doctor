'use client';
import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

/** Centered dialog with a dimmed backdrop; Escape or the backdrop closes it. */
const Modal = ({ title, onClose, children, footer }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className='fixed inset-0 z-[100] flex items-end justify-center bg-primary-950/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4' onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role='dialog' aria-modal='true' aria-label={title} className='max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]'>
        <div className='flex items-center justify-between gap-3 px-6 pb-2 pt-5'>
          <h2 className='text-lg font-semibold text-headingColor'>{title}</h2>
          <button type='button' onClick={onClose} aria-label='Close' className='cursor-pointer rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-headingColor'>
            <X size={18} />
          </button>
        </div>
        <div className='px-6 pb-4'>{children}</div>
        {footer && <div className='flex flex-wrap justify-end gap-2 border-t border-slate-100 px-6 py-4'>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
