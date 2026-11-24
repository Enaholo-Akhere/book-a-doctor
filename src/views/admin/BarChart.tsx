'use client';
import { useEffect, useRef, useState } from 'react';

export type BarPoint = { label: string; value: number };

/**
 * Single-series bar chart: one brand color, so the chart title names the
 * series and no legend is needed. Thin bars with rounded data-ends and a 2px
 * gap, a recessive grid, and a tooltip per bar on hover and keyboard focus.
 * "Show table" gives every value without hovering.
 */
const BarChart = ({
  title,
  data,
  format = (n) => n.toLocaleString(),
  height = 180,
}: {
  title: string;
  data: BarPoint[];
  format?: (n: number) => string;
  height?: number;
}) => {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    if (!box.current) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  const pad = { top: 8, right: 4, bottom: 22, left: 36 };
  const plotW = Math.max(0, width - pad.left - pad.right);
  const plotH = height - pad.top - pad.bottom;
  const max = Math.max(1, ...data.map((d) => d.value));
  // A "nice" top for the axis: 1, 2 or 5 × 10^n.
  const step = 10 ** Math.floor(Math.log10(max));
  const niceMax = [1, 2, 5, 10].map((m) => m * step).find((v) => v >= max) ?? max;
  const ticks = [0, niceMax / 2, niceMax];
  const slot = data.length ? plotW / data.length : 0;
  const gap = 2;
  const barW = Math.max(1, slot - gap);
  const y = (v: number) => pad.top + plotH - (v / niceMax) * plotH;
  // Label roughly 6 positions on the x-axis, not every bar.
  const labelEvery = Math.max(1, Math.ceil(data.length / 6));
  const total = data.reduce((s, d) => s + d.value, 0);
  const point = active !== null ? data[active] : null;

  return (
    <figure className='min-w-0'>
      <div className='mb-2 flex items-baseline justify-between gap-2'>
        <figcaption className='text-[13px] font-medium text-slate-500'>{title}</figcaption>
        <button type='button' onClick={() => setShowTable((s) => !s)} className='cursor-pointer text-xs font-medium text-primaryColor hover:underline'>
          {showTable ? 'Show chart' : 'Show table'}
        </button>
      </div>

      {showTable ? (
        <div className='max-h-[200px] overflow-auto rounded-lg border border-slate-100'>
          <table className='w-full text-left text-xs'>
            <thead className='sticky top-0 bg-slate-50 text-slate-500'>
              <tr><th className='px-3 py-1.5 font-medium'>Period</th><th className='px-3 py-1.5 text-right font-medium'>{title}</th></tr>
            </thead>
            <tbody className='divide-y divide-slate-100 text-headingColor'>
              {data.map((d) => (
                <tr key={d.label}><td className='px-3 py-1.5'>{d.label}</td><td className='px-3 py-1.5 text-right tabular-nums'>{format(d.value)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div ref={box} className='relative' style={{ height }} onPointerLeave={() => setActive(null)}>
          {width > 0 && (
            <svg width={width} height={height} role='img' aria-label={`${title}: ${format(total)} in total`}>
              {ticks.map((t) => (
                <g key={t}>
                  <line x1={pad.left} x2={width - pad.right} y1={y(t)} y2={y(t)} stroke='#eef0f2' strokeWidth={1} />
                  <text x={pad.left - 6} y={y(t)} dy='0.32em' textAnchor='end' fontSize={10} fill='#94a3b8'>
                    {format(t)}
                  </text>
                </g>
              ))}
              {data.map((d, i) => {
                const x = pad.left + i * slot + gap / 2;
                const h = Math.max(0, pad.top + plotH - y(d.value));
                const r = Math.min(4, barW / 2, h);
                return (
                  <g key={d.label}>
                    {h > 0 && (
                      <path
                        d={`M${x},${pad.top + plotH} v${-(h - r)} q0,${-r} ${r},${-r} h${barW - 2 * r} q${r},0 ${r},${r} v${h - r} z`}
                        fill='#0c8075'
                        opacity={active === null || active === i ? 1 : 0.45}
                      />
                    )}
                    {/* Hit target: the whole column, bigger than the bar. */}
                    <rect
                      x={pad.left + i * slot}
                      y={pad.top}
                      width={slot}
                      height={plotH}
                      fill='transparent'
                      tabIndex={0}
                      aria-label={`${d.label}: ${format(d.value)}`}
                      onPointerEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onBlur={() => setActive(null)}
                      style={{ outline: 'none' }}
                    />
                    {i % labelEvery === 0 && (
                      <text x={x + barW / 2} y={height - 6} textAnchor='middle' fontSize={10} fill='#94a3b8'>
                        {d.label.split(' – ')[0]}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          )}
          {point && active !== null && (
            <div
              className='pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-md'
              style={{ left: Math.min(Math.max(pad.left + active * slot + slot / 2, 60), width - 60), top: 0 }}
              role='status'
            >
              <p className='font-semibold tabular-nums text-headingColor'>{format(point.value)}</p>
              <p className='text-slate-500'>{point.label}</p>
            </div>
          )}
        </div>
      )}
    </figure>
  );
};

export default BarChart;
