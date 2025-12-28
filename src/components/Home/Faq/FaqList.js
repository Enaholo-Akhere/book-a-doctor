import { jsx as _jsx } from "react/jsx-runtime";
import { faqs } from '@/assets/data/faqs';
import FaqItem from './FaqItem';
const FaqList = () => {
    return (_jsx("ul", { className: 'mt-[30px]', children: faqs.map((item, index) => (_jsx(FaqItem, { item: item }, index))) }));
};
export default FaqList;
