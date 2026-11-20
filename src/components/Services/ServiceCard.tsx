import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { Service } from '@/assets/data/services';
import { useAuthStore } from '@/store/authStore';
import { openAiChat } from '@/components/AiChat/openAiChat';

/**
 * - light: the home page section
 * - dark:  the Services page (glowing dark cards, after the reference design)
 */
const ServiceCard = ({ item, variant = 'light' }: { item: Service; variant?: 'light' | 'dark' }) => {
  const { name, desc, includes, icon: Icon, color, cta, category } = item;
  const role = useAuthStore((s) => s.user?.role);
  const isAi = category === 'ai';
  // The AI assistant is for patients and guests only.
  const aiUnavailable = isAi && role === 'doctor';

  if (variant === 'dark') {
    const ctaClass = 'inline-flex items-center gap-1.5 text-sm font-bold text-white transition hover:gap-2.5';
    return (
      <article className='group relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-headingColor p-7 text-white shadow-[0_30px_60px_-35px_rgba(27,26,30,0.6)] transition duration-300 hover:-translate-y-1'>
        <div
          aria-hidden
          className='pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full opacity-60 blur-3xl transition-opacity duration-300 group-hover:opacity-90'
          style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
        />

        <div className='relative flex items-start justify-between'>
          <span
            className='flex h-14 w-14 items-center justify-center rounded-2xl border bg-white/10 backdrop-blur-md'
            style={{ borderColor: `${color}80` }}
          >
            <Icon size={24} aria-hidden />
          </span>
          {isAi && <span className='rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80'>Free · 24/7</span>}
        </div>

        <h3 className='relative mt-10 text-[1.6rem] font-medium leading-tight tracking-tight'>{name}</h3>
        <p className='relative mt-3 text-[15px] leading-6 text-white/60'>{desc}</p>

        <ul className='relative mt-5 space-y-2.5 border-t border-white/10 pt-5'>
          {includes.map((point) => (
            <li key={point} className='flex gap-2.5 text-sm leading-6 text-white/85'>
              <span className='font-bold' style={{ color }} aria-hidden>
                +
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <div className='relative mt-auto flex justify-center pt-7'>
          {aiUnavailable ? (
            <span className='text-sm text-white/40'>Available to patients</span>
          ) : cta.to === 'ai' ? (
            <button type='button' onClick={openAiChat} className={`${ctaClass} cursor-pointer`}>
              {cta.label} <ArrowUpRight size={16} />
            </button>
          ) : (
            <Link to={cta.to} className={ctaClass}>
              {cta.label} <ArrowUpRight size={16} />
            </Link>
          )}
        </div>
      </article>
    );
  }

  const ctaClass =
    'mt-auto inline-flex items-center gap-1.5 self-start pt-5 text-sm font-semibold text-primaryColor transition group-hover:gap-2.5';

  return (
    <article
      className={`group flex h-full flex-col rounded-2xl border bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(13,140,129,0.35)] ${
        isAi ? 'border-violet-200' : 'border-gray-100'
      }`}
      data-aos='fade-up'
      data-aos-delay='100'
    >
      <div className='flex items-start justify-between gap-3'>
        <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl' style={{ background: `${color}1f`, color }}>
          <Icon size={24} aria-hidden />
        </span>
        {isAi && <span className='rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700'>Free · 24/7</span>}
      </div>

      <h3 className='mt-5 text-xl font-bold leading-snug text-headingColor'>{name}</h3>
      <p className='mt-2 text-[15px] leading-7 text-textColor'>{desc}</p>

      <ul className='mt-4 space-y-2'>
        {includes.map((point) => (
          <li key={point} className='flex gap-2 text-sm leading-6 text-gray-600'>
            <Check size={16} className='mt-1 shrink-0' style={{ color }} aria-hidden />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      {aiUnavailable ? (
        <p className='mt-auto pt-5 text-sm text-gray-400'>Available to patients</p>
      ) : cta.to === 'ai' ? (
        <button type='button' onClick={openAiChat} className={`${ctaClass} cursor-pointer text-violet-700`}>
          {cta.label} <ArrowRight size={16} />
        </button>
      ) : (
        <Link to={cta.to} className={ctaClass}>
          {cta.label} <ArrowRight size={16} />
        </Link>
      )}
    </article>
  );
};

export default ServiceCard;
