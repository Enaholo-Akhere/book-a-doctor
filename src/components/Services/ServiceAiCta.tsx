'use client';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { openAiChat } from '@/components/AiChat/openAiChat';

/**
 * The AI assistant card's call to action. A client component because it opens the chat
 * and depends on who's signed in; the rest of ServiceCard is rendered on the server.
 */
const ServiceAiCta = ({
  label,
  className,
  unavailableClassName,
  arrow,
}: {
  label: string;
  className: string;
  unavailableClassName: string;
  arrow: 'right' | 'up-right';
}) => {
  const role = useAuthStore((s) => s.user?.role);

  // The AI assistant is for patients and guests only.
  if (role === 'doctor') return <span className={unavailableClassName}>Available to patients</span>;

  const Arrow = arrow === 'right' ? ArrowRight : ArrowUpRight;
  return (
    <button type='button' onClick={openAiChat} className={className}>
      {label} <Arrow size={16} />
    </button>
  );
};

export default ServiceAiCta;
