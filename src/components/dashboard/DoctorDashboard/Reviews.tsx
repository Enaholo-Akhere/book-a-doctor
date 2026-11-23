import { Star } from 'lucide-react';
import { doctorsInterface } from '@/types/doctors.ds';
import { formatDate } from '@/utils/formatDate';
import { Avatar, Card, CardHeader, EmptyState } from '../shared/ui';
import { ratingBreakdown } from './doctorUtils';

const Stars = ({ value, size = 14 }: { value: number; size?: number }) => (
  <span className='inline-flex gap-0.5' aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} size={size} className={i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'} />
    ))}
  </span>
);

const Reviews = ({ doctor }: { doctor: doctorsInterface }) => {
  const reviews = doctor.reviews ?? [];
  const breakdown = ratingBreakdown(reviews);
  const total = reviews.length;

  if (total === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Star size={22} />}
          title='No reviews yet'
          description='After a consultation, patients can rate you from your public profile. Their feedback will appear here.'
        />
      </Card>
    );
  }

  return (
    <div className='grid gap-6 lg:grid-cols-3'>
      <Card className='h-fit p-6 lg:sticky lg:top-24'>
        <p className='text-sm text-slate-500'>Average rating</p>
        <p className='mt-1 text-4xl font-semibold tabular-nums text-headingColor'>{(doctor.averageRating ?? 0).toFixed(1)}</p>
        <div className='mt-2'>
          <Stars value={doctor.averageRating ?? 0} size={18} />
        </div>
        <p className='mt-1 text-sm text-slate-500'>
          from {total} review{total === 1 ? '' : 's'}
        </p>
        <ul className='mt-5 space-y-2'>
          {breakdown.map(({ stars, count }) => (
            <li key={stars} className='flex items-center gap-3 text-sm'>
              <span className='w-8 tabular-nums text-slate-600'>{stars}★</span>
              <span className='h-2 flex-1 overflow-hidden rounded-full bg-slate-100'>
                <span className='block h-full rounded-full bg-amber-400' style={{ width: `${(count / total) * 100}%` }} />
              </span>
              <span className='w-6 text-right tabular-nums text-slate-500'>{count}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className='lg:col-span-2'>
        <CardHeader title='What patients say' description='Most recent first' />
        <ul className='divide-y divide-slate-100 border-t border-slate-100'>
          {reviews.map((r) => (
            <li key={r._id} className='flex gap-3 px-5 py-4 sm:px-6'>
              <Avatar src={r.user?.photo?.imageUrl} name={r.user?.name ?? 'Patient'} size={40} />
              <div className='min-w-0 flex-1'>
                <div className='flex flex-wrap items-center justify-between gap-x-3 gap-y-1'>
                  <p className='font-medium text-headingColor'>{r.user?.name ?? 'Patient'}</p>
                  {r.createdAt && <span className='text-xs text-slate-400'>{formatDate({ date: r.createdAt })}</span>}
                </div>
                <Stars value={r.rating} />
                <p className='mt-1.5 whitespace-pre-line break-words text-sm leading-6 text-slate-600'>{r.reviewText}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Reviews;
