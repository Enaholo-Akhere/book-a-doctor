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

export interface appointments {
    ticketPrice: string;
    createdAt: string;
    user: { gender: string; name: string; email: string };
    isPaid: boolean;
    photo: { imageUrl: string };
    _id: string;
}
export interface doctorsInterface {
    _id: string;
    name: string;
    specialization: string;
    averageRating: number;
    totalRating: number;
    photo: { imageUrl: string, publicId: string };
    totalPatients: number | null;
    hospital: string;
    isApproved: 'approved' | 'pending';
    gender: 'male' | 'female' | 'others';
    bio: string;
    about: string;
    phone: string;
    email: string;
    ticketPrice: string;
    appointments: appointments[];
    qualifications: qualifications[];
    experiences: experiences[];
    timeSlots: timeSlot[];
    reviews: ReviewInterface[]
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