import { useMemo, useState } from 'react';
import { CalendarX2, ChevronRight, Search, SearchX } from 'lucide-react';
import { appointments } from '@/types/doctors.ds';
import { formatDate } from '@/utils/formatDate';
import { appointmentStats, newestFirst } from '../shared/healthUtils';
import { Avatar, Badge, Card, EmptyState, fieldClass } from '../shared/ui';
import { STATUS_TONE, statusLabel } from '../shared/status';
import StatusActions from './StatusActions';
import { formatUsd } from './doctorUtils';

type Filter = 'pending' | 'approved' | 'cancelled' | 'all';

const AppointmentsPanel = ({
  appointments: list = [],
  onOpenPatient,
}: {
  appointments: appointments[];
  onOpenPatient: (patientId: string) => void;
}) => {
  const stats = appointmentStats(list);
  // Start on the action queue when there is one.
  const [filter, setFilter] = useState<Filter>(stats.pending ? 'pending' : 'all');
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list
      .filter((a) => (filter === 'all' || a.status === filter) && (!q || a.user?.name?.toLowerCase().includes(q) || a.user?.email?.toLowerCase().includes(q)))
      .sort(newestFirst);
  }, [list, filter, query]);

  if (list.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<CalendarX2 size={22} />}
          title='No appointments yet'
          description='Once patients book you, their requests appear here for you to confirm.'
        />
      </Card>
    );
  }

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'pending', label: 'Requests', count: stats.pending },
    { key: 'approved', label: 'Confirmed', count: stats.approved },
    { key: 'cancelled', label: 'Declined', count: stats.cancelled },
    { key: 'all', label: 'All', count: stats.total },
  ];

  const open = (a: appointments) => a.user?._id && onOpenPatient(a.user._id);

  return (
    <div className='space-y-5'>
      <Card className='p-3 sm:p-4'>
        <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
          <div role='tablist' aria-label='Filter appointments' className='grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap'>
            {filters.map((f) => (
              <button
                key={f.key}
                type='button'
                role='tab'
                aria-selected={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  filter === f.key ? 'bg-primaryColor text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f.label}
                <span className={`rounded-full px-1.5 text-xs tabular-nums ${filter === f.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{f.count}</span>
              </button>
            ))}
          </div>
          <div className='relative min-w-0 lg:w-72'>
            <Search size={16} className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
            <input
              type='search'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search patient name or email'
              aria-label='Search appointments'
              className={`${fieldClass} py-2 pl-9`}
            />
          </div>
        </div>
      </Card>

      {visible.length === 0 ? (
        <Card>
          <EmptyState
            icon={<SearchX size={22} />}
            title={filter === 'pending' && !query ? 'No pending requests' : 'No matching appointments'}
            description={filter === 'pending' && !query ? "You're all caught up." : 'Try a different filter or search term.'}
          />
        </Card>
      ) : (
        <Card className='overflow-hidden'>
          {/* Desktop table */}
          <table className='hidden w-full text-sm md:table'>
            <thead className='bg-slate-50/80 text-left text-xs font-medium uppercase tracking-wide text-slate-500'>
              <tr>
                <th className='px-5 py-3'>Patient</th>
                <th className='px-3 py-3'>Requested</th>
                <th className='px-3 py-3'>Fee</th>
                <th className='px-3 py-3'>Status</th>
                <th className='px-5 py-3 text-right'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {visible.map((a) => (
                <tr key={a._id} onClick={() => open(a)} className='cursor-pointer transition hover:bg-slate-50/70'>
                  <td className='px-5 py-3.5'>
                    <div className='flex items-center gap-3'>
                      <Avatar src={a.user?.photo?.imageUrl} name={a.user?.name ?? 'Patient'} size={36} />
                      <div className='min-w-0'>
                        <p className='truncate font-medium text-headingColor'>{a.user?.name}</p>
                        <p className='truncate text-xs text-slate-500'>{a.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className='px-3 py-3.5 text-slate-600'>{formatDate({ date: a.createdAt })}</td>
                  <td className='px-3 py-3.5'>
                    <span className='font-medium tabular-nums text-headingColor'>{formatUsd(Number(a.ticketPrice) || 0)}</span>
                    <span className={`ml-2 text-xs ${a.isPaid ? 'text-emerald-700' : 'text-slate-400'}`}>{a.isPaid ? 'Paid' : 'Unpaid'}</span>
                  </td>
                  <td className='px-3 py-3.5'>
                    <Badge tone={STATUS_TONE[a.status]}>{statusLabel(a.status)}</Badge>
                  </td>
                  <td className='px-5 py-3.5'>
                    <div className='flex justify-end'>
                      {a.status === 'pending' ? <StatusActions appointment={a} compact /> : <ChevronRight size={16} className='text-slate-300' />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile list */}
          <ul className='divide-y divide-slate-100 md:hidden'>
            {visible.map((a) => (
              <li key={a._id} className='p-4'>
                <button type='button' onClick={() => open(a)} className='flex w-full cursor-pointer items-center gap-3 text-left'>
                  <Avatar src={a.user?.photo?.imageUrl} name={a.user?.name ?? 'Patient'} size={40} />
                  <span className='min-w-0 flex-1'>
                    <span className='block truncate text-sm font-semibold text-headingColor'>{a.user?.name}</span>
                    <span className='block truncate text-xs text-slate-500'>
                      {formatDate({ date: a.createdAt })} · {formatUsd(Number(a.ticketPrice) || 0)} · {a.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </span>
                  <Badge tone={STATUS_TONE[a.status]}>{statusLabel(a.status)}</Badge>
                </button>
                {a.status === 'pending' && (
                  <div className='mt-3 pl-[52px]'>
                    <StatusActions appointment={a} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default AppointmentsPanel;
