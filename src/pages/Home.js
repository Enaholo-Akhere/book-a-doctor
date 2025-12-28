import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import About from '../components/Home/about/About';
import Hero from '@/components/Home/Hero/Hero';
import GetInTouch from '@/components/Home/GetInTouch/GetInTouch';
import Feature from '@/components/Home/Feature/Feature';
import Faq from '@/components/Home/Faq';
import Services from '../components/Services';
import DoctorsHome from '../components/Doctors';
import Testimonial from '../components/Testimonial';
const Home = () => {
    return (_jsxs(_Fragment, { children: [_jsx(Hero, {}), _jsx(GetInTouch, {}), _jsx(About, {}), _jsx(Services, { subtitle: ' From routine check-ups to specialized treatments, our medical\r\n            services are designed to meet your unique health needs.', title: 'Our medical services ' }), _jsx(Feature, {}), _jsx(DoctorsHome, { subtitle: ' Our team of compassionate, skilled doctors is here to provide\r\n            personalized, top-quality care every step of the way.', title: 'Our great doctors' }), _jsx(Faq, {}), _jsx(Testimonial, {})] }));
};
export default Home;
