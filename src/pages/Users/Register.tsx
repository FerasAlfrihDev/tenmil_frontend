import { FC } from 'react';
import { ApiForm } from '../../components';

const Register:FC = () => {
    
  return (
    <div className='login'>
        <div className="login-header">
            <h3>Register</h3>
            <h6>Welcome to Tenmil</h6>
        </div>
        <ApiForm 
            formName="Register"
            className='login-form flex-vertical'
            isNew={true}
            endPoint="users/register"
            oriantation='vertical'
            submitButtonName="Register"
            children={[
            {
                label:"Email",
                name:"email",
                type:"email",
                size:6,
                component:"InputGroup",
                required:true
            },
            {
                label:"Name",
                name:"name",
                type:"text",
                size:6,
                component:"InputGroup",
                required:true
            },
            {
                label:"Password",
                name:"password",
                type:"password",
                size:6,
                component:"InputGroup",
                required:true
            },
            
            ]}
        />
    </div>
  );
}

export default Register;
