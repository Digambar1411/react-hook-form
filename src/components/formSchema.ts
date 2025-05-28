import { z } from 'zod';

export const formSchema = z.object({
  username: z
    .string()
    .nonempty('username cannot be empty')
    .min(3, 'username must be at least 3 characters long')
    .max(20, 'username must be less than 20 characters long'),
  email: z
    .string()
    .nonempty('email is required')
    .email('email is not valid'),
  address: z
    .object({
      city: z
        .string({ required_error: 'city is required' }),
      street: z
        .string({ required_error: 'street is required' }),
    }),
  age: z
    .number()
    .min(1, 'age is required')
    .max(100, 'age must be less than 100'),
  dob: z.date(),
  workTypes: z
    .array(z
      .enum(['part-time', 'full-time', 'hybrid'], { required_error: "work type is required" })),
  resourceType: z.enum(['Contractor', 'Direct Hire'], { required_error: 'Resource type is required' })
})


export type addFormSchemaType = z.infer<typeof formSchema>