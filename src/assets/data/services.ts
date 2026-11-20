import {
  Apple,
  Baby,
  Brain,
  ClipboardCheck,
  FileText,
  FlaskConical,
  HandHeart,
  HeartPulse,
  Mars,
  MessagesSquare,
  Pill,
  Plane,
  ScanFace,
  ShieldPlus,
  Sparkles,
  Stethoscope,
  UserRoundSearch,
  Venus,
  type LucideIcon,
} from 'lucide-react';

export type ServiceCategory = 'ai' | 'general' | 'specialist' | 'wellbeing' | 'support';

export interface Service {
  id: string;
  name: string;
  /** One or two sentences: what it is and who it's for. */
  desc: string;
  /** What a patient can actually get from it online. */
  includes: string[];
  category: ServiceCategory;
  icon: LucideIcon;
  /** Shown on the home page. */
  featured?: boolean;
  /** 'ai' opens the AI assistant; otherwise a route. */
  cta: { label: string; to: string | 'ai' };
  /** Accent (from the brand palette). */
  color: string;
}

export const SERVICE_CATEGORIES: { key: ServiceCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All services' },
  { key: 'general', label: 'Everyday care' },
  { key: 'specialist', label: 'Specialists' },
  { key: 'wellbeing', label: 'Mind & lifestyle' },
  { key: 'support', label: 'Reports & follow-up' },
  { key: 'ai', label: 'AI assistant' },
];

const BOOK = { label: 'Book a consultation', to: '/doctors' };

export const services: Service[] = [
  {
    id: 'ai-assistant',
    name: 'AI Health Assistant',
    desc: 'Get instant, general answers to health questions any time of day, on symptoms, medicines, nutrition, sleep and mental wellbeing, drawn from trusted medical references. It is an AI, not a doctor, and it will tell you when to see one.',
    includes: [
      'Free: 3 answered questions a day, unlimited with an active booking',
      'Answers grounded in MedlinePlus (U.S. National Library of Medicine)',
      'Suggests the right kind of doctor and links you to book',
    ],
    category: 'ai',
    icon: Sparkles,
    featured: true,
    cta: { label: 'Ask the AI assistant', to: 'ai' },
    color: '#9771FF',
  },
  {
    id: 'gp-consultation',
    name: 'General Practice Consultation',
    desc: 'A video, voice or chat appointment with a licensed doctor for everyday health problems, without the waiting room. Ideal for new symptoms you want checked and advice on what to do next.',
    includes: [
      'Colds, flu, sore throat, cough, fever and sinus problems',
      'Urinary symptoms, stomach upsets, minor infections and allergies',
      'Treatment advice and, where regulations allow, a prescription',
    ],
    category: 'general',
    icon: Stethoscope,
    featured: true,
    cta: BOOK,
    color: '#0D8C81',
  },
  {
    id: 'chronic-care',
    name: 'Chronic Condition Management',
    desc: 'Ongoing check-ins for long-term conditions so you stay on track between clinic visits. Share your home readings and symptoms and agree a plan with your doctor.',
    includes: [
      'High blood pressure, diabetes, asthma, thyroid and cholesterol',
      'Review of home readings (blood pressure, glucose, peak flow)',
      'Medication adjustments, lifestyle plan and when to be seen in person',
    ],
    category: 'general',
    icon: ClipboardCheck,
    cta: BOOK,
    color: '#01B5C5',
  },
  {
    id: 'older-adults',
    name: 'Older Adults & Caregiver Support',
    desc: 'Care that fits around older patients and the family members who look after them. Join a call together from different places if that helps.',
    includes: [
      'Managing several conditions and medicines safely',
      'Memory concerns, falls risk and mobility advice',
      'Guidance and support for carers',
    ],
    category: 'general',
    icon: HandHeart,
    cta: BOOK,
    color: '#FEB60D',
  },
  {
    id: 'mental-health',
    name: 'Mental Health & Counselling',
    desc: 'Private sessions with qualified mental health professionals from wherever you feel comfortable. Talk through what you are going through and get practical support and a plan.',
    includes: [
      'Anxiety, low mood, stress, burnout, grief and sleep problems',
      'Talking therapy and coping strategies',
      'Assessment and referral for further care when needed',
    ],
    category: 'wellbeing',
    icon: Brain,
    featured: true,
    cta: BOOK,
    color: '#9771FF',
  },
  {
    id: 'womens-health',
    name: "Women's & Reproductive Health",
    desc: "Confidential advice on women's health at every life stage, with doctors who take time to listen.",
    includes: [
      'Period problems, contraception advice and PCOS',
      'Pregnancy questions, preconception and postnatal check-ins',
      'Menopause symptoms and treatment options',
    ],
    category: 'specialist',
    icon: Venus,
    featured: true,
    cta: BOOK,
    color: '#FEB60D',
  },
  {
    id: 'child-health',
    name: 'Child Health (Paediatrics)',
    desc: "Guidance from doctors experienced with babies, children and teenagers, with a parent or guardian on the call. Get reassurance or a clear next step when your child is unwell.",
    includes: [
      'Fevers, rashes, coughs, tummy upsets and ear pain',
      'Feeding, sleep, growth and development questions',
      'Advice on when your child needs to be seen in person',
    ],
    category: 'specialist',
    icon: Baby,
    featured: true,
    cta: BOOK,
    color: '#01B5C5',
  },
  {
    id: 'mens-health',
    name: "Men's Health",
    desc: 'Straightforward, confidential consultations on the health issues men often put off.',
    includes: [
      'Urinary and prostate symptoms, and when to get checked',
      'Hair loss, erectile dysfunction and low energy',
      'Heart-risk, weight and lifestyle check-ins',
    ],
    category: 'specialist',
    icon: Mars,
    cta: BOOK,
    color: '#01B5C5',
  },
  {
    id: 'dermatology',
    name: 'Skin, Hair & Nails (Dermatology)',
    desc: 'Many skin conditions can be assessed from clear photos and a video call. Show your doctor what you are dealing with and get a treatment plan.',
    includes: [
      'Acne, eczema, psoriasis, fungal infections and rashes',
      'Hair loss and nail problems',
      'Mole and skin-change checks, with referral if it needs a closer look',
    ],
    category: 'specialist',
    icon: ScanFace,
    cta: BOOK,
    color: '#FEB60D',
  },
  {
    id: 'heart-health',
    name: 'Heart Health Review',
    desc: 'A cardiology-focused review of your heart risk and existing test results, for people with blood pressure, cholesterol or heart concerns that are not an emergency.',
    includes: [
      'Blood pressure and cholesterol results explained',
      'Review of ECG, echo or other heart test reports',
      'Personal risk assessment and prevention plan',
    ],
    category: 'specialist',
    icon: HeartPulse,
    cta: BOOK,
    color: '#0D8C81',
  },
  {
    id: 'sexual-health',
    name: 'Sexual Health',
    desc: 'Discreet, judgement-free consultations about sexual health and wellbeing.',
    includes: [
      'Advice on STI symptoms, testing and treatment',
      'Contraception and emergency contraception guidance',
      'Erectile dysfunction and other sexual health concerns',
    ],
    category: 'specialist',
    icon: ShieldPlus,
    cta: BOOK,
    color: '#9771FF',
  },
  {
    id: 'lab-results',
    name: 'Lab Results & Report Review',
    desc: 'Already have test results or a scan report but no one to explain them? A doctor will go through them with you in plain language and tell you what, if anything, to do next.',
    includes: [
      'Blood tests: full blood count, malaria, kidney, liver, thyroid, HbA1c',
      'Urine tests and imaging reports (X-ray, ultrasound, CT, MRI)',
      'Follow-up tests or referrals if something needs attention',
    ],
    category: 'support',
    icon: FlaskConical,
    featured: true,
    cta: BOOK,
    color: '#01B5C5',
  },
  {
    id: 'medication-review',
    name: 'Medication Review',
    desc: 'Taking several medicines, or not sure yours are working? Get a doctor to review everything you take.',
    includes: [
      'Side effects and possible interactions',
      'Whether doses and timing still suit you',
      'Clear advice on what to continue, change or discuss with your pharmacist',
    ],
    category: 'support',
    icon: Pill,
    cta: BOOK,
    color: '#0D8C81',
  },
  {
    id: 'second-opinion',
    name: 'Second Opinion',
    desc: 'Get an independent view on a diagnosis or treatment plan from another doctor before you make a big decision.',
    includes: [
      'Review of your existing diagnosis, reports and plan',
      'Questions to ask your treating team',
      'Alternative options explained, where they exist',
    ],
    category: 'support',
    icon: UserRoundSearch,
    cta: BOOK,
    color: '#9771FF',
  },
  {
    id: 'referrals-notes',
    name: 'Referrals & Medical Notes',
    desc: 'When you need in-person care or paperwork, your doctor can help after a consultation, where clinically appropriate.',
    includes: [
      'Referral letters to specialists, labs and hospitals',
      'Sick notes and fitness-to-work or school notes',
      'Summaries of your consultation for your records',
    ],
    category: 'support',
    icon: FileText,
    cta: BOOK,
    color: '#FEB60D',
  },
  {
    id: 'nutrition',
    name: 'Nutrition & Weight Management',
    desc: 'Practical, realistic guidance on eating well and reaching a healthy weight, tailored to your health conditions and lifestyle.',
    includes: [
      'Healthy weight loss or gain plans',
      'Eating for diabetes, blood pressure and cholesterol',
      'Pregnancy, child and sports nutrition advice',
    ],
    category: 'wellbeing',
    icon: Apple,
    cta: BOOK,
    color: '#0D8C81',
  },
  {
    id: 'travel-health',
    name: 'Travel Health Advice',
    desc: 'Plan ahead for a healthy trip with advice tailored to where you are going and your medical history.',
    includes: [
      'Vaccines and malaria prevention for your destination',
      'Managing chronic conditions and medicines while travelling',
      'What to do if you get ill abroad',
    ],
    category: 'wellbeing',
    icon: Plane,
    cta: BOOK,
    color: '#01B5C5',
  },
  {
    id: 'follow-up-messaging',
    name: 'Follow-up Chat & Calls',
    desc: 'Stay in touch with the doctor you booked through secure in-app messaging and voice or video calls, so questions after your appointment do not go unanswered.',
    includes: [
      'Secure messaging with your doctor, including photos and files',
      'Voice and video calls inside CareConnect',
      'Updates on how you are responding to treatment',
    ],
    category: 'support',
    icon: MessagesSquare,
    cta: BOOK,
    color: '#9771FF',
  },
];

/** Honest limits of online care, shown on the services page. */
export const IN_PERSON_ONLY = [
  'Emergencies: chest pain, difficulty breathing, stroke signs, severe bleeding or injuries, and burns',
  'Physical examinations, procedures and surgery',
  'Labour and delivery, and pregnancy emergencies',
  'Scans, X-rays and blood draws (we can review the results)',
  'Cancer treatment such as chemotherapy or radiotherapy',
];
