import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { GoArrowUpRight } from 'react-icons/go';
import { TbHeartHandshake } from 'react-icons/tb';
import { MdOutlineSupportAgent, MdOutlineVerified } from 'react-icons/md';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { IoChatbubblesOutline, IoVideocamOutline } from 'react-icons/io5';
import heroDoctorsAsset from '@/assets/images/hero-doctors.jpg';
import CountUp from './CountUp';
import HeroAccountLink from './HeroAccountLink';

// A server component: everything here is static markup with CSS entrance animations
// (see "Hero entrance" in index.css), so it paints fully without waiting for JavaScript.
// Only the account link and the counters are client components.

// ── Content ─────────────────────────────────────────────────────────
const HEADLINE: { text: string; accent?: boolean }[] = [
  { text: 'Expert' },
  { text: 'Consultation', accent: true },
  { text: 'Without' },
  { text: 'Leaving' },
  { text: 'Home' },
];

const STATS = [
  { to: 30, suffix: '+', label: 'Years of Experience' },
  { to: 15, suffix: '+', label: 'Clinic Locations' },
];

const TRUST_ITEMS = [
  { icon: MdOutlineVerified, label: 'Verified Doctors' },
  { icon: IoVideocamOutline, label: 'Video Consultations' },
  { icon: IoChatbubblesOutline, label: 'Private Chat' },
  { icon: RiSecurePaymentLine, label: 'Secure Payments' },
  { icon: MdOutlineSupportAgent, label: '24/7 Support' },
];

/** Inline style for a CSS animation delay, in seconds. */
const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

/** Soft "+" marks that fade in and then drift gently, as in the design. */
const Plus = ({ className, delay: d = 0 }: { className: string; delay?: number }) => (
  <span
    aria-hidden
    className={`hero-plus pointer-events-none absolute text-white/70 select-none ${className}`}
    style={{ animationDelay: `${d}s, ${d}s` }}
  >
    <svg viewBox='0 0 24 24' className='size-full' fill='currentColor'>
      <path d='M9 2h6v7h7v6h-7v7H9v-7H2V9h7z' />
    </svg>
  </span>
);

const Hero = () => {
  return (
    /* Below lg the hero is tall and narrow: "cover" would crop the gradient to its
       white centre, so stretch it to keep the cyan and peach corners visible. */
    <section className='hero__section relative overflow-hidden !px-0 !pb-0 pt-10 md:pt-14 max-lg:!bg-[length:100%_100%]'>
      <div className='container relative'>
        {/* ── Headline ─────────────────────────────────────── */}
        {/* Only a slide, no fade: the headline is the page's largest text, and starting it
            at opacity 0 would hide it during the animation and delay LCP. */}
        <h1 className='mx-auto max-w-[980px] text-center text-[34px] leading-[1.15] sm:text-[48px] lg:text-[64px] xl:text-[72px] font-[800] tracking-[-0.02em] text-headingColor'>
          {HEADLINE.map((w, i) => (
            <span
              key={w.text}
              style={delay(0.05 + i * 0.06)}
              className={`hero-anim hero-anim-slide-up inline-block ${w.accent ? 'text-primaryColor' : ''} ${i < HEADLINE.length - 1 ? 'mr-[0.25em]' : ''}`}
            >
              {w.text}
            </span>
          ))}
        </h1>

        {/* ── Body: copy | photo stage | stats ─────────────── */}
        <div className='mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,600px)_1fr] items-end gap-y-10 lg:gap-x-6'>
          {/* Left */}
          <div
            style={delay(0.3)}
            className='hero-anim hero-anim-in-left order-2 lg:order-1 self-center max-w-[360px] mx-auto lg:mx-0 text-center lg:text-left lg:pb-24'
          >
            <p className='text-[16px] leading-[1.7] text-textColor'>
              Book appointments with trusted experts in just a few clicks. Get professional guidance from the comfort of
              your home.
            </p>
            <Link
              href='/doctors'
              className='group mt-4 flex w-fit mx-auto lg:mx-0 items-center gap-1.5 font-semibold text-primaryColor hover:text-primaryColor2'
            >
              Book Trusted Experts
              <GoArrowUpRight className='transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5' />
            </Link>

            <div className='mt-8 lg:mt-10 flex w-fit mx-auto lg:mx-0 items-center gap-3'>
              <span className='flex size-12 items-center justify-center rounded-2xl bg-primaryColor/10 text-primaryColor'>
                <TbHeartHandshake className='size-7' />
              </span>
              <div className='text-left'>
                <p className='text-[30px] leading-none font-[700] text-headingColor'>
                  <CountUp to={1000} suffix='+' delay={0.4} duration={2.2} />
                </p>
                <p className='mt-1 text-[13px] text-textColor'>Happy patients</p>
              </div>
            </div>
          </div>

          {/* Center: arch stage */}
          <div className='order-1 lg:order-2 relative mx-auto w-full max-w-[600px]'>
            {/* concentric arcs drawing in */}
            <svg
              aria-hidden
              viewBox='0 0 600 360'
              className='pointer-events-none absolute -left-[12%] -right-[12%] bottom-0 w-[124%] h-auto'
              fill='none'
            >
              {[290, 250, 210].map((r, i) => (
                <path
                  key={r}
                  d={`M ${300 - r} 360 A ${r} ${r} 0 0 1 ${300 + r} 360`}
                  pathLength={1}
                  stroke='#0c8075'
                  strokeOpacity={0.14 + i * 0.05}
                  strokeWidth={1.5}
                  className='hero-anim hero-anim-draw'
                  style={delay(0.3 + i * 0.12)}
                />
              ))}
            </svg>

            {/* dotted texture behind the photo */}
            <div
              aria-hidden
              className='pointer-events-none absolute inset-x-[6%] top-[8%] bottom-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_70%)]'
              style={{ backgroundImage: 'radial-gradient(#0c8075 1px, transparent 1px)', backgroundSize: '14px 14px' }}
            />

            <Plus className='size-7 sm:size-9 left-[2%] top-[18%] text-primaryColor/25' delay={0.6} />
            <Plus className='size-6 sm:size-8 right-[4%] top-[6%] text-primaryColor/25' delay={0.7} />
            <Plus className='size-5 sm:size-7 right-[-2%] top-[42%] text-primaryColor/20' delay={0.8} />

            {/* photo in an arch, fading into the strip below */}
            <div
              style={delay(0.15)}
              className='hero-anim hero-anim-photo relative mx-auto w-[88%] overflow-hidden rounded-t-[999px] shadow-[0_30px_80px_-20px_rgba(13,140,129,0.35)] ring-8 ring-white/60'
            >
              <Image
                src={heroDoctorsAsset}
                alt='Three CareConnect doctors in white coats'
                priority
                sizes='(min-width: 1024px) 600px, 100vw'
                className='block aspect-[5/4] w-full object-cover object-[50%_20%] brightness-[1.12] contrast-[0.95] saturate-[0.92]'
                fetchPriority='high'
              />
              <div aria-hidden className='absolute inset-0 bg-gradient-to-b from-white/30 via-white/5 to-transparent' />
              <div aria-hidden className='absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white via-white/40 to-transparent' />
              <div aria-hidden className='absolute inset-0 bg-gradient-to-br from-primaryColor/10 via-transparent to-[#feb60d]/10 mix-blend-multiply' />
            </div>

            {/* CTA pill. The outer div positions it; the inner one animates, so the
                animation's transform doesn't override the centring translate. */}
            <div className='relative z-0 mx-auto mt-4 w-fit sm:absolute sm:bottom-6 sm:left-1/2 sm:mt-0 sm:-translate-x-1/2'>
              <div
                style={delay(0.45)}
                className='hero-anim hero-anim-pop flex w-fit gap-2 rounded-full bg-white p-2 shadow-[0_12px_40px_-8px_rgba(27,26,30,0.25)]'
              >
                <Link
                  href='/contact'
                  className='whitespace-nowrap rounded-full bg-primaryColor px-5 sm:px-7 py-3 text-[15px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(13,140,129,0.6)] transition hover:bg-primaryColor2 hover:-translate-y-0.5'
                >
                  Contact
                </Link>
                <HeroAccountLink className='whitespace-nowrap rounded-full border border-headingColor/20 px-5 sm:px-7 py-3 text-[15px] font-semibold text-headingColor transition hover:border-primaryColor hover:text-primaryColor' />
              </div>
            </div>
          </div>

          {/* Right: stats */}
          <div className='order-3 flex justify-center gap-10 lg:flex-col lg:items-end lg:gap-14 lg:self-center lg:pb-24'>
            {STATS.map((s, i) => (
              <div
                key={s.label}
                style={delay(0.35 + i * 0.12)}
                className='hero-anim hero-anim-in-right flex items-center gap-5'
              >
                <div className='text-center lg:text-right'>
                  <p className='text-[44px] lg:text-[60px] leading-none font-[700] text-primaryColor'>
                    <CountUp to={s.to} suffix={s.suffix} delay={0.5} duration={2} />
                  </p>
                  <p className='mt-2 text-[13px] text-textColor'>{s.label}</p>
                </div>
                {/* vertical rule with a diamond, as in the design */}
                <span aria-hidden className='relative hidden lg:block h-24 w-px bg-primaryColor/40'>
                  <span className='absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-primaryColor' />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Trust strip ───────────────────────────────────── */}
      <div className='relative bg-white'>
        <ul className='container grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-4 py-8 lg:justify-between lg:px-16'>
          {TRUST_ITEMS.map(({ icon: Icon, label }, i) => (
            <li
              key={label}
              style={delay(0.5 + i * 0.06)}
              className='hero-anim hero-anim-rise flex items-center gap-2 sm:gap-2.5 text-[14px] sm:text-[17px] lg:text-[20px] font-semibold text-slate-500 last:col-span-2 last:justify-center sm:last:col-span-1'
            >
              <Icon className='size-6 text-slate-400' aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Hero;
