'use client';
import { questionContent } from '@/types/doctors.ds';
import { useId, useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

/**
 * One FAQ entry: an accordion following the WAI-ARIA pattern. The whole question row
 * is a real button (reachable by keyboard, announced as expanded or collapsed) inside
 * a heading, so screen-reader users can jump between questions.
 */
const FaqItem = ({ item }: { item: questionContent }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const panelId = useId();

  return (
    <li className='p-3 lg:p-5 rounded-[12px] border border-solid border-[#D9DCE2] mb-5'>
      <h3>
        <button
          type='button'
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((prev) => !prev)}
          className='flex w-full items-center justify-between gap-5 text-left cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primaryColor'
        >
          <span className='text-[16px] leading-4 lg:text-[20px] lg:leading-5 text-headingColor'>{item.question}</span>
          <span
            aria-hidden
            className={`${
              isOpen ? 'bg-primaryColor text-white border-transparent' : 'border-[#141F21]'
            } w-7 h-7 lg:w-8 lg:h-8 shrink-0 border border-solid rounded flex items-center justify-center`}
          >
            {isOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
          </span>
        </button>
      </h3>
      <div id={panelId} hidden={!isOpen} className='mt-4'>
        <p className=' text-[14px] leading-6 lg:text-[16px] lg:leading-8 font-[400] text-textColor pl-[10px] border-l-2 border-l-slate-400 '>
          {item.content}
        </p>
      </div>
    </li>
  );
};

export default FaqItem;
