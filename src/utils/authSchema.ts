import z from 'zod'

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

const loginSchema = z.object({
    email: z.string().email('invalid email address'),
    password: z.string().min(8, 'password length too short'),
}).required()

type registrationType = z.infer<typeof registrationSchema>
type loginType = z.infer<typeof loginSchema>
export { registrationSchema, registrationType, loginSchema, loginType }