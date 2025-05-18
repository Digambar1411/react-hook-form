import { DevTool } from '@hookform/devtools';
import {useForm} from 'react-hook-form';

type SampleFormType = {
  username:string;
  email: string;
  gender:string;
  address:{
    street:string;
    city:string;
  }
}

const ReactHookForm = () => {

  const { 
    register, 
    control, 
    handleSubmit, 
    formState:{errors} 
  } = useForm<SampleFormType>({
    defaultValues:async () =>{
      const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
      const data = await response.json();
      return {username:data.username,email:data.email, gender:'', address:{street:data.address.street,city:data.address.city}};
    }});

  const submitForm = (data: SampleFormType) => {
    console.log(data);
  }

  return (
    <>
    <form onSubmit={handleSubmit(submitForm)} noValidate>
      <h1>Reack Hook Form</h1>
      
      <div className='section'>
        <label htmlFor="username">Username</label>
        <input type="text" placeholder='username' {...register('username',{required:'username is required'})}/>
        { errors.username && <p className='error'>{errors.username?.message}</p> }
      </div>

      <div className='section'>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" {...register('email',
        {
          pattern:{
            value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message:'Email is not valid'
          },
          validate:{ 
            notAdmin:(value) => value !== 'admin@gmail.com' || ' This email is not allowed',
            notBlockListedDomain:(value) => !value.endsWith('tcs.com') || 'This domain is not allowed'
          },
          required:'email is required'
        })} />
        {errors.email && <p className='error'>{errors.email?.message}</p> }

      </div>

      <div className=''>
        <label htmlFor="gender">Gender</label>

        <div>
          <label htmlFor="male">Male</label>
          <input type="radio" id="male" value='male'  {...register('gender',{required:'gender is required'})}/>
        </div>
        <div>
          <label htmlFor="female">Female</label>
          <input type="radio" id="female" value='female'  {...register('gender',{required:'gender is required'})} />
        </div>
        <div>
          <label htmlFor="other">other</label>
          <input type="radio" id="other" value='other'  {...register('gender',{required:'gender is required'}) } />
        </div>
          {errors.gender && <p className='error'>{errors.gender?.message}</p> }

        <div className='section'>
          <label htmlFor="street">Street</label>
          <input type="text" id='street' {...register('address.street',{required:'street address is required'})} />
          {errors.address?.street && <p className='error'>{errors.address.street?.message}</p> }
        </div>
        <div className='section'>
          <label htmlFor="city">City</label>
          <input type="text" id='city' {...register('address.city',{required:'city is required'})}/>
          {errors.address?.city && <p className='error'>{errors.address.city?.message}</p> }
        </div>
      </div>

      <button type="submit">Submit</button>
    </form>
    <DevTool control={control} /> {/* Set up the dev tool */}
    </>

  )
}

export default ReactHookForm