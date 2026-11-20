import { useState } from 'react';
import { Database, EyeOff, Globe2, ShieldCheck, Stethoscope, Trash2 } from 'lucide-react';

interface Props {
  signedIn: boolean;
  onAccept: () => Promise<void>;
  onDecline: () => void;
}

/** Privacy notice shown before the first AI chat (and again whenever its version changes). */
const AiChatConsent = ({ signedIn, onAccept, onDecline }: Props) => {
  const [busy, setBusy] = useState(false);

  const points = [
    {
      icon: Stethoscope,
      text: "You're chatting with an AI, not a doctor. Answers are general information only, not medical advice. In an emergency, call your local emergency number (112, 911 or 999).",
    },
    {
      icon: EyeOff,
      text: 'Emails, phone numbers and ID numbers are removed from your messages before they reach the AI. Please don\'t share other personal details.',
    },
    {
      icon: Globe2,
      text: 'Messages are processed by our AI provider (Groq). Short medical search terms, never your message, are sent to MedlinePlus (U.S. National Library of Medicine) to find trusted sources.',
    },
    signedIn
      ? {
          icon: Database,
          text: 'Your conversation is saved to your account for 30 days (or while you have an active booking), then deleted automatically.',
        }
      : { icon: Database, text: "As a guest, your messages aren't stored on our servers. They stay in this browser tab only." },
    {
      icon: Trash2,
      text: signedIn
        ? 'You can download or delete your AI chat data at any time from this panel.'
        : 'We keep only an anonymous daily question count, deleted after 7 days.',
    },
  ];

  return (
    <div className='flex-1 overflow-y-auto bg-[#faf9ff] px-4 py-5'>
      <div className='mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700'>
        <ShieldCheck size={22} />
      </div>
      <h2 className='mt-3 text-center font-semibold text-headingColor'>Before you start</h2>
      <p className='mt-1 text-center text-sm text-gray-500'>How the AI health assistant handles your information</p>

      <ul className='mt-4 space-y-3'>
        {points.map(({ icon: Icon, text }) => (
          <li key={text} className='flex gap-3 rounded-xl border border-violet-100 bg-white p-3 text-[13px] leading-5 text-gray-700'>
            <Icon size={16} className='mt-0.5 shrink-0 text-violet-600' aria-hidden />
            <span>{text}</span>
          </li>
        ))}
      </ul>

      <div className='mt-5 flex gap-2'>
        <button
          type='button'
          onClick={onDecline}
          className='flex-1 cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50'
        >
          Not now
        </button>
        <button
          type='button'
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onAccept();
            } finally {
              setBusy(false);
            }
          }}
          className='flex-[1.4] cursor-pointer rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60'
        >
          {busy ? 'Saving…' : 'I understand, continue'}
        </button>
      </div>
    </div>
  );
};

export default AiChatConsent;
