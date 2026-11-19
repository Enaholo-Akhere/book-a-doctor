import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus, Search, SearchX } from 'lucide-react';
import { user } from '@/types/users';
import { appointments } from '@/types/doctors.ds';
import BookingCard from './BookingCard';
import BookingDetails from '../BookingDetails';
import { appointmentStats, newestFirst } from '../shared/healthUtils';
import { Card, EmptyState, fieldClass, primaryBtn } from '../shared/ui';

type Filter = 'all' | appointments['status'];

interface MyBookingsProps {
  user: user;
  selected: appointments | null;
  onSelect: (appointment: appointments | null) => void;
}

const MyBookings = ({ user, selected, onSelect }: MyBookingsProps) => {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

  const list = useMemo(() => user?.appointments ?? [], [user]);
  const stats = appointmentStats(list);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = list.filter(
      (a) =>
        (filter === 'all' || a.status === filter) &&
        (!q || a.doctor?.name?.toLowerCase().includes(q) || a.doctor?.specialization?.toLowerCase().includes(q))
    );
    const sorted = [...filtered].sort(newestFirst);
    return sort === 'newest' ? sorted : sorted.reverse();
  }, [list, filter, query, sort]);

  if (selected) {
    return (
      <div className='-mx-5 sm:mx-0'>
        <BookingDetails appointment={selected} onBack={() => onSelect(null)} tabState='appointments' />
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<CalendarPlus size={22} />}
          title='You have no appointments yet'
          description='Browse our verified specialists and book a consultation. Your bookings and receipts will appear here.'
          action={
            <Link to='/doctors' className={primaryBtn}>
              Find a doctor
            </Link>
          }
        />
      </Card>
    );
  }

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: stats.total },
    { key: 'approved', label: 'Confirmed', count: stats.approved },
    { key: 'pending', label: 'Pending', count: stats.pending },
    { key: 'cancelled', label: 'Cancelled', count: stats.cancelled },
  ];

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
                  filter === f.key ? 'bg-primaryColor text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {f.label}
                <span
                  className={`rounded-full px-1.5 text-xs tabular-nums ${
                    filter === f.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {f.count}
                </span>
              </button>
            ))}
          </div>
          <div className='flex gap-2'>
            <div className='relative min-w-0 flex-1 lg:w-72 lg:flex-none'>
              <Search size={16} className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
              <input
                type='search'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search doctor or specialty'
                aria-label='Search appointments'
                className={`${fieldClass} pl-9 py-2`}
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
              aria-label='Sort appointments'
              className={`${fieldClass} !w-auto shrink-0 py-2 pr-8`}
            >
              <option value='newest'>Newest</option>
              <option value='oldest'>Oldest</option>
            </select>
          </div>
        </div>
      </Card>

      {visible.length === 0 ? (
        <Card>
          <EmptyState
            icon={<SearchX size={22} />}
            title='No matching appointments'
            description='Try a different filter or search term.'
          />
        </Card>
      ) : (
        <div className='grid gap-4 md:grid-cols-2'>
          {visible.map((appointment) => (
            <BookingCard
              key={appointment._id}
              appointment={appointment}
              onViewDetails={() => undefined}
              setBookingDetails={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
