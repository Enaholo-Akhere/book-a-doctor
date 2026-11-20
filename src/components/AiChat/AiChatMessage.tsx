import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CalendarPlus, ExternalLink, Phone, RotateCcw, Siren, Sparkles } from 'lucide-react';
import type { AiChatEntry } from '@/types/ai-chat';

// Emergency and crisis numbers used in the fixed emergency replies.
const PHONE = /(1-800-222-1222|116 123|\b(?:112|911|999|988)\b)/g;

/** Makes the emergency numbers in fixed replies tappable. */
const withPhoneLinks = (text: string, key: number): ReactNode =>
  text.split(PHONE).map((part, i) =>
    i % 2 === 1 ? (
      <a
        key={`${key}-${i}`}
        href={`tel:${part.replace(/[^\d]/g, '')}`}
        className='inline-flex items-center gap-0.5 rounded font-semibold text-red-700 underline decoration-red-300 underline-offset-2 hover:decoration-red-600'
      >
        <Phone size={12} aria-hidden />
        {part}
      </a>
    ) : (
      <Fragment key={`${key}-${i}`}>{part}</Fragment>
    )
  );

/** Renders **bold** spans without using innerHTML. */
const inline = (text: string, phones = false): ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className='font-semibold text-gray-900'>
        {phones ? withPhoneLinks(part.slice(2, -2), i) : part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{phones ? withPhoneLinks(part, i) : part}</Fragment>
    )
  );

const BULLET = /^\s*(?:[-*•]|\d+[.)])\s+/;

/** Minimal, safe formatter for the assistant's plain-text answers (paragraphs + bullet lists). */
const AiChatFormatted = ({ text, phones = false }: { text: string; phones?: boolean }) => {
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  let para: string[] = [];

  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={blocks.length} className='list-disc space-y-1 pl-5 marker:text-violet-400'>
        {list.map((item, i) => (
          <li key={i}>{inline(item, phones)}</li>
        ))}
      </ul>
    );
    list = [];
  };
  const flushPara = () => {
    if (!para.length) return;
    blocks.push(<p key={blocks.length}>{inline(para.join(' '), phones)}</p>);
    para = [];
  };

  for (const raw of text.split('\n')) {
    const line = raw.replace(/^#+\s*/, '').trimEnd();
    if (!line.trim()) {
      flushList();
      flushPara();
    } else if (BULLET.test(line)) {
      flushPara();
      list.push(line.replace(BULLET, ''));
    } else {
      flushList();
      para.push(line.trim());
    }
  }
  flushList();
  flushPara();

  return <div className='space-y-2'>{blocks}</div>;
};

interface Props {
  entry: AiChatEntry;
  disclaimer?: string;
  bookingUrl?: string;
  onNavigate?: () => void;
  onRetry?: () => void;
}

const AiChatMessage = ({ entry, disclaimer, bookingUrl = '/doctors', onNavigate, onRetry }: Props) => {
  if (entry.role === 'user') {
    return (
      <div className='flex justify-end'>
        <p
          className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md px-3.5 py-2.5 text-sm leading-6 ${
            entry.blocked ? 'bg-violet-100 text-violet-900' : 'bg-violet-600 text-white'
          }`}
        >
          {entry.content}
        </p>
      </div>
    );
  }

  return (
    <div className='flex gap-2.5'>
      <span aria-hidden className='mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white'>
        <Sparkles size={14} />
      </span>
      <div className='min-w-0 max-w-[85%]'>
        {entry.error ? (
          <div className='rounded-2xl rounded-tl-md border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm leading-6 text-red-700'>
            <p>{entry.content}</p>
            {onRetry && (
              <button
                type='button'
                onClick={onRetry}
                className='mt-1.5 inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-red-700 underline-offset-2 hover:underline'
              >
                <RotateCcw size={12} /> Try again
              </button>
            )}
          </div>
        ) : entry.type === 'limit' ? (
          <div className='rounded-2xl rounded-tl-md border border-violet-200 bg-violet-50 px-3.5 py-3 text-sm leading-6 text-violet-950'>
            <p className='font-semibold'>Daily limit reached</p>
            <p className='mt-0.5 text-violet-900/90'>{entry.content}</p>
            <Link
              to={bookingUrl}
              onClick={onNavigate}
              className='mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-primaryColor px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-primaryColor2'
            >
              <CalendarPlus size={16} /> Book a doctor
            </Link>
          </div>
        ) : entry.type === 'emergency' ? (
          <div role='alert' className='break-words rounded-2xl rounded-tl-md border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-6 text-gray-800'>
            <p className='mb-1.5 flex items-center gap-1.5 font-semibold text-red-700'>
              <Siren size={16} aria-hidden /> Get help now
            </p>
            <AiChatFormatted text={entry.content} phones />
          </div>
        ) : (
          <>
            <div className='break-words rounded-2xl rounded-tl-md border border-violet-100 bg-white px-3.5 py-2.5 text-sm leading-6 text-gray-700 shadow-sm'>
              <AiChatFormatted text={entry.content} />

              {/* Booking buttons from the agent (internal routes only) */}
              {!!entry.actions?.filter((a) => a.url.startsWith('/')).length && (
                <div className='mt-3 flex flex-wrap gap-2'>
                  {entry.actions
                    .filter((a) => a.url.startsWith('/'))
                    .map((a, i) => (
                      <Link
                        key={a.url}
                        to={a.url}
                        onClick={onNavigate}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          i === 0 ? 'bg-primaryColor text-white hover:bg-primaryColor2' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {i === 0 && <CalendarPlus size={14} />} {a.label}
                      </Link>
                    ))}
                </div>
              )}

              {/* Trusted references (https only, open in a new tab) */}
              {!!entry.sources?.filter((s) => s.url.startsWith('https://')).length && (
                <div className='mt-3 border-t border-gray-100 pt-2'>
                  <p className='flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400'>
                    <BookOpen size={12} /> Sources
                  </p>
                  <ul className='mt-1 space-y-0.5'>
                    {entry.sources
                      .filter((s) => s.url.startsWith('https://'))
                      .map((s) => (
                        <li key={s.url}>
                          <a
                            href={s.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-1 text-xs text-violet-700 hover:underline'
                          >
                            {s.title} <span className='text-gray-400'>· {s.publisher.split(' (')[0]}</span>
                            <ExternalLink size={11} className='shrink-0 text-gray-400' />
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
            {disclaimer && <p className='mt-1 pl-1 text-[11px] text-gray-400'>{disclaimer}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default AiChatMessage;
