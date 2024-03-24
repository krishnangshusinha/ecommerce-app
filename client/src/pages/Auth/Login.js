import React, { useState } from 'react'
import Layout from '../../components/Layouts/layout'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../../styles/AuthStyles.css';
import { useAuth } from '../../context/auth';

const Login = () => {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    
    const [auth , setAuth] = useAuth();     // for context API

    const location = useLocation();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {

        event.preventDefault(); // prevents refreshing the page

        try {
            
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`, {email,password});      // gets the response sent in this URL by the server

            if( res.data.success ){     // if you remember we had a success property in the response i.e set from the server(in authController in the registerController())
                toast.success(res.data.message);

                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token,
                });
                localStorage.setItem("auth", JSON.stringify(res.data));      //storing the data on local storage so that it is not lost on refreshing the page

                navigate( location.state || "/");     // incase of successfull login move to its desired page( incase user wants to access the dashboard, then it is already stored in the state property of the location vairable(in spinner.js) and now we use that, incase no value is stored it is redirected to the home page)
            }
            else{
                toast.error(res.data.message);
            }

        }
        catch (error) {
            console.log(error);
            toast.error("Something went wrong !!");         // incase of an error display this toast    
        }
    }
  return (
    <>
        <Layout title="Login Yourself">   {/* Design used from Bootstrap */}
           <div className='form-container'  style={{ minHeight: "90vh" }}>
            <form onSubmit={handleSubmit}>   {/* All feilds are marked as required */}
                <h4 className="title">LOGIN FORM</h4>
               
                <div className="mb-3">
                    <input type="email" className="form-control" id="exampleInputEmail" placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" id="exampleInputPassword" placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <div className='mb-3'>
                    <button type="submit" className="btn btn-primary" onClick={()=>navigate("/forgot-password")}>Forgot Password</button>
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
           </div> 
        </Layout>
    </>
  )
}

export default Login
