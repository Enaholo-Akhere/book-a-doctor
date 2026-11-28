'use client';
import { useState } from 'react';

/**
 * Shows a PDF with the browser's built-in viewer. Needs nothing installed:
 * just a URL the browser can open (e.g. an admin document link ending in .pdf).
 */
const PdfIframeViewer = ({ url, title, className = '' }: { url: string; title: string; className?: string }) => {
  // Keep the first link so a refreshed one doesn't reload the frame. Mount with a new `key` for another document.
  const [src] = useState(url);
  return <iframe src={src} title={title} className={`h-[80vh] w-full rounded-2xl border border-slate-200 bg-slate-50 ${className}`} />;
};

export default PdfIframeViewer;
