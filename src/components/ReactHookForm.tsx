import { DevTool } from '@hookform/devtools';
import { useEffect } from 'react';
import { useFieldArray, useForm, type FieldErrors , } from "react-hook-form";

let render = 0;

type SampleFormType = {
  username:string;
  email: string;
  gender:string;
  address:{
    street:string;
    city:string;
  }
  phoneNumbers:string[];
  phNumbers:{
    number:string
  }[];
  age:number;
  dob:Date;
  doj:string
}

const ReactHookForm = () => {
  const { 
    register, 
    control, 
    handleSubmit, 
    formState:{
      errors, 
      touchedFields,
      dirtyFields,
      isDirty,
      isValid,
      isSubmitted,
      isSubmitting,
      isSubmitSuccessful
      },
    watch,
    getValues,
    setValue,
    reset
  } = useForm<SampleFormType>({
    defaultValues:{
      username:'',
      email:'', 
      gender:'', 
      address:{
        street:'',
        city:''
      },
      phoneNumbers:['',''],
      phNumbers:[{number:''}],
      age:0,
      dob:new Date(),
      doj:''
    }});

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

  // useEffect(()=>{
  //   const subscription = watch((value) => {
  //     console.log('username :',value);
  //   });
  //   return ()=>subscription.unsubscribe();
  // },[watch]);

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
									value.endsWith("tcs-evms.com") || "Domain does not  match",
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
					<label htmlFor="primary-phone">Primary Phone</label>
					<input
						type="text"
						id="phone1"
						{...register("phoneNumbers.0", {
							required: "primary phone is required",
						})}
					/>
				</div>

				<div className="section">
					<label htmlFor="secondary-phone">Secondary Phone</label>
					<input type="text" id="phone2" {...register("phoneNumbers.1")} />
				</div>

				<div className="section">
					<label htmlFor="phone-numbers">Other Phone Numbers</label>
					<div>
						{fields.map((field, index) => {
							return (
								<div key={field.id}>
									<input
										type="text"
										{...register(`phNumbers.${index}.number` as const)}
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

        <div className="section">
					<label htmlFor="doj">Date of Joining</label>
					<input type="date" id="doj" {...register("doj",{
            // valueAsDate:true, //can set to true or false
            required:"Date of Joining is required",
          })} />
          {errors.doj && <p className='error'>{errors.doj.message}</p>}
				</div>

				<button disabled={!isDirty  || !isValid} type="submit">Submit</button>
        <button type='button' onClick={getValuesHandler}>get Values</button>
        <button type='button' onClick={setValueHandler}>set Values</button>
			</form>
			<DevTool control={control} /> {/* Set up the dev tool */}
		</>
	);
}

export default ReactHookForm