import { FormEvent, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { AlertTriangle, BadgeCheck, CheckCircle2, Circle, Clock3, FileText, ShieldCheck, Trash2, Upload, XCircle } from 'lucide-react';
import Loading from '@/components/Loader';
import Error from '@/components/Error';
import { handleAxiosError } from '@/utils/axiosError';
import { useDeleteVerificationDocument, useMyVerification, useUploadVerificationDocument } from '@/Hook/useVerification';
import type { DocumentStatus, MyVerification } from '@/types/verification';
import { Badge, Card, CardHeader, EmptyState, Field, fieldClass, primaryBtn, Tone } from '../shared/ui';

const ACCEPT = 'application/pdf,image/jpeg,image/png,image/webp';
const MAX_BYTES = 5 * 1024 * 1024;

const DOC_STATUS: Record<DocumentStatus, { label: string; tone: Tone }> = {
  pending: { label: 'In review', tone: 'amber' },
  accepted: { label: 'Accepted', tone: 'emerald' },
  rejected: { label: 'Rejected', tone: 'red' },
};

const formatDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '';

const formatSize = (bytes?: number) => (bytes ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : '');

/** Today as YYYY-MM-DD, the earliest expiry date we accept. */
const today = () => new Date().toISOString().slice(0, 10);

const StatusBanner = ({ v }: { v: MyVerification }) => {
  if (v.licenceExpired)
    return (
      <Banner tone='red' icon={<AlertTriangle size={20} />} title='Your practising licence has expired'>
        Patients can’t book you until you upload your renewed licence and it’s reviewed.
      </Banner>
    );
  if (v.status === 'approved')
    return (
      <Banner tone='emerald' icon={<BadgeCheck size={20} />} title='You’re verified'>
        Your profile is listed and patients can book you.
        {v.licenceExpiresAt && ` Your practising licence expires on ${formatDate(v.licenceExpiresAt)}; we’ll remind you 30 days before.`}
      </Banner>
    );
  if (v.status === 'cancelled')
    return (
      <Banner tone='red' icon={<XCircle size={20} />} title='We couldn’t verify your profile yet'>
        {v.review?.note || 'Please check your documents below.'} Fix the issue and upload new documents to be reviewed again.
      </Banner>
    );
  if (v.readyForReview)
    return (
      <Banner tone='amber' icon={<Clock3 size={20} />} title='Your documents are being reviewed'>
        {v.review?.note ? `${v.review.note} ` : ''}We’ll email you once a decision is made. Until then, your profile isn’t visible to patients.
      </Banner>
    );
  return (
    <Banner tone='amber' icon={<ShieldCheck size={20} />} title='Verify your profile to start seeing patients'>
      {v.review?.note ? `${v.review.note} ` : ''}Upload the required documents below: {v.missingLabels.join(', ')}. Patients can’t find or book you until you’re verified.
    </Banner>
  );
};

const BANNER_TONES = {
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  amber: 'border-amber-200 bg-amber-50 text-amber-900',
  red: 'border-red-200 bg-red-50 text-red-900',
};

const Banner = ({ tone, icon, title, children }: { tone: keyof typeof BANNER_TONES; icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className={`flex gap-3 rounded-2xl border px-4 py-4 sm:px-5 ${BANNER_TONES[tone]}`} role='status'>
    <span className='mt-0.5 shrink-0'>{icon}</span>
    <div>
      <p className='font-semibold'>{title}</p>
      <p className='mt-1 text-sm opacity-90'>{children}</p>
    </div>
  </div>
);

const UploadForm = ({ v }: { v: MyVerification }) => {
  const firstMissing = v.missing[0] ?? v.kinds[0].kind;
  const [kind, setKind] = useState<string>(firstMissing);
  const [expiresAt, setExpiresAt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useUploadVerificationDocument();
  const selected = v.kinds.find((k) => k.kind === kind);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error('Choose a file to upload');
    if (file.size > MAX_BYTES) return toast.error('File is larger than 5 MB');
    if (selected?.needsExpiry && !expiresAt) return toast.error('Add the expiry date');
    mutate(
      { file, kind, expiresAt: expiresAt || undefined },
      {
        onSuccess: (next) => {
          toast.success('Document uploaded');
          setFile(null);
          setExpiresAt('');
          if (fileInput.current) fileInput.current.value = '';
          setKind(next.missing[0] ?? kind);
        },
        onError: (err) => toast.error(handleAxiosError(err)),
      },
    );
  };

  return (
    <Card>
      <CardHeader title='Upload a document' description='PDF or a clear photo or scan (JPG, PNG, WEBP), up to 5 MB. Only CareConnect’s verification team can see these.' icon={<Upload size={18} />} />
      <form onSubmit={submit} className='grid gap-4 px-5 pb-5 sm:grid-cols-2 sm:px-6'>
        <Field label='Document type' htmlFor='doc-kind'>
          <select id='doc-kind' value={kind} onChange={(e) => setKind(e.target.value)} className={fieldClass}>
            {v.kinds.map((k) => (
              <option key={k.kind} value={k.kind}>
                {k.label}
                {k.required ? ' (required)' : ''}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label={selected?.needsExpiry ? 'Expiry date' : 'Expiry date (if any)'}
          htmlFor='doc-expiry'
          hint={selected?.kind === 'practising_licence' ? 'Your annual practising licence’s expiry date' : undefined}
        >
          <input id='doc-expiry' type='date' min={today()} value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} required={selected?.needsExpiry} className={fieldClass} />
        </Field>
        <Field label='File' htmlFor='doc-file' className='sm:col-span-2'>
          <input
            id='doc-file'
            ref={fileInput}
            type='file'
            accept={ACCEPT}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className={`${fieldClass} file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primaryColor/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primaryColor`}
          />
        </Field>
        <div className='sm:col-span-2'>
          <button type='submit' disabled={isPending || !file} className={primaryBtn}>
            <Upload size={16} /> {isPending ? 'Uploading…' : 'Upload document'}
          </button>
        </div>
      </form>
    </Card>
  );
};

const Checklist = ({ v }: { v: MyVerification }) => (
  <Card>
    <CardHeader title='What we need' description='The first three are required. The rest help patients trust your profile.' icon={<ShieldCheck size={18} />} />
    <ul className='divide-y divide-slate-100 px-5 pb-3 sm:px-6'>
      {v.kinds.map((k) => {
        const docs = v.documents.filter((d) => d.kind === k.kind);
        const best = docs.find((d) => d.status === 'accepted') ?? docs.find((d) => d.status === 'pending') ?? docs[0];
        return (
          <li key={k.kind} className='flex items-center gap-3 py-3 text-sm'>
            {best && best.status !== 'rejected' ? (
              <CheckCircle2 size={18} className={best.status === 'accepted' ? 'text-emerald-600' : 'text-amber-500'} />
            ) : (
              <Circle size={18} className='text-slate-300' />
            )}
            <span className='flex-1 text-headingColor'>{k.label}</span>
            {best ? <Badge tone={DOC_STATUS[best.status].tone}>{DOC_STATUS[best.status].label}</Badge> : k.required ? <Badge tone='orange'>Required</Badge> : <Badge>Optional</Badge>}
          </li>
        );
      })}
    </ul>
  </Card>
);

const DocumentList = ({ v }: { v: MyVerification }) => {
  const { mutate: remove, isPending, variables } = useDeleteVerificationDocument();
  const docs = [...v.documents].sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));

  return (
    <Card>
      <CardHeader title='Your documents' icon={<FileText size={18} />} />
      {docs.length === 0 ? (
        <EmptyState icon={<FileText size={22} />} title='No documents yet' description='Upload your ID, practising licence and medical degree to get verified.' />
      ) : (
        <ul className='divide-y divide-slate-100 px-5 pb-3 sm:px-6'>
          {docs.map((d) => (
            <li key={d._id} className='flex items-start gap-3 py-3'>
              <FileText size={18} className='mt-0.5 shrink-0 text-slate-400' />
              <div className='min-w-0 flex-1'>
                <div className='flex flex-wrap items-center gap-2'>
                  <p className='text-sm font-medium text-headingColor'>{d.label}</p>
                  <Badge tone={DOC_STATUS[d.status].tone}>{DOC_STATUS[d.status].label}</Badge>
                </div>
                <p className='mt-0.5 truncate text-xs text-slate-500'>
                  {[d.originalName, formatSize(d.size), `uploaded ${formatDate(d.uploadedAt)}`, d.expiresAt && `expires ${formatDate(d.expiresAt)}`].filter(Boolean).join(' · ')}
                </p>
                {d.status === 'rejected' && d.reviewNote && <p className='mt-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs text-red-700'>{d.reviewNote}</p>}
              </div>
              {d.status !== 'accepted' && (
                <button
                  type='button'
                  onClick={() => remove(d._id, { onError: (err) => toast.error(handleAxiosError(err)) })}
                  disabled={isPending && variables === d._id}
                  className='shrink-0 cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50'
                  aria-label={`Remove ${d.label}`}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

const Verification = () => {
  const { data: v, isLoading, isError, error } = useMyVerification();
  if (isLoading) return <Loading />;
  if (isError || !v) return <Error errorMessage={handleAxiosError(error)} />;

  return (
    <div className='space-y-6'>
      <StatusBanner v={v} />
      <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]'>
        <div className='space-y-6'>
          <UploadForm v={v} />
          <DocumentList v={v} />
        </div>
        <Checklist v={v} />
      </div>
    </div>
  );
};

export default Verification;
