import { ReactNode } from 'react';


interface qualifications {
    degree: string;
    startDate: Date;
    endDate: Date;
    university: string;
    _id: string;
}
interface experiences {
    position: string;
    startDate: Date;
    endDate: Date;
    hospital: string;
    _id: string;

}

interface timeSlot {
    startingTime: Date;
    endingTime: Date;
    day: string;
    _id: string;
}

interface doctor {
    name: string;
    photo: { imageUrl: string };
    specialization: string;
    averageRating: number;
    totalRating?: number;
    hospital?: string;
    _id: string;
    timeSlots: timeSlot[];

}

export interface paymentDetailInterface {
    baseAmount: number;
    baseCurrency: string;
    customerCurrency: string;
    exchangeRate: number;
    ipAddress: string;
    amountPaid: number
}
/** Patient as populated on a booking. Health fields are only sent to the patient's own doctor. */
export interface AppointmentPatient {
    _id: string;
    name: string;
    email: string;
    photo: { imageUrl: string };
    phone?: string;
    gender?: string;
    bloodType?: string;
    genotype?: string;
    dateOfBirth?: string;
    heightCm?: number;
    weightKg?: number;
    allergies?: string[];
    chronicConditions?: string[];
    medications?: string[];
}

export interface appointments {
    ticketPrice: string;
    createdAt: string;
    updatedAt: string;
    user: AppointmentPatient;
    doctor: doctor;
    isPaid: boolean;
    photo: { imageUrl: string };
    _id: string;
    status: 'approved' | 'pending' | 'cancelled';
    paymentPlatform: string;
    paymentDetail: paymentDetailInterface

}
export interface doctorsInterface {
    _id: string;
    /** Readable profile URL segment, e.g. "ada-obi-cardiologist". Missing on older backends. */
    slug?: string;
    name: string;
    specialization: string;
    averageRating: number;
    totalRating: number;
    photo: { imageUrl: string, publicId: string };
    totalPatients: number | null;
    hospital: string;
    isApproved: 'approved' | 'pending' | 'cancelled';
    gender: 'male' | 'female' | 'other';
    bio: string;
    about: string;
    phone: string;
    email: string;
    ticketPrice: number;
    appointments: appointments[];
    qualifications: qualifications[];
    experiences: experiences[];
    timeSlots: timeSlot[];
    reviews: ReviewInterface[];
    verified?: boolean;
    createdAt?: string;
}

export interface questionContent {
    question: string;
    content: string
}


export interface SocialLinkInterface {
    path: string,
    icon: ReactNode
}

export interface QuickLinkInterface {
    path: string;
    display: string;
}

export interface ReviewInterface {
    doctor: string;
    user: {
        name: string;
        photo: {
            imageUrl: string;
        };
    };
    reviewText: string;
    rating: number;
    createdAt: string;
    _id: string;
};

export interface SignupInterface {
    email: string;
    password: string,
    name: string
    role: string;
    photo?: string;
    gender: string;
    phone: string;
}