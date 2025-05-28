import { DevTool } from '@hookform/devtools';
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, type addFormSchemaType } from "./formSchema";

let render = 0;

const getDefaultValues = () => {
	return {
		username: "",
		email: "",
		address: {
			street: "",
			city: "",
		},
		age: 0,
		dob: new Date(),
		resourceType: undefined,
		workTypes: ["hybrid" as const],
	};
};

const ZodReactHookForm = () => {
	const useformReturn = useForm<addFormSchemaType>({
		defaultValues: getDefaultValues(),
		resolver: zodResolver(formSchema),
	});

	const {
		register,
		control,
		handleSubmit,
		getValues,
		setValue,
		watch,
		reset,
		formState: { isDirty, errors },
	} = useformReturn;

	const watchedFields = watch("username");

	const submitForm = (data: addFormSchemaType) => {
		console.log(data);
		reset(); //clear fields post submit
	};

	const onError = (errors: FieldErrors<addFormSchemaType>) => {
		console.log("onError:", errors);
	};

	const getValuesHandler = () => {
		console.log(getValues("username"));
	};

	const setValueHandler = () => {
		setValue("username", "admin");
	};

	const handleDiscard = () => {
		isDirty
			? alert("You have unsaved changes")
			: console.log("No unsaved changes form closed");
	};

	render++;

	return (
		<>
			<form onSubmit={handleSubmit(submitForm, onError)} noValidate>
				<h1>Reack Hook Form, renderCount:({render / 2})</h1>
				<button type="button" onClick={handleDiscard}>
					close form
				</button>
				<p>username: {JSON.stringify(watchedFields)}</p>

				<div className="section">
					{errors.username && (
						<span className="error">{errors.username?.message}</span>
					)}
					<label htmlFor="username">*Username</label>
					<input
						type="text"
						placeholder="username"
						{...register("username")}
					/>
				</div>

				<div className="section">
					<label htmlFor="email">*Email</label>
					<input
						type="email"
						id="email"
						{...register("email")}
					/>
					{errors.email && <p className="error">{errors.email?.message}</p>}
				</div>

				<div className="section">
					<label htmlFor="city">City</label>
					<input type="text" id="city" {...register("address.city")} />
					{errors.address?.city && (
						<p className="error">{errors.address.city?.message}</p>
					)}
				</div>

				<div className="section">
					<label htmlFor="street">Street</label>
					<input
						type="text"
						id="street"
						{...register("address.street",{
							disabled: watch("address.city") === ""
						})}
					/>
					{errors.address?.street && (
						<p className="error">{errors.address.street?.message}</p>
					)}
				</div>

				<div className="section">
					<label htmlFor="age">Age</label>
					<input
						type="number"
						id="age"
						{...register("age", {
							valueAsNumber: true,
						})}
					/>
					{errors.age && <p className="error">{errors.age.message}</p>}
				</div>

				<div className="section">
					<label htmlFor="dob">Date of Birth</label>
					<input
						type="date"
						id="dob"
						{...register("dob", {
							valueAsDate: true,
						})}
					/>
					{errors.dob && <p className="error">{errors.dob.message}</p>}
				</div>

				<button disabled={!isDirty} type="submit">
					Submit
				</button>
				<button type="button" onClick={getValuesHandler}>
					get Values
				</button>
				<button type="button" onClick={setValueHandler}>
					set Values
				</button>
			</form>
			<DevTool control={control} /> {/* Set up the dev tool */}
		</>
	);
};

export default ZodReactHookForm