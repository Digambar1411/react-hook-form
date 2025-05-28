import { z } from 'zod';

export const formSchema = z.object({
  username:z.string({required_error:'username is required'}),
  email:z.string({required_error:'email is required'}).email('email is not valid'),
  address:z.object({
    street:z.string({required_error:'street is required'}),
    city:z.string({required_error:'city is required'}),
  }),
  phNumbers:z.array(z.object({number:z.string({required_error: 'number is required'})})),
  age:z.number().min(1,'age is required').max(100,'age must be less than 100'),
  dob:z.date(),
  workTypes:z.array(z.enum(['part-time', 'full-time','hybrid'],{required_error:"work type is required"})).min(1,'At leas work type is required'),
  resourceType:z.enum(['Contractor', 'Direct Hire'],{required_error:'Resource type is required'})
})


export type addFormSchemaType = z.infer<typeof formSchema>