import ContactComp from '@/components/Contact';
import { usePageTitle } from '@/Hook/title';

const Contact = () => {
  usePageTitle('Contact - CareConnect');

  return (
    <section>
      <ContactComp />
    </section>
  );
};

export default Contact;
