import { ReactNode } from 'react';


export interface doctorsInterface {
    id: string;
    name: string;
    specialization: string;
    avgRating: number;
    totalRating: number;
    photo: string;
    totalPatients: number;
    hospital: string;
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
    id: number;
    name: string;
    comment: string;
    photo: string; // URL or local path to image
    ratings: number; // 1 to 5
};

export interface SignupInterface {
    email: string;
    password: string,
    name: string
    role: string;
    photo: File;
    gender: string;

}