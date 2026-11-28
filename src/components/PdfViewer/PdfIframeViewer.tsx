'use client';
import { useState } from 'react';
import Loading from '@/components/Loader';

/**
 * Shows a PDF with the browser's built-in viewer. Needs nothing installed:
 * just a URL the browser can open (e.g. an admin document link ending in .pdf).
 * A spinner covers the frame until its load event fires.
 */
const PdfIframeViewer = ({ url, title, className = '' }: { url: string; title: string; className?: string }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative h-[80vh] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 ${className}`}>
      {!loaded && (
        <div role='status' aria-live='polite' className='absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-50'>
          <Loading />
          <span className='text-sm text-slate-500'>Loading PDF…</span>
        </div>
      )}
      <iframe src={url} title={title} onLoad={() => setLoaded(true)} className='h-full w-full' />
    </div>
  );
};

export default PdfIframeViewer;
