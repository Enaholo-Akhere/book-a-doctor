import z from 'zod';

const registrationSchema = z.object({
    name: z.string().max(30, 'character limit exceeded').min(3, 'name too short'),
    email: z.email('invalid email address'),
    password: z.string().min(8, 'password length too short'),
    role: z.enum(['patient', 'doctor'], 'role is required'),
    phone: z.string().min(11, 'invalid phone number').max(15, 'invalid phone number'),
    gender: z.enum(['male', 'female', 'other']),
    photo: z
        .any()
}).required()


const editRegistrationSchema = z.object({
    name: z.string().trim().max(50, 'Name must be under 50 characters').min(3, 'Name is too short'),
    email: z.email('invalid email address'),
    phone: z.string().regex(/^\+[1-9][0-9]{7,14}$/, 'Use international format, e.g. +2349012345678'),
    gender: z.enum(['male', 'female', 'other'], { message: 'Select a gender' }),
    photo: z
        .any().optional()
})

const feedbackSchema = z.object({
    rating: z
        .number()
        .min(1, 'Please select a rating')
        .max(5, 'Rating cannot exceed 5'),
    reviewText: z
        .string()
        .min(5, 'Review is too short')
        .max(500, 'Review exceeded max character limit'),
});


const editDoctorSchema = z.object({
    name: z.string().trim().max(50, 'Name must be under 50 characters').min(3, 'Name is too short'),
    email: z.string().email('invalid email address'),
    phone: z.string().regex(/^\+[1-9][0-9]{7,14}$/, 'Use international format, e.g. +2349012345678'),
    gender: z.enum(['male', 'female', 'other'], { message: 'Select a gender' }),
    bio: z.string().trim().min(1, 'Add a short headline').max(50, 'Keep the headline under 50 characters'),
    specialization: z.string().max(50, 'exceeded max character limit').min(3, 'specialization too short'),
    ticketPrice: z.string().refine((v) => Number(v) > 0, 'Enter a consultation fee above 0'),
    about: z.string().trim().min(10, 'Tell patients a little more about you').max(1500, 'Keep this under 1500 characters'),
    qualifications: z.array(
        z.object({
            startDate: z.string().min(1, 'Start date is required'),
            endDate: z.string().min(1, 'End date is required'),
            degree: z.string().min(1, 'Degree is required'),
            university: z.string().min(1, 'University is required'),
        }).refine(
            (data) => new Date(data.startDate) <= new Date(data.endDate),
            {
                message: 'Start date cannot be after end date',
                path: ['startDate'],
            }
        )
    ),
    timeSlots: z.array(
        z.object({
            startingTime: z.string().min(1, 'Starting time is required'),
            endingTime: z.string().min(1, 'Ending time is required'),
            day: z.string().min(1, 'Day is required'),
        }).refine(
            (data) => {
                const [startHour, startMin] = data.startingTime.split(':').map(Number);
                const [endHour, endMin] = data.endingTime.split(':').map(Number);
                return startHour * 60 + startMin < endHour * 60 + endMin;
            },
            {
                message: 'Starting time must be before ending time',
                path: ['startingTime'],
            }
        )
    ),
    experiences: z.array(
        z.object({
            startDate: z.string().min(1, 'Start date is required'),
            endDate: z.string().min(1, 'End date is required'),
            position: z.string().min(1, 'Position is required'),
            hospital: z.string().min(1, 'Hospital is required'),
        }).refine(
            (data) => new Date(data.startDate) <= new Date(data.endDate),
            {
                message: 'Start date cannot be after end date',
                path: ['startDate'],
            }
        )
    ),
    photo: z
        .any().optional()
})


const loginSchema = z.object({
    email: z.string().email('invalid email address'),
    password: z.string().min(8, 'password length too short'),
}).required()

const setNewPasswordSchema = z.object({
    password: z.string().min(8, 'password length too short'),
    confirmPassword: z.string().min(8, 'password length too short'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})

const forgotPasswordSchema = z.object({
    email: z.string().email('invalid email address'),
}).required()

export type setNewPasswordType = z.infer<typeof setNewPasswordSchema>
export type forgotPasswordType = z.infer<typeof forgotPasswordSchema>
export type registrationType = z.infer<typeof registrationSchema>
export type editRegistrationType = z.infer<typeof editRegistrationSchema>
export type loginType = z.infer<typeof loginSchema>
export type editDoctorType = z.infer<typeof editDoctorSchema>
export type feedbackType = z.infer<typeof feedbackSchema>

export { setNewPasswordSchema, feedbackSchema, registrationSchema, loginSchema, editRegistrationSchema, editDoctorSchema, forgotPasswordSchema }