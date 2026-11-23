'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CalendarCheck, Hospital, Search, Siren, Video } from 'lucide-react';
import { usePageTitle } from '@/Hook/useTitle';
import { IN_PERSON_ONLY, SERVICE_CATEGORIES, ServiceCategory, services } from '@/assets/data/services';
import ServiceList from '@/components/Services/ServiceList';
import ServicesShowcase from '@/components/Services/ServicesShowcase';

const STEPS = [
  { icon: Search, title: 'Choose a service', text: 'Pick what you need help with, or ask the AI assistant which doctor fits.', color: '#9771FF' },
  { icon: CalendarCheck, title: 'Book a doctor', text: 'Choose a verified doctor and a time that suits you, then pay securely.', color: '#01B5C5' },
  { icon: Video, title: 'Consult online', text: 'Meet by video, voice or chat, and keep messaging your doctor afterwards.', color: '#FEB60D' },
];

const Services = () => {
  usePageTitle('Services - CareConnect');
  const [category, setCategory] = useState<ServiceCategory | 'all'>('all');

  const visible = useMemo(() => (category === 'all' ? services : services.filter((s) => s.category === category)), [category]);

  return (
    <div className='bg-[#f3f4f4]'>
      <div className='container py-12 lg:py-16'>
        {/* Intro */}
        <header className='max-w-[760px]'>
          <p className='text-sm font-semibold uppercase tracking-wider text-primaryColor'>Online care</p>
          <h1 className='mt-3 text-[2.6rem] font-medium leading-[1.05] tracking-tight text-headingColor sm:text-[3.5rem]'>
            Care you can get <span className='text-primaryColor'>from home.</span>
          </h1>
          <p className='mt-4 max-w-[600px] text-[17px] leading-7 text-textColor'>
            Licensed doctors and specialists by video, voice and secure chat, for everyday illnesses, ongoing conditions, mental
            health, test results and more. Plus a free AI assistant for quick health questions.
          </p>
        </header>

        <div className='mt-10'>
          <ServicesShowcase />
        </div>

        {/* All services */}
        <div id='all-services' className='scroll-mt-28 pt-16 lg:pt-20'>
          <div className='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
            <h2 className='text-[2rem] font-medium leading-tight tracking-tight text-headingColor sm:text-[2.6rem]'>
              Every service, <span className='text-primaryColor'>online.</span>
            </h2>
            <div role='tablist' aria-label='Service categories' className='-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0'>
              {SERVICE_CATEGORIES.map(({ key, label }) => {
                const count = key === 'all' ? services.length : services.filter((s) => s.category === key).length;
                const active = category === key;
                return (
                  <button
                    key={key}
                    type='button'
                    role='tab'
                    aria-selected={active}
                    onClick={() => setCategory(key)}
                    className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition ${
                      active ? 'bg-headingColor text-white' : 'bg-white text-gray-600 hover:text-headingColor'
                    }`}
                  >
                    {label} <span className={`ml-1 tabular-nums ${active ? 'text-yellowColor' : 'text-gray-400'}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className='mt-8'>
            <ServiceList items={visible} variant='dark' />
          </div>
        </div>

        {/* How it works */}
        <div className='relative mt-16 overflow-hidden rounded-[2rem] bg-white p-7 shadow-[0_30px_60px_-40px_rgba(27,26,30,0.4)] sm:p-10'>
          <div
            aria-hidden
            className='pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl'
            style={{ background: 'radial-gradient(circle, rgba(13,140,129,0.35) 0%, transparent 70%)' }}
          />
          <h2 className='relative text-[2rem] font-medium leading-tight tracking-tight text-headingColor'>
            How it <span className='text-primaryColor'>works</span>
          </h2>
          <ol className='relative mt-8 grid gap-6 md:grid-cols-3'>
            {STEPS.map(({ icon: Icon, title, text, color }, i) => (
              <li key={title} className='rounded-2xl bg-[#f3f4f4] p-5'>
                <div className='flex items-center justify-between'>
                  <span className='flex h-11 w-11 items-center justify-center rounded-xl bg-headingColor' style={{ color }}>
                    <Icon size={20} />
                  </span>
                  <span className='text-3xl font-medium tabular-nums text-gray-300'>0{i + 1}</span>
                </div>
                <p className='mt-4 text-lg font-medium text-headingColor'>{title}</p>
                <p className='mt-1 text-sm leading-6 text-textColor'>{text}</p>
              </li>
            ))}
          </ol>
          <div className='relative mt-8'>
            <Link
              href='/doctors'
              className='inline-flex items-center gap-2 rounded-full bg-primaryColor px-7 py-3 text-sm font-semibold text-white transition hover:bg-primaryColor2'
            >
              Find a doctor <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {/* Honest limits */}
        <div className='relative mt-6 overflow-hidden rounded-[2rem] bg-headingColor p-7 text-white sm:p-10'>
          <div
            aria-hidden
            className='pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full blur-3xl'
            style={{ background: 'radial-gradient(circle, rgba(254,182,13,0.4) 0%, transparent 70%)' }}
          />
          <div className='relative grid gap-8 md:grid-cols-[1fr_1.3fr]'>
            <div>
              <span className='flex h-12 w-12 items-center justify-center rounded-2xl border border-yellowColor/50 bg-white/10'>
                <Hospital size={22} className='text-yellowColor' />
              </span>
              <h2 className='mt-5 text-[2rem] font-medium leading-tight tracking-tight'>
                When you need <span className='text-yellowColor'>in-person</span> care
              </h2>
              <p className='mt-3 text-[15px] leading-6 text-white/60'>
                Online consultations can't replace a hospital or clinic for everything. Our doctors will tell you when you need to be
                seen in person, and can refer you.
              </p>
            </div>
            <div>
              <ul className='space-y-3 border-t border-white/10 pt-5 md:border-t-0 md:pt-0'>
                {IN_PERSON_ONLY.map((item) => (
                  <li key={item} className='flex gap-2.5 text-[15px] leading-6 text-white/85'>
                    <span className='font-bold text-yellowColor'>+</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className='mt-6 flex gap-2.5 rounded-2xl bg-red-500/15 p-4 text-sm font-semibold leading-6 text-red-200 ring-1 ring-red-400/30'>
                <Siren size={18} className='mt-0.5 shrink-0 text-red-300' />
                In an emergency, call your local emergency number now: 112 in Nigeria and Europe, 911 in the US, 999 in the UK.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
