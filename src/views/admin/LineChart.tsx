'use client';
import { useEffect, useRef, useState } from 'react';

export type LinePoint = { label: string; current: number; previous: number };

const CURRENT = '#0c8075'; // brand teal
const PREVIOUS = '#94a3b8'; // muted slate, dashed, so it never relies on color alone

/** Smooth path through points (Catmull-Rom converted to cubic Béziers), clamped so it never dips below the baseline. */
const smoothPath = (pts: [number, number][], floorY: number) => {
  if (pts.length < 2) return pts.length ? `M${pts[0][0]},${pts[0][1]}` : '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1y = Math.min(floorY, p1[1] + (p2[1] - p0[1]) / 6);
    const c2y = Math.min(floorY, p2[1] - (p3[1] - p1[1]) / 6);
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${c1y} ${p2[0] - (p3[0] - p1[0]) / 6},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
};

/**
 * Two lines on one axis, both the same measure: this period vs the previous
 * period. Legend always shown; crosshair snaps to the nearest point and the
 * tooltip lists both values; "Show table" gives every value.
 */
const LineChart = ({
  data,
  format = (n) => n.toLocaleString(),
  height = 240,
  showTable,
}: {
  data: LinePoint[];
  format?: (n: number) => string;
  height?: number;
  showTable: boolean;
}) => {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (!box.current) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, [showTable]);

  if (showTable)
    return (
      <div className='max-h-[260px] overflow-auto rounded-2xl border border-slate-100'>
        <table className='w-full text-left text-xs'>
          <thead className='sticky top-0 bg-slate-50 text-slate-500'>
            <tr>
              <th className='px-3 py-2 font-medium'>Period</th>
              <th className='px-3 py-2 text-right font-medium'>This period</th>
              <th className='px-3 py-2 text-right font-medium'>Previous period</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100 text-headingColor'>
            {data.map((d) => (
              <tr key={d.label}>
                <td className='px-3 py-1.5'>{d.label}</td>
                <td className='px-3 py-1.5 text-right tabular-nums'>{format(d.current)}</td>
                <td className='px-3 py-1.5 text-right tabular-nums'>{format(d.previous)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

  const pad = { top: 16, right: 12, bottom: 26, left: 44 };
  const plotW = Math.max(0, width - pad.left - pad.right);
  const plotH = height - pad.top - pad.bottom;
  const max = Math.max(1, ...data.flatMap((d) => [d.current, d.previous]));
  const step = 10 ** Math.floor(Math.log10(max));
  const niceMax = [1, 2, 5, 10].map((m) => m * step).find((v) => v >= max) ?? max;
  const x = (i: number) => pad.left + (data.length > 1 ? (i / (data.length - 1)) * plotW : plotW / 2);
  const y = (v: number) => pad.top + plotH - (v / niceMax) * plotH;
  const baseY = pad.top + plotH;
  const cur = data.map((d, i) => [x(i), y(d.current)] as [number, number]);
  const prev = data.map((d, i) => [x(i), y(d.previous)] as [number, number]);
  const labelEvery = Math.max(1, Math.ceil(data.length / 6));
  const point = active !== null ? data[active] : null;

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - rect.left) / rect.width;
    setActive(Math.max(0, Math.min(data.length - 1, Math.round(rel * (data.length - 1)))));
  };

  return (
    <div ref={box} className='relative' style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} role='img' aria-label='This period compared with the previous period'>
          <defs>
            <linearGradient id='curFill' x1='0' x2='0' y1='0' y2='1'>
              <stop offset='0%' stopColor={CURRENT} stopOpacity='0.14' />
              <stop offset='100%' stopColor={CURRENT} stopOpacity='0' />
            </linearGradient>
          </defs>
          {[0, niceMax / 2, niceMax].map((t) => (
            <g key={t}>
              <line x1={pad.left} x2={width - pad.right} y1={y(t)} y2={y(t)} stroke='#ebe9e4' strokeWidth={1} />
              <text x={pad.left - 8} y={y(t)} dy='0.32em' textAnchor='end' fontSize={11} fill='#94a3b8'>
                {format(t)}
              </text>
            </g>
          ))}
          {data.map((d, i) =>
            i % labelEvery === 0 ? (
              <text key={d.label} x={x(i)} y={height - 6} textAnchor='middle' fontSize={11} fill='#94a3b8'>
                {d.label.split(' – ')[0]}
              </text>
            ) : null,
          )}
          {/* Soft area under the current line, as in the design */}
          <path d={`${smoothPath(cur, baseY)} L${x(data.length - 1)},${baseY} L${x(0)},${baseY} Z`} fill='url(#curFill)' />
          <path d={smoothPath(prev, baseY)} fill='none' stroke={PREVIOUS} strokeWidth={2} strokeDasharray='5 5' strokeLinecap='round' />
          <path d={smoothPath(cur, baseY)} fill='none' stroke={CURRENT} strokeWidth={2.5} strokeLinecap='round' />
          {active !== null && (
            <g>
              <line x1={x(active)} x2={x(active)} y1={pad.top} y2={baseY} stroke='#cbd5e1' strokeWidth={1} />
              <circle cx={x(active)} cy={y(data[active].previous)} r={4.5} fill='#fff' stroke={PREVIOUS} strokeWidth={2} />
              <circle cx={x(active)} cy={y(data[active].current)} r={5} fill='#fff' stroke={CURRENT} strokeWidth={2.5} />
            </g>
          )}
          <rect
            x={pad.left}
            y={pad.top}
            width={plotW}
            height={plotH}
            fill='transparent'
            tabIndex={0}
            aria-label='Chart: use the arrow keys to read values'
            onPointerMove={onMove}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive((a) => a ?? data.length - 1)}
            onBlur={() => setActive(null)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') setActive((a) => Math.max(0, (a ?? 0) - 1));
              if (e.key === 'ArrowRight') setActive((a) => Math.min(data.length - 1, (a ?? -1) + 1));
            }}
            style={{ outline: 'none' }}
          />
        </svg>
      )}
      {point && active !== null && (
        <div
          role='status'
          className='pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg'
          style={{ left: Math.min(Math.max(x(active), 80), width - 80), top: 0 }}
        >
          <p className='mb-1 text-slate-500'>{point.label}</p>
          <p className='flex items-center gap-2'>
            <span className='h-0.5 w-3 rounded bg-[#0c8075]' aria-hidden />
            <span className='font-semibold tabular-nums text-headingColor'>{format(point.current)}</span>
            <span className='text-slate-500'>this period</span>
          </p>
          <p className='mt-0.5 flex items-center gap-2'>
            <span className='w-3 border-t-2 border-dashed border-[#94a3b8]' aria-hidden />
            <span className='font-semibold tabular-nums text-headingColor'>{format(point.previous)}</span>
            <span className='text-slate-500'>previous</span>
          </p>
        </div>
      )}
    </div>
  );
};

/** Legend for LineChart: always shown, line style matches the chart. */
export const LineLegend = ({ previousLabel }: { previousLabel: string }) => (
  <div className='flex flex-wrap items-center gap-4 text-xs text-slate-600'>
    <span className='flex items-center gap-2'>
      <span className='h-[3px] w-5 rounded bg-[#0c8075]' aria-hidden /> This period
    </span>
    <span className='flex items-center gap-2'>
      <span className='w-5 border-t-2 border-dashed border-[#94a3b8]' aria-hidden /> {previousLabel}
    </span>
  </div>
);

export default LineChart;
