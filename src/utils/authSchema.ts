import z from 'zod';

const registrationSchema = z.object({
    name: z.string().max(30, 'character limit exceeded').min(3, 'name too short'),
    email: z.email('invalid email address'),
    password: z.string().min(8, 'password length too short'),
    role: z.enum(['patient', 'doctor'], 'role is required'),
    phone: z.string().min(11, 'invalid phone number').max(15, 'invalid phone number'),
    gender: z.enum(['male', 'female', 'others']),
    photo: z
        .any()
}).required()


const editRegistrationSchema = z.object({
    name: z.string().max(30, 'character limit exceeded').min(3, 'name too short'),
    email: z.email('invalid email address'),
    phone: z.string().min(11, 'invalid phone number').max(15, 'invalid phone number'),
    gender: z.enum(['male', 'female', 'others']),
    bloodType: z.string().max(3, 'invalid blood type').min(2, 'invalid blood type'),
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
    name: z.string().max(30, 'character limit exceeded').min(3, 'name too short'),
    email: z.string().email('invalid email address'),
    phone: z.string().regex(/^\+?[0-9]{10,}$/, 'Phone number must have at least 10 digits'),
    gender: z.enum(['male', 'female', 'others']),
    bio: z.string().min(1, 'Bio is required').max(100),
    specialization: z.string().max(50, 'exceeded max character limit').min(3, 'specialization too short'),
    ticketPrice: z.string().min(1, 'Ticket price must be at least 1'),
    about: z.string().min(10, 'About is required').max(500, 'exceeded max character limit'),
    qualifications: z.array(
        z.object({
            startDate: z.string().min(1, 'Start date is required'),
            endDate: z.string().min(1, 'End date is required'),
            degree: z.string().min(1, 'Degree is required'),
            university: z.string().min(1, 'University is required'),
        })
    ),
    timeSlots: z.array(
        z.object({
            startingTime: z.string().min(1, 'Starting time is required'),
            endingTime: z.string().min(1, 'Ending time is required'),
            day: z.string().min(1, 'Day is required'),
        })
    ),
    experiences: z.array(
        z.object({
            startDate: z.string().min(1, 'Start date is required'),
            endDate: z.string().min(1, 'End date is required'),
            position: z.string().min(1, 'Position is required'),
            hospital: z.string().min(1, 'Hospital is required'),
        })
    ),
    photo: z
        .any().optional()
})


const loginSchema = z.object({
    email: z.string().email('invalid email address'),
    password: z.string().min(8, 'password length too short'),
}).required()

type registrationType = z.infer<typeof registrationSchema>
type editRegistrationType = z.infer<typeof editRegistrationSchema>
type loginType = z.infer<typeof loginSchema>
type editDoctorType = z.infer<typeof editDoctorSchema>
type feedbackType = z.infer<typeof feedbackSchema>
export { feedbackSchema, feedbackType, registrationSchema, registrationType, loginSchema, loginType, editRegistrationSchema, editRegistrationType, editDoctorSchema, editDoctorType }