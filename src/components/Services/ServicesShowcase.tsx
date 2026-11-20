import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUpRight,
  Baby,
  BadgeCheck,
  Brain,
  FileImage,
  Heart,
  HeartPulse,
  MessageCircle,
  Phone,
  ScanFace,
  Sparkles,
  Stethoscope,
  Video,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { openAiChat } from '@/components/AiChat/openAiChat';
import { services } from '@/assets/data/services';

/** Soft colour bloom behind card content. */
const Glow = ({ color, className }: { color: string; className: string }) => (
  <div
    aria-hidden
    className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
    style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
  />
);

const cardBase =
  'relative flex h-[34rem] w-[85vw] max-w-[22rem] shrink-0 snap-center flex-col overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-30px_rgba(27,26,30,0.45)] sm:w-auto sm:max-w-none';

const Footer = ({ children, dark }: { children: React.ReactNode; dark?: boolean }) => (
  <div className={`mt-auto flex justify-center pt-6 text-sm font-bold ${dark ? 'text-white' : 'text-headingColor'}`}>{children}</div>
);

/** 1. Light card: what CareConnect is. */
const ConsultCard = () => (
  <article className={`${cardBase} bg-white p-7`}>
    <Glow color='rgba(13,140,129,0.55)' className='-left-24 -top-16 h-80 w-80' />
    <Glow color='rgba(254,182,13,0.45)' className='-right-20 top-40 h-64 w-64' />

    {/* Availability ring */}
    <div className='relative ml-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-primaryColor/30'>
      <div className='flex h-[4.5rem] w-[4.5rem] flex-col items-center justify-center rounded-full bg-headingColor text-white'>
        <span className='text-xl font-semibold leading-none'>24/7</span>
        <span className='mt-1 text-[9px] uppercase tracking-wider text-white/60'>Online</span>
      </div>
    </div>

    {/* Glass question */}
    <div className='relative -mt-6 rounded-2xl border border-white/60 bg-white/50 p-4 shadow-sm backdrop-blur-md'>
      <p className='text-lg leading-snug text-headingColor'>Is this rash something I should worry about?</p>
    </div>
    <div className='relative mt-3 flex justify-end gap-2'>
      <span className='inline-flex items-center gap-1 rounded-full bg-primaryColor px-2.5 py-1 text-xs font-semibold text-white'>
        <Video size={12} /> Video
      </span>
      <span className='inline-flex items-center gap-1 rounded-full bg-yellowColor px-2.5 py-1 text-xs font-semibold text-headingColor'>
        <MessageCircle size={12} /> Chat
      </span>
    </div>

    <h2 className='relative mt-auto text-[2.4rem] font-medium leading-[1.05] tracking-tight text-headingColor'>
      Ask.
      <br />
      Consult.
      <br />
      Feel better.
    </h2>
    <p className='relative mt-3 text-[15px] leading-6 text-textColor'>
      Licensed doctors by video, voice and secure chat, wherever you are.
    </p>
    <Footer>
      <a href='#all-services' className='inline-flex items-center gap-1.5 hover:text-primaryColor'>
        Browse services <ArrowDown size={16} />
      </a>
    </Footer>
  </article>
);

/** 2. Dark card: the AI assistant. */
const AiCard = () => {
  const isDoctor = useAuthStore((s) => s.user?.role) === 'doctor';
  return (
    <article className={`${cardBase} bg-headingColor p-7 text-white`}>
      <Glow color='rgba(151,113,255,0.7)' className='-top-24 left-1/2 h-80 w-80 -translate-x-1/2' />
      <Glow color='rgba(1,181,197,0.35)' className='-left-16 top-24 h-48 w-48' />

      <div className='relative rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md'>
        <p className='flex items-center gap-1.5 text-xs font-semibold text-white/70'>
          <Sparkles size={13} /> AI Health Assistant
        </p>
        <p className='mt-1.5 text-lg leading-snug'>How much water should I drink in a day?</p>
      </div>

      {/* Quota pill, echoing the reference slider */}
      <div className='relative mt-5 flex items-center justify-between rounded-full border border-white/15 bg-gradient-to-r from-purpleColor to-irisBlueColor p-1.5 text-xs font-bold'>
        <span className='px-3'>3 free / day</span>
        <span className='flex h-8 w-8 items-center justify-center rounded-full bg-white text-headingColor'>
          <Sparkles size={14} />
        </span>
        <span className='px-3'>Unlimited</span>
      </div>
      <div className='relative mt-3 flex justify-between text-[11px] leading-4 text-white/60'>
        <span>Free for everyone,
          <br />
          every day</span>
        <span className='text-right'>With an active
          <br />
          booking</span>
      </div>

      <h2 className='relative mt-auto text-[2.1rem] font-medium leading-[1.1] tracking-tight'>
        Have a health question? <span className='text-purpleColor'>Ask our AI.</span>
      </h2>
      <p className='relative mt-3 text-[15px] leading-6 text-white/60'>
        General answers from trusted medical sources. It's not a doctor, and it will tell you when to see one.
      </p>
      <Footer dark>
        {isDoctor ? (
          <span className='font-medium text-white/50'>Available to patients</span>
        ) : (
          <button type='button' onClick={openAiChat} className='inline-flex cursor-pointer items-center gap-1.5 hover:text-purpleColor'>
            Ask the AI <ArrowUpRight size={16} />
          </button>
        )}
      </Footer>
    </article>
  );
};

/** 3. Dark card: specialists orbit. */
const orbit = [
  { icon: Brain, label: 'Mental health', className: 'left-2 top-10', color: '#9771FF' },
  { icon: Baby, label: 'Paediatrics', className: 'right-0 top-4', color: '#01B5C5' },
  { icon: ScanFace, label: 'Dermatology', className: 'left-6 bottom-6', color: '#FEB60D' },
  { icon: HeartPulse, label: 'Heart health', className: 'right-4 bottom-12', color: '#0D8C81' },
];

const SpecialistsCard = () => (
  <article className={`${cardBase} bg-headingColor p-7 text-white`}>
    <Glow color='rgba(13,140,129,0.75)' className='-left-20 -top-20 h-96 w-96' />

    <div className='relative mx-auto h-64 w-full'>
      {/* Rings */}
      <div aria-hidden className='absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10' />
      <div aria-hidden className='absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15' />
      {/* Centre */}
      <div className='absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center'>
        <span className='flex h-20 w-20 items-center justify-center rounded-full border-2 border-yellowColor/80 bg-primaryColor shadow-[0_0_40px_rgba(13,140,129,0.6)]'>
          <Stethoscope size={32} />
        </span>
        <span className='-mt-3 inline-flex items-center gap-1 rounded-full bg-headingColor/90 px-2 py-0.5 text-[10px] font-semibold text-yellowColor ring-1 ring-yellowColor/40'>
          <BadgeCheck size={11} /> Verified
        </span>
      </div>
      {/* Orbiting specialties */}
      {orbit.map(({ icon: Icon, label, className, color }) => (
        <div key={label} className={`absolute flex flex-col items-center ${className}`}>
          <span
            className='flex h-12 w-12 items-center justify-center rounded-full border bg-white/10 backdrop-blur-md'
            style={{ borderColor: `${color}99` }}
          >
            <Icon size={20} style={{ color }} />
          </span>
          <span className='mt-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/80'>{label}</span>
        </div>
      ))}
      <span aria-hidden className='absolute right-16 top-28 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/90'>
        <Heart size={12} className='fill-white text-white' />
      </span>
    </div>

    <h2 className='relative mt-auto text-[2.1rem] font-medium leading-[1.1] tracking-tight'>
      Find the <span className='text-irisBlueColor'>right</span> doctor, right here
    </h2>
    <p className='relative mt-3 text-[15px] leading-6 text-white/60'>
      Verified specialists for skin, children, women's and men's health, mental health and more.
    </p>
    <Footer dark>
      <Link to='/doctors' className='inline-flex items-center gap-1.5 hover:text-irisBlueColor'>
        Find a doctor <ArrowUpRight size={16} />
      </Link>
    </Footer>
  </article>
);

/** 4. Black card with yellow accents: follow-up. */
const FollowUpCard = () => (
  <article className={`${cardBase} bg-black p-7 text-white`}>
    <h2 className='relative text-[2.1rem] font-medium leading-[1.1] tracking-tight'>
      <span className='text-yellowColor'>Stay in touch</span> after your visit
    </h2>
    <p className='relative mt-2 text-[15px] text-white/60'>Your doctor is one message away.</p>

    <p className='relative mt-8 text-5xl font-medium text-yellowColor'>{services.length}</p>
    <p className='relative mt-1 text-[15px]'>services you can get online</p>

    <div className='relative mt-6 flex items-center gap-2 text-sm text-white/60'>
      <span>Included with your booking</span>
      <span className='h-px flex-1 bg-white/20' />
    </div>
    <ul className='relative mt-3 space-y-2 text-[15px]'>
      {[
        { icon: MessageCircle, text: 'Secure chat with your doctor' },
        { icon: Phone, text: 'Voice and video calls' },
        { icon: FileImage, text: 'Share photos and reports' },
      ].map(({ icon: Icon, text }) => (
        <li key={text} className='flex items-center gap-2'>
          <span className='font-bold text-yellowColor'>+</span>
          <Icon size={15} className='text-white/50' />
          {text}
        </li>
      ))}
    </ul>

    {/* Yellow "coins" from the reference, as soft discs */}
    <div aria-hidden className='pointer-events-none absolute inset-x-0 bottom-0 h-40'>
      {/* Kept to the corners so the footer link stays readable. */}
      <div className='absolute -bottom-8 -left-6 h-16 w-24 -rotate-12 rounded-[50%] bg-gradient-to-br from-yellowColor to-amber-600 opacity-90' />
      <div className='absolute bottom-16 -right-3 h-10 w-16 rotate-[25deg] rounded-[50%] bg-gradient-to-br from-yellowColor to-amber-600 opacity-80' />
      <div className='absolute -bottom-12 -right-8 h-20 w-28 rotate-6 rounded-[50%] bg-gradient-to-br from-yellowColor to-amber-500 opacity-70 blur-[2px]' />
      <Glow color='rgba(254,182,13,0.45)' className='-bottom-24 left-1/2 h-48 w-72 -translate-x-1/2' />
    </div>
    <Footer dark>
      <Link to='/doctors' className='relative z-10 inline-flex items-center gap-1.5 hover:text-yellowColor'>
        Book a doctor <ArrowUpRight size={16} />
      </Link>
    </Footer>
  </article>
);

/**
 * Four staggered showcase cards (desktop) / a swipeable row (mobile),
 * modelled on the reference design, in the CareConnect palette.
 */
const ServicesShowcase = () => (
  <div className='-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 pt-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-4 xl:items-start'>
    <ConsultCard />
    <div className='shrink-0 snap-center xl:mt-24'>
      <AiCard />
    </div>
    <SpecialistsCard />
    <div className='shrink-0 snap-center xl:mt-24'>
      <FollowUpCard />
    </div>
  </div>
);

export default ServicesShowcase;
