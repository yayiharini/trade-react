import React from "react";
import "../App.css";
import { Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { AUTHENTICATION_ENDPOINT } from "../Constants";


const Login =()=>{

    const[email,setEmail]=React.useState('');
    const[password,setPassWord]=React.useState('');
    const[success,setSuccess]=React.useState(false);
    
    //login and set cookie to browser
    const login = async(e) => {
        e.preventDefault();
      let res = await fetch(AUTHENTICATION_ENDPOINT + '/api/login',{
        method: 'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(
          {
            email, 
            password
          }
        )
    });
    console.log(res);
    if(res.status ==200){
      const resData= await res.json();
      console.log("log",JSON.stringify(resData));
      const cookies = new Cookies();
      cookies.set('jwt_token', resData['jwt'], { path: '/' });
      setSuccess(true);
        
    }else {
        setSuccess(false);
    }
}
if(success){
    return <Navigate to="/login" />
}

    return(
        
    <div class="form-container">
      
      <form class="register-form" onSubmit={login}>
        <input
          id="email"
          class="form-field"
          type="text"
          placeholder="Email"
          name="email"
          onChange={e=>setEmail(e.target.value)}
        />
        <input
          id="password"
          class="form-field"
          type="password"
          placeholder="password"
          name="purpose"
          onChange={e=>setPassWord(e.target.value)}
        />
       
        <button class="form-field" type="submit"  style={{backgroundColor:"#008080"}}>
        Login
        </button>
      </form>
      
     
      
      
    </div>
  );
     
    
}
export default Login;