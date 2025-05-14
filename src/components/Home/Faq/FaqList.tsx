import { faqs } from '@/assets/data/faqs';
import FaqItem from './FaqItem';
import { questionContent } from '@/types/doctors.ds';

const FaqList = () => {
  return (
    <ul className='mt-[30px]'>
      {faqs.map((item: questionContent, index: number) => (
        <FaqItem item={item} key={index} />
      ))}
    </ul>
  );
};

export default FaqList;
