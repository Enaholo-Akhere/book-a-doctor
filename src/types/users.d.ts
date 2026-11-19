import { appointments } from '@/types/doctors.ds';

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type Genotype = 'AA' | 'AS' | 'AC' | 'SS' | 'SC' | 'CC';

export interface EmergencyContact {
    name?: string;
    relationship?: string;
    phone?: string;
}

export interface user {
    name: string;
    email: string;
    photo: { imageUrl: string; publicId: string };
    bloodType: string;
    phone: string;
    gender: string;
    role: string;
    _id: string;
    verified?: boolean;
    createdAt?: string;
    dateOfBirth?: string;
    address?: string;
    heightCm?: number;
    weightKg?: number;
    genotype?: Genotype;
    allergies?: string[];
    chronicConditions?: string[];
    medications?: string[];
    emergencyContact?: EmergencyContact;
    appointments: appointments[];
}

/** Body of PATCH /users/me/health. Empty string / null clears a field. */
export interface HealthProfileInput {
    dateOfBirth?: string;
    address?: string;
    heightCm?: number | null;
    weightKg?: number | null;
    bloodType?: BloodType;
    genotype?: Genotype | '';
    allergies?: string[];
    chronicConditions?: string[];
    medications?: string[];
    emergencyContact?: EmergencyContact;
}
