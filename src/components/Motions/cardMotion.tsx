import { m } from 'framer-motion';

const CardMotion = ({
  children,
  styling,
}: {
  children: React.ReactNode;
  styling: string;
}) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
      whileTap={{ scale: 0.98 }}
      className={`${styling} cursor-pointer`}
    >
      {children}
    </m.div>
  );
};

export default CardMotion;
