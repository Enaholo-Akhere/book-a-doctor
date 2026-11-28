'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { FileText } from 'lucide-react';
import Loading from '@/components/Loader';
import { useAdminDocuments } from '@/Hook/useAdmin';
import { handleAxiosError } from '@/utils/axiosError';
import { EmptyState } from '@/components/dashboard/shared/ui';
import PdfIframeViewer from '@/components/PdfViewer/PdfIframeViewer';

// react-pdf uses browser-only APIs (canvas, web workers).
const ReactPdfViewer = dynamic(() => import('@/components/PdfViewer/ReactPdfViewer'), {
  ssr: false,
  loading: () => (
    <div role='status' aria-live='polite' className='flex h-[60vh] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50'>
      <Loading />
      <span className='text-sm text-slate-500'>Loading viewer…</span>
    </div>
  ),
});

type Mode = 'iframe' | 'react-pdf';
const MODES: { key: Mode; label: string }[] = [
  { key: 'iframe', label: 'Browser viewer (iframe)' },
  { key: 'react-pdf', label: 'react-pdf' },
];

const formatSize = (b: number) => (b < 1024 * 1024 ? `${Math.round(b / 1024)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

const AdminDocuments = () => {
  const { data, isLoading, error } = useAdminDocuments();
  const [selectedId, setSelectedId] = useState<string>();
  const [mode, setMode] = useState<Mode>('iframe');
  const selected = data?.find((d) => d.id === selectedId) ?? data?.[0];

  return (
    <div className='mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:py-8'>
      <header className='mb-6'>
        <h1 className='text-[28px] font-semibold tracking-tight text-headingColor'>Documents</h1>
        <p className='mt-1 text-sm text-slate-500'>PDFs for admins. Each has a permanent link that opens without logging in, so share it only with people who should see it.</p>
      </header>

      {isLoading ? (
        <Loading />
      ) : error ? (
        <p className='text-sm text-red-600'>{handleAxiosError(error)}</p>
      ) : !selected ? (
        <EmptyState icon={<FileText size={22} />} title='No documents yet' description='Add one with npm run add-admin-pdf in the backend.' />
      ) : (
        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[300px_minmax(0,1fr)]'>
          <ul className='space-y-2'>
            {data!.map((d) => (
              <li key={d.id}>
                <button
                  type='button'
                  onClick={() => setSelectedId(d.id)}
                  aria-current={d.id === selected.id}
                  className={`flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-3 text-left transition ${
                    d.id === selected.id ? 'border-primaryColor bg-primaryColor/5' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <FileText size={18} className='mt-0.5 shrink-0 text-primaryColor' />
                  <span className='min-w-0'>
                    <span className='block truncate text-sm font-medium text-headingColor'>{d.title}</span>
                    <span className='block truncate text-xs text-slate-500'>
                      {d.fileName} · {formatSize(d.bytes)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <section className='min-w-0 rounded-[28px] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.03),0_8px_24px_rgba(16,24,40,0.04)] sm:p-5'>
            <div role='radiogroup' aria-label='Viewer' className='mb-4 inline-flex rounded-xl bg-slate-100 p-1'>
              {MODES.map(({ key, label }) => (
                <button
                  key={key}
                  type='button'
                  role='radio'
                  aria-checked={mode === key}
                  onClick={() => setMode(key)}
                  className={`cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition ${mode === key ? 'bg-white text-headingColor shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {mode === 'iframe' ? (
              <PdfIframeViewer key={selected.id} url={selected.url} title={selected.title} />
            ) : (
              <ReactPdfViewer key={selected.id} url={selected.url} />
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminDocuments;
