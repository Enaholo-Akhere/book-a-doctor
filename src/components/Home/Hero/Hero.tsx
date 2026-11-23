import Link from 'next/link';
import { motion, MotionConfig, type Variants } from 'framer-motion';
import { GoArrowUpRight } from 'react-icons/go';
import { TbHeartHandshake } from 'react-icons/tb';
import { MdOutlineSupportAgent, MdOutlineVerified } from 'react-icons/md';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { IoChatbubblesOutline, IoVideocamOutline } from 'react-icons/io5';
import heroDoctorsAsset from '@/assets/images/hero-doctors.jpg';
import { useAuthStore } from '@/store/authStore';
import { getDefaultRoute } from '@/routes/redirect';
import CountUp from './CountUp';

const heroDoctors: string = heroDoctorsAsset.src;

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

// ── Motion ──────────────────────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1] as const;

const headline: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const word: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE } },
};
const fromSide = (x: number, delay: number): Variants => ({
  hidden: { opacity: 0, x },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, delay, ease: EASE } },
});
const stagger = (delay: number, gap = 0.12): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});
const rise: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Soft "+" marks that drift gently, as in the design. */
const Plus = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.span
    aria-hidden
    className={`pointer-events-none absolute text-white/70 select-none ${className}`}
    initial={{ opacity: 0, scale: 0.6 }}
    animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
    transition={{
      opacity: { duration: 0.6, delay },
      scale: { duration: 0.6, delay },
      y: { duration: 5, delay, repeat: Infinity, ease: 'easeInOut' },
    }}
  >
    <svg viewBox='0 0 24 24' className='size-full' fill='currentColor'>
      <path d='M9 2h6v7h7v6h-7v7H9v-7H2V9h7z' />
    </svg>
  </motion.span>
);

const Hero = () => {
  const user = useAuthStore((s) => s.user);
  const secondary = user
    ? { to: getDefaultRoute(user.role), label: 'My Account' }
    : { to: '/login', label: 'Log In' };

  return (
    <MotionConfig reducedMotion='user'>
      {/* Below lg the hero is tall and narrow: "cover" would crop the gradient to its
          white centre, so stretch it to keep the cyan and peach corners visible. */}
      <section className='hero__section relative overflow-hidden !px-0 !pb-0 pt-10 md:pt-14 max-lg:!bg-[length:100%_100%]'>
        <div className='container relative'>
          {/* ── Headline ─────────────────────────────────────── */}
          <motion.h1
            variants={headline}
            initial='hidden'
            animate='show'
            className='mx-auto max-w-[980px] text-center text-[34px] leading-[1.15] sm:text-[48px] lg:text-[64px] xl:text-[72px] font-[800] tracking-[-0.02em] text-headingColor'
          >
            {HEADLINE.map((w, i) => (
              <motion.span
                key={w.text}
                variants={word}
                className={`inline-block ${w.accent ? 'text-primaryColor' : ''} ${i < HEADLINE.length - 1 ? 'mr-[0.25em]' : ''}`}
              >
                {w.text}
              </motion.span>
            ))}
          </motion.h1>

          {/* ── Body: copy | photo stage | stats ─────────────── */}
          <div className='mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,600px)_1fr] items-end gap-y-10 lg:gap-x-6'>
            {/* Left */}
            <motion.div
              variants={fromSide(-30, 0.7)}
              initial='hidden'
              animate='show'
              className='order-2 lg:order-1 self-center max-w-[360px] mx-auto lg:mx-0 text-center lg:text-left lg:pb-24'
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
                    <CountUp to={1000} suffix='+' delay={0.9} duration={2.2} />
                  </p>
                  <p className='mt-1 text-[13px] text-textColor'>Happy patients</p>
                </div>
              </div>
            </motion.div>

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
                  <motion.path
                    key={r}
                    d={`M ${300 - r} 360 A ${r} ${r} 0 0 1 ${300 + r} 360`}
                    stroke='#0d8c81'
                    strokeOpacity={0.14 + i * 0.05}
                    strokeWidth={1.5}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.4, delay: 0.5 + i * 0.15, ease: EASE }}
                  />
                ))}
              </svg>

              {/* dotted texture behind the photo */}
              <div
                aria-hidden
                className='pointer-events-none absolute inset-x-[6%] top-[8%] bottom-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_70%)]'
                style={{ backgroundImage: 'radial-gradient(#0d8c81 1px, transparent 1px)', backgroundSize: '14px 14px' }}
              />

              <Plus className='size-7 sm:size-9 left-[2%] top-[18%] text-primaryColor/25' delay={1.2} />
              <Plus className='size-6 sm:size-8 right-[4%] top-[6%] text-primaryColor/25' delay={1.4} />
              <Plus className='size-5 sm:size-7 right-[-2%] top-[42%] text-primaryColor/20' delay={1.6} />

              {/* photo in an arch, fading into the strip below */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.35, ease: EASE }}
                className='relative mx-auto w-[88%] overflow-hidden rounded-t-[999px] shadow-[0_30px_80px_-20px_rgba(13,140,129,0.35)] ring-8 ring-white/60'
              >
                <img
                  src={heroDoctors}
                  alt='Three CareConnect doctors in white coats'
                  className='block aspect-[5/4] w-full object-cover object-[50%_20%] brightness-[1.12] contrast-[0.95] saturate-[0.92]'
                  fetchPriority='high'
                />
                <div aria-hidden className='absolute inset-0 bg-gradient-to-b from-white/30 via-white/5 to-transparent' />
                <div aria-hidden className='absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white via-white/40 to-transparent' />
                <div aria-hidden className='absolute inset-0 bg-gradient-to-br from-primaryColor/10 via-transparent to-[#feb60d]/10 mix-blend-multiply' />
              </motion.div>

              {/* CTA pill */}
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.1, ease: EASE }}
                className='relative z-0 mx-auto mt-4 flex w-fit gap-2 rounded-full bg-white p-2 shadow-[0_12px_40px_-8px_rgba(27,26,30,0.25)] sm:absolute sm:bottom-6 sm:left-1/2 sm:mt-0 sm:-translate-x-1/2'
              >
                <Link
                  href='/contact'
                  className='whitespace-nowrap rounded-full bg-primaryColor px-5 sm:px-7 py-3 text-[15px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(13,140,129,0.6)] transition hover:bg-primaryColor2 hover:-translate-y-0.5'
                >
                  Contact
                </Link>
                <Link
                  href={secondary.to}
                  className='whitespace-nowrap rounded-full border border-headingColor/20 px-5 sm:px-7 py-3 text-[15px] font-semibold text-headingColor transition hover:border-primaryColor hover:text-primaryColor'
                >
                  {secondary.label}
                </Link>
              </motion.div>
            </div>

            {/* Right: stats */}
            <motion.div
              variants={stagger(0.85, 0.18)}
              initial='hidden'
              animate='show'
              className='order-3 flex justify-center gap-10 lg:flex-col lg:items-end lg:gap-14 lg:self-center lg:pb-24'
            >
              {STATS.map((s) => (
                <motion.div key={s.label} variants={fromSide(30, 0)} className='flex items-center gap-5'>
                  <div className='text-center lg:text-right'>
                    <p className='text-[44px] lg:text-[60px] leading-none font-[700] text-primaryColor'>
                      <CountUp to={s.to} suffix={s.suffix} delay={1} duration={2} />
                    </p>
                    <p className='mt-2 text-[13px] text-textColor'>{s.label}</p>
                  </div>
                  {/* vertical rule with a diamond, as in the design */}
                  <span aria-hidden className='relative hidden lg:block h-24 w-px bg-primaryColor/40'>
                    <span className='absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-primaryColor' />
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Trust strip ───────────────────────────────────── */}
        <motion.div
          variants={stagger(1.25, 0.08)}
          initial='hidden'
          animate='show'
          className='relative bg-white'
        >
          <ul className='container grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-4 py-8 lg:justify-between lg:px-16'>
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <motion.li
                key={label}
                variants={rise}
                className='flex items-center gap-2 sm:gap-2.5 text-[14px] sm:text-[17px] lg:text-[20px] font-semibold text-gray-500 last:col-span-2 last:justify-center sm:last:col-span-1'
              >
                <Icon className='size-6 text-gray-400' aria-hidden />
                {label}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </section>
    </MotionConfig>
  );
};

export default Hero;
