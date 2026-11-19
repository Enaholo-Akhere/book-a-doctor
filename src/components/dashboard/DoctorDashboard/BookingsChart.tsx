import { useState } from 'react';
import { WeekBucket } from './doctorUtils';

const H = 160; // plot height
const BAR_MAX = 24;

/** Single-series column chart: bookings received per week. */
const BookingsChart = ({ data }: { data: WeekBucket[] }) => {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(4, ...data.map((d) => d.count));
  const niceMax = Math.ceil(max / 4) * 4;
  const ticks = [0, niceMax / 2, niceMax];
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div>
      <div className='relative' onMouseLeave={() => setActive(null)}>
        {/* Gridlines + y labels */}
        <div className='absolute inset-x-0 top-0' style={{ height: H }} aria-hidden>
          {ticks.map((t) => (
            <div
              key={t}
              className='absolute inset-x-0 flex items-center gap-2'
              style={{ bottom: `${(t / niceMax) * 100}%`, transform: 'translateY(50%)' }}
            >
              <span className='w-6 text-right text-[11px] tabular-nums text-gray-400'>{t}</span>
              <span className={`h-px flex-1 ${t === 0 ? 'bg-gray-300' : 'bg-gray-100'}`} />
            </div>
          ))}
        </div>

        {/* Columns */}
        <div className='relative ml-8 flex items-end' style={{ height: H }} role='img' aria-label={`${total} bookings over the last ${data.length} weeks`}>
          {data.map((d, i) => {
            const h = d.count === 0 ? 0 : Math.max(4, (d.count / niceMax) * H);
            return (
              <div
                key={d.label}
                className='relative flex h-full flex-1 cursor-default items-end justify-center'
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                tabIndex={0}
                aria-label={`Week of ${d.label}: ${d.count} booking${d.count === 1 ? '' : 's'}`}
              >
                <div
                  className={`w-full rounded-t-[4px] transition-colors ${active === i ? 'bg-primaryColor2' : 'bg-primaryColor'}`}
                  style={{ height: h, maxWidth: BAR_MAX, opacity: active === null || active === i ? 1 : 0.55 }}
                />
                {active === i && (
                  <div className='pointer-events-none absolute z-10 whitespace-nowrap rounded-lg bg-headingColor px-2.5 py-1.5 text-xs text-white shadow-lg' style={{ bottom: h + 6 }}>
                    <span className='text-white/70'>Week of {d.label}</span>
                    <span className='ml-2 font-semibold tabular-nums'>{d.count}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* X labels: first, middle, last to avoid collisions on small screens */}
        <div className='ml-8 mt-2 flex' aria-hidden>
          {data.map((d, i) => (
            <span key={d.label} className='flex-1 text-center text-[11px] text-gray-400'>
              {i === 0 || i === data.length - 1 || i === Math.floor(data.length / 2) ? d.label : ''}
            </span>
          ))}
        </div>
      </div>

      {/* Table view for assistive tech */}
      <table className='sr-only'>
        <caption>Bookings per week</caption>
        <thead>
          <tr>
            <th>Week of</th>
            <th>Bookings</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <td>{d.label}</td>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsChart;
