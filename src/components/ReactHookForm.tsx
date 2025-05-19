import { DevTool } from '@hookform/devtools';
import { useFieldArray, useForm } from "react-hook-form";

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
}

const ReactHookForm = () => {
  const { 
    register, 
    control, 
    handleSubmit, 
    formState:{errors} 
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
      phNumbers:[{number:''}]
    }});

  const {fields, append, remove} = useFieldArray({
    name:'phNumbers',
    control,
  })

  const submitForm = (data: SampleFormType) => {
    console.log(data);
  }

  return (
		<>
			<form onSubmit={handleSubmit(submitForm)} noValidate>
				<h1>Reack Hook Form</h1>

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
					<label htmlFor="street">Street</label>
					<input
						type="text"
						id="street"
						{...register("address.street", {
							required: "street address is required",
						})}
					/>
					{errors.address?.street && (
						<p className="error">{errors.address.street?.message}</p>
					)}
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
					<label htmlFor="primary-phone">Primary Phone</label>
					<input
						type="number"
						id="phone1"
						{...register("phoneNumbers.0", {
							required: "primary phone is required",
						})}
					/>
				</div>

				<div className="section">
					<label htmlFor="secondary-phone">Secondary Phone</label>
					<input type="number" id="phone2" {...register("phoneNumbers.1")} />
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

				<button type="submit">Submit</button>
			</form>
			<DevTool control={control} /> {/* Set up the dev tool */}
		</>
	);
}

export default ReactHookForm