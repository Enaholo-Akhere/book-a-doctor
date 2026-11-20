import { forwardRef } from 'react';
import { Sparkles } from 'lucide-react';

/** Bottom-left so it never collides with the real-time Messages button (bottom-right). */
const AiChatLauncher = forwardRef<HTMLButtonElement, { onClick: () => void }>(({ onClick }, ref) => (
  <button
    ref={ref}
    type='button'
    onClick={onClick}
    aria-label='Open AI health assistant'
    className='fixed bottom-5 left-5 z-[90] flex h-14 cursor-pointer items-center gap-2 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 pl-4 pr-4 text-white shadow-lg shadow-violet-600/30 transition hover:brightness-110 active:scale-95 sm:pr-5'
  >
    <Sparkles size={20} />
    <span className='hidden text-sm font-semibold sm:inline'>Ask AI</span>
  </button>
));

AiChatLauncher.displayName = 'AiChatLauncher';

export default AiChatLauncher;
