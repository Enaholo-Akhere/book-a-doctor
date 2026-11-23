import ehizogieImgAsset from '@/assets/images/ehizogie.png';
import sarahImgAsset from '@/assets/images/sarah-thompson.jpg';
import emilyImgAsset from '@/assets/images/emily.jpg';
import graceImgAsset from '@/assets/images/grace.jpg';
import jamesImgAsset from '@/assets/images/james.jpg';
import danielImgAsset from '@/assets/images/daniel.jpg';

const ehizogieImg: string = ehizogieImgAsset.src;
const sarahImg: string = sarahImgAsset.src;
const emilyImg: string = emilyImgAsset.src;
const graceImg: string = graceImgAsset.src;
const jamesImg: string = jamesImgAsset.src;
const danielImg: string = danielImgAsset.src;

export interface StaticReview {
    id: number;
    name: string;
    comment: string;
    photo: string;
    ratings: number;
}

export const Reviews: StaticReview[] = [

    {
        id: 6,
        name: 'Daniel Ehimare',
        comment: 'I received exceptional treatment and support. I trust them completely with my health.',
        photo: danielImg,
        ratings: 5,
    }, {
        id: 1,
        name: 'Sarah Thompson',
        comment: 'The doctors were incredibly kind and attentive. I felt truly cared for during every visit.',
        photo: sarahImg,
        ratings: 5,
    },
    {
        id: 3,
        name: 'Emily Chen',
        comment: 'Warm and welcoming environment. I always leave feeling better and more informed.',
        photo: emilyImg,
        ratings: 4,
    },
    {
        id: 2,
        name: 'Ehizogie Omonye',
        comment: 'Excellent service! The team was professional and explained everything clearly.',
        photo: ehizogieImg,
        ratings: 5,
    },
    {
        id: 4,
        name: 'James Rodrigo',
        comment: 'Quick appointment scheduling and great follow-up. Highly recommend!',
        photo: jamesImg,
        ratings: 5,
    },
    {
        id: 5,
        name: 'Grace Williams',
        comment: 'They took the time to listen and really understand my concerns. Amazing care.',
        photo: graceImg,
        ratings: 5,
    },
];
