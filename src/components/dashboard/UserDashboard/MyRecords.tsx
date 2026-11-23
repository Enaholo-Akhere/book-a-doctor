import { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft, FileText, Loader2, ShieldCheck, Trash2 } from 'lucide-react';
import { useConsultation, useConsultations, useDeleteConsultation } from '@/Hook/useConsultations';
import { handleAxiosError } from '@/utils/axiosError';
import { Avatar, Card, CardHeader, EmptyState, secondaryBtn } from '../shared/ui';
import { formatMinutes, formatRecordDate, SummaryView, TranscriptView } from '../shared/records';

const RecordDetail = ({ id, onBack }: { id: string; onBack: () => void }) => {
  const { data: record, isLoading, isError, error } = useConsultation(id);
  const remove = useDeleteConsultation();

  if (isLoading) {
    return (
      <div className='flex justify-center py-16'>
        <Loader2 className='animate-spin text-primaryColor' />
      </div>
    );
  }
  if (isError || !record) return <p className='px-6 py-10 text-sm text-red-600'>{handleAxiosError(error)}</p>;

  const doDelete = async () => {
    const ok = window.confirm(
      'Delete this consultation record? The transcript and summary will be permanently removed from your health history and from your doctor’s records.'
    );
    if (!ok) return;
    try {
      await remove.mutateAsync(record._id);
      toast.success('Record deleted');
      onBack();
    } catch (err) {
      toast.error(handleAxiosError(err));
    }
  };

  return (
    <div className='space-y-5 px-5 pb-6 sm:px-6'>
      <div className='flex items-center gap-3'>
        <Avatar src={record.doctor?.photo?.imageUrl} name={record.doctor?.name ?? 'Doctor'} size={44} />
        <div className='min-w-0'>
          <p className='truncate font-semibold text-headingColor'>{record.doctor?.name ?? 'Former CareConnect doctor'}</p>
          <p className='text-sm text-slate-500'>
            {formatRecordDate(record.recordingStartedAt)}
            {record.durationSec ? ` · ${formatMinutes(record.durationSec)}` : ''}
            {record.doctor?.specialization ? ` · ${record.doctor.specialization}` : ''}
          </p>
        </div>
      </div>

      <SummaryView summary={record.summary} />
      {record.amendedAt && <p className='text-xs text-slate-500'>Updated by your doctor {formatRecordDate(record.amendedAt)}.</p>}
      <TranscriptView segments={record.transcript} />

      <button type='button' onClick={doDelete} disabled={remove.isPending} className={`${secondaryBtn} text-red-600`}>
        <Trash2 size={16} /> Delete this record
      </button>
    </div>
  );
};

/** Patient's consultation history: summaries their doctors approved from recorded calls. */
const MyRecords = () => {
  const { data: records = [], isLoading } = useConsultations();
  const [selected, setSelected] = useState<string | null>(null);

  if (selected) {
    return (
      <Card>
        <div className='px-5 pt-5 sm:px-6'>
          <button
            type='button'
            onClick={() => setSelected(null)}
            className='inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-headingColor'
          >
            <ArrowLeft size={16} /> All records
          </button>
        </div>
        <div className='pt-4'>
          <RecordDetail id={selected} onBack={() => setSelected(null)} />
        </div>
      </Card>
    );
  }

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader
          icon={<FileText size={18} />}
          title='Consultation records'
          description='Summaries of your recorded consultations, reviewed and approved by your doctor.'
        />
        {isLoading ? (
          <div className='flex justify-center py-12'>
            <Loader2 className='animate-spin text-primaryColor' />
          </div>
        ) : records.length === 0 ? (
          <EmptyState
            icon={<FileText size={20} />}
            title='No consultation records yet'
            description='If you allow your doctor to record a call, its summary appears here once your doctor has reviewed it.'
          />
        ) : (
          <ul className='divide-y divide-slate-100 border-t border-slate-100'>
            {records.map((r) => (
              <li key={r._id}>
                <button
                  type='button'
                  onClick={() => setSelected(r._id)}
                  className='flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-left transition hover:bg-slate-50 sm:px-6'
                >
                  <Avatar src={r.doctor?.photo?.imageUrl} name={r.doctor?.name ?? 'Doctor'} size={40} />
                  <div className='min-w-0 flex-1'>
                    <p className='truncate font-medium text-headingColor'>{r.summary?.chiefComplaint || 'Consultation'}</p>
                    <p className='truncate text-sm text-slate-500'>
                      {r.doctor?.name ?? 'Former CareConnect doctor'} · {new Date(r.recordingStartedAt).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <p className='flex items-start gap-2 px-1 text-xs leading-5 text-slate-500'>
        <ShieldCheck size={14} className='mt-0.5 shrink-0' />
        Calls are only recorded when you allow it. The audio is deleted once transcribed. Only you and the doctor who
        recorded the call can see a record, and you can delete it at any time.
      </p>
    </div>
  );
};

export default MyRecords;
