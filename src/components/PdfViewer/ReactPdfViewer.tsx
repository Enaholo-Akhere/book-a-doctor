'use client';
import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ZoomIn, ZoomOut } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { secondaryBtn } from '@/components/dashboard/shared/ui';

// pdf.js parses the file in a web worker, bundled from the installed pdfjs-dist.
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const iconBtn = `${secondaryBtn} !px-2.5 !py-2`;

/**
 * Renders every page of a PDF with react-pdf (pdf.js) in one scrollable
 * column, so it looks the same in every browser. Uses browser APIs: import it with next/dynamic and ssr: false.
 */
const ReactPdfViewer = ({ url, className = '' }: { url: string; className?: string }) => {
  // Keep the first link: a refreshed one (new token, same file) would reload the PDF and lose the scroll position.
  // Mount with a new `key` to show a different document.
  const [file] = useState(url);
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>();
  const [pages, setPages] = useState(0);
  const [scale, setScale] = useState(1);

  // Fit pages to the container width.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.min(entry.contentRect.width, 900)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={`rounded-2xl border border-slate-200 bg-slate-50 ${className}`}>
      <div className='flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2'>
        <span className='text-sm tabular-nums text-slate-600'>{pages ? `${pages} page${pages === 1 ? '' : 's'}` : 'Loading…'}</span>
        <div className='flex items-center gap-2'>
          <button type='button' className={iconBtn} onClick={() => setScale((s) => Math.max(0.5, s - 0.25))} disabled={scale <= 0.5} aria-label='Zoom out'>
            <ZoomOut size={16} />
          </button>
          <span className='w-12 text-center text-sm tabular-nums text-slate-600'>{Math.round(scale * 100)}%</span>
          <button type='button' className={iconBtn} onClick={() => setScale((s) => Math.min(3, s + 0.25))} disabled={scale >= 3} aria-label='Zoom in'>
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      <div ref={box} className='max-h-[75vh] overflow-auto p-4'>
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => setPages(numPages)}
          loading={<p className='py-16 text-sm text-slate-500'>Loading PDF…</p>}
          error={<p className='py-16 text-sm text-red-600'>Couldn’t load this PDF. The link may have expired; reload the page.</p>}
        >
          <div className='flex w-max min-w-full flex-col items-center gap-4'>
            {Array.from({ length: pages }, (_, i) => (
              <Page key={i + 1} pageNumber={i + 1} width={width} scale={scale} className='shadow-md' />
            ))}
          </div>
        </Document>
      </div>
    </div>
  );
};

export default ReactPdfViewer;
