import { FC } from 'react';
import { ApiForm } from '../../components';

const Login:FC = () => {
    
  return (
    <div className='login'>
        <div className="login-header">
            <h3>Login</h3>
            <h6>please login to proceed</h6>
        </div>
        <ApiForm
            formName="Login"
            className='login-form flex-vertical'
            isNew={true}
            endPoint="users/login"
            oriantation='vertical'
            submitButtonName="login"
            hasAccessToken={true}
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
                label:"Password",
                name:"password",
                type:"password",
                size:6,
                component:"InputGroup",
                required:false
            },
            
            ]}
        />
        <small>not registered yet? <a href="/register">register here</a></small>
    </div>
  );
}

export default Login;
