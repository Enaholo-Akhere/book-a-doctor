import { useMemo, useState } from 'react';
import { ChevronRight, Search, ShieldAlert, Users } from 'lucide-react';
import { appointments } from '@/types/doctors.ds';
import { formatDate } from '@/utils/formatDate';
import { ageFrom } from '../shared/healthUtils';
import { Avatar, Badge, Card, EmptyState, fieldClass } from '../shared/ui';
import { patientsFrom } from './doctorUtils';

const Patients = ({ appointments: list = [], onOpenPatient }: { appointments: appointments[]; onOpenPatient: (id: string) => void }) => {
  const [query, setQuery] = useState('');
  const all = useMemo(() => patientsFrom(list), [list]);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? all.filter(({ patient: p }) => p.name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q)) : all;
  }, [all, query]);

  if (all.length === 0) {
    return (
      <Card>
        <EmptyState icon={<Users size={22} />} title='No patients yet' description='Patients who book you will be listed here with their health summary.' />
      </Card>
    );
  }

  return (
    <div className='space-y-5'>
      <div className='relative max-w-md'>
        <Search size={16} className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
        <input
          type='search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${all.length} patient${all.length === 1 ? '' : 's'}`}
          aria-label='Search patients'
          className={`${fieldClass} pl-9`}
        />
      </div>

      {visible.length === 0 ? (
        <Card>
          <EmptyState icon={<Search size={22} />} title='No matching patients' />
        </Card>
      ) : (
        <ul className='grid gap-3 md:grid-cols-2'>
          {visible.map(({ patient: p, visits, lastBooked, hasPending }) => {
            const age = ageFrom(p.dateOfBirth);
            const gender = p.gender ? p.gender[0].toUpperCase() + p.gender.slice(1) : null;
            const details = [age !== null ? `${age} yrs` : null, gender, p.bloodType].filter(Boolean).join(' · ');
            return (
              <li key={p._id}>
                <button
                  type='button'
                  onClick={() => onOpenPatient(p._id)}
                  className='flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition hover:border-primaryColor/30 hover:shadow-md'
                >
                  <Avatar src={p.photo?.imageUrl} name={p.name} size={46} />
                  <span className='min-w-0 flex-1'>
                    <span className='flex items-center gap-2'>
                      <span className='truncate font-semibold text-headingColor'>{p.name}</span>
                      {hasPending && <Badge tone='amber'>Request</Badge>}
                    </span>
                    <span className='block truncate text-xs text-slate-500'>{details || 'Health profile not completed'}</span>
                    <span className='mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400'>
                      <span>
                        {visits} booking{visits === 1 ? '' : 's'} · last {formatDate({ date: lastBooked })}
                      </span>
                      {!!p.allergies?.length && (
                        <span className='inline-flex items-center gap-1 font-medium text-red-600'>
                          <ShieldAlert size={12} /> {p.allergies.length} allerg{p.allergies.length === 1 ? 'y' : 'ies'}
                        </span>
                      )}
                    </span>
                  </span>
                  <ChevronRight size={18} className='shrink-0 text-slate-300' />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Patients;
