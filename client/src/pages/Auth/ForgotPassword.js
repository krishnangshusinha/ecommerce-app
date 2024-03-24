import React, { useState } from 'react'
import Layout from '../../components/Layouts/layout'
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../../styles/AuthStyles.css';


const ForgotPassword = () => {
    const [email,setEmail] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const [answer , setAnswer] = useState("");


    const navigate = useNavigate();

    const handleSubmit = async (event) => {

        event.preventDefault(); // prevents refreshing the page

        try {
            
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`, {email,newPassword,answer});      // gets the response sent in this URL by the server

            if( res.data.success ){     // if you remember we had a success property in the response i.e set from the server(in authController in the registerController())
                toast.success(res.data.message);

                
                navigate("/login");     // incase of successfull login move to its desired page( incase user wants to access the dashboard, then it is already stored in the state property of the location vairable(in spinner.js) and now we use that, incase no value is stored it is redirected to the home page)
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
    <Layout title="Forgot Passord - Ecommerce App">
        <div className='form-container'  style={{ minHeight: "90vh" }}>
            <form onSubmit={handleSubmit}>   {/* All feilds are marked as required */}
                <h4 className="title">Reset Password</h4>
               
                <div className="mb-3">
                    <input type="email" className="form-control" id="exampleInputEmail" placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <input type="text" className="form-control" id="exampleInputAnswer" placeholder='Enter Your First School Name' value={answer} onChange={(e) => setAnswer(e.target.value)} required/>
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" id="exampleInputPassword" placeholder='Enter Password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required/>
                </div>
                <button type="submit" className="btn btn-primary">Reset</button>
            </form>
        </div>
    </Layout>
  )
}

export default ForgotPassword
