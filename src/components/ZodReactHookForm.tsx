import { DevTool } from '@hookform/devtools';
import { useFieldArray, useForm, type FieldErrors , } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

let render = 0;

const schema = z.object({
  username:z.string().nonempty('username is required'),
  email:z.string().nonempty('email is required').email('email is not valid'),
  address:z.object({
    street:z.string().nonempty('street is required'),
    city:z.string().nonempty('city is required'),
  }),
  phNumbers:z.array(z.object({number:z.string().nonempty('number is required')})),
  age:z.number().min(1,'age is required').max(100,'age must be less than 100'),
  dob:z.date()
})

type SampleFormType = {
  username:string;
  email: string;
  address:{
    street:string;
    city:string;
  }
  phNumbers:{
    number:string
  }[];
  age:number;
  dob:Date;
}

const ZodReactHookForm = () => {

  const form = useForm<SampleFormType>({
    defaultValues:{
      username:'',
      email:'', 
      address:{
        street:'',
        city:''
      },
      phNumbers:[{number:''}],
      age:0,
      dob:new Date(),
    },
    resolver:zodResolver(schema),
  });

  const {register, control, handleSubmit, getValues, setValue,watch,reset, formState:{isDirty, touchedFields, dirtyFields, isSubmitted, isValid, errors, isSubmitSuccessful, isSubmitting}}= form

  const {fields, append, remove} = useFieldArray({
    name:'phNumbers',
    control,
  })

  const watchedFields = watch('username');

  const submitForm = (data: SampleFormType) => {
    console.log(data);
    reset(); //clear fields post submit
  }

  const onError = (erros:FieldErrors<SampleFormType>)=>{
    console.log('onError:',erros);
  }

  const getValuesHandler = () => {
    console.log(getValues('username'));
  }

  const setValueHandler = () => {
    setValue('username','admin');
  }

  const handleDiscard=()=>{
    isDirty
    ? alert('You have unsaved changes') 
    : console.log('No unsaved changes form closed');
  }

  console.log({touchedFields,dirtyFields,isDirty,isValid});
  console.log({isSubmitted, isSubmitting, isSubmitSuccessful});


  render++;

  return (
		<>
			<form onSubmit={handleSubmit(submitForm, onError)} noValidate>
				<h1>Reack Hook Form, renderCount:({render / 2})</h1>
        <button type="button"onClick={handleDiscard} >close form</button>
        <p>username: {JSON.stringify(watchedFields)}</p>

				<div className="section">
					<label htmlFor="username">Username</label>
					<input
						type="text"
						placeholder="username"
						{...register("username", {
							validate: (value) =>
								value !== "admin" || "This username is not allowed",
							required: "username is required",
              minLength:{
                value:3,
                message:'username must be at least 3 characters'
              }
						})}
					/>
					{errors.username && (
						<p className="error">{errors.username?.message}</p>
					)}
				</div>

				<div className="section">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						{...register("email", {
							pattern: {
								value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
								message: "Email is not valid",
							},
							validate: {
								notAdmin: (value) =>
									value !== "admin@gmail.com" || " This email is not allowed",
								notBlockListedDomain: (value) =>
									!value.endsWith("tcs.com") || "This domain is not allowed",
								isSameOrg: (value) =>
									value.endsWith(".biz") || "Domain does not  match",
                emailAvailable: async (value) =>{
                  const res = await fetch(`https://jsonplaceholder.typicode.com/users?email=${value}`);
                  const data = await res.json();
                  return data.length === 0 || 'Email alreday exists'
                }
							},
							required: "email is required",
						})}
					/>
					{errors.email && <p className="error">{errors.email?.message}</p>}
				</div>

        <div className="section">
					<label htmlFor="city">City</label>
					<input
						type="text"
						id="city"
						{...register("address.city", { required: "city is required" })}
					/>
					{errors.address?.city && (
						<p className="error">{errors.address.city?.message}</p>
					)}
				</div>

				<div className="section">
					<label htmlFor="street">Street</label>
					<input
						type="text"
						id="street"
						{...register("address.street", {
							required: "street address is required",
              disabled:watch('address.city') === ''
						})}
					/>
					{errors.address?.street && (
						<p className="error">{errors.address.street?.message}</p>
					)}
				</div>

				<div className="section">
					<label htmlFor="phone-numbers">Other Phone Numbers</label>
					<div>
						{fields.map((field, index) => {
							return (
								<div key={field.id}>
									<input
										type="text"
										{...register(`phNumbers.${index}.number` as const, {required:'number is required'})}
									/>
									{errors.phNumbers?.[index]?.number && (
										<p className="error">
											{errors.phNumbers[index].number?.message}
										</p>
									)}
									{index > 0 && (
										<button type="button" onClick={() => remove(index)}>
											{" "}
											Remove{" "}
										</button>
									)}
								</div>
							);
						})}

						<button type="button" onClick={() => append({ number: "" })}>
							Add More
						</button>
					</div>
				</div>

        <div className="section">
					<label htmlFor="age">Age</label>
					<input type="number" id="age" {...register("age",{
            valueAsNumber:true,
            required:"age is required",
          })} />
          {errors.age && <p className='error'>{errors.age.message}</p>}
				</div>

        <div className="section">
					<label htmlFor="dob">Date of Birth</label>
					<input type="date" id="dob" {...register("dob",{
            valueAsDate:true,
            required:"dob is required",
          })} />
          {errors.dob && <p className='error'>{errors.dob.message}</p>}
				</div>

				<button disabled={!isDirty } type="submit">Submit</button>
        <button type='button' onClick={getValuesHandler}>get Values</button>
        <button type='button' onClick={setValueHandler}>set Values</button>
			</form>
			<DevTool control={control} /> {/* Set up the dev tool */}
		</>
	);
}

export default ZodReactHookForm