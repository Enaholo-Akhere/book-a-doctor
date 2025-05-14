import { doctorsInterface } from "@/types/doctors.ds";
import doctorImg01 from '@/assets/images/nigeria-doctor.png'
import doctorImg02 from '@/assets/images/us-doctor-2.jpg'
import femaleDocImg from '@/assets/images/uae-doctor.jpg'

export const doctors: doctorsInterface[] = [
  {
    id: "01",
    name: "Dr. Akhere Oaikhena ",
    specialization: "Surgeon",
    avgRating: 4.8,
    totalRating: 562,
    photo: doctorImg01,
    totalPatients: 3200,
    hospital: "Lilly Hospital, Nigeria.",
  },
  {
    id: "02",
    name: "Dr. Smith Wimbledon",
    specialization: "Neurologist",
    avgRating: 4.9,
    totalRating: 908,
    photo: doctorImg02,
    totalPatients: 5981,
    hospital: "Mason Hospital, Ohio.",
  },
  {
    id: "03",
    name: "Dr. Farid Hassana",
    specialization: "Dermatologist",
    avgRating: 4.7,
    totalRating: 412,
    photo: femaleDocImg,
    totalPatients: 2461,
    hospital: "Doha Hospital,  UAE.",
  },
];
