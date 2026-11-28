'use client';

/**
 * Shows a PDF with the browser's built-in viewer. Needs nothing installed:
 * just a URL the browser can open (e.g. an admin document link ending in .pdf).
 */
const PdfIframeViewer = ({ url, title, className = '' }: { url: string; title: string; className?: string }) => (
  <iframe src={url} title={title} className={`h-[80vh] w-full rounded-2xl border border-slate-200 bg-slate-50 ${className}`} />
);

export default PdfIframeViewer;
