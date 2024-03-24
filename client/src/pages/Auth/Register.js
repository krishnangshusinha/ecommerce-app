import React, { useState } from 'react'
import Layout from '../../components/Layouts/layout'
// import {toast} from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../../styles/AuthStyles.css';

const Register = () => {

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [phone,setPhone] = useState("");
    const [address,setAddress] = useState("");
    const [answer,setAnswer] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault(); // prevents refreshing the page
        
        try {
            
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, {name,password,email,phone,address,answer});      // gets the response sent in this URL by the server

            if( res.data.success ){     // if you remember we had a success property in the response i.e set from the server(in authController in the registerController())
                toast.success(res.data.message);
                navigate("/login");     // incase of successfull registration move to "/login" page
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
        <Layout title="Register Yourself">   {/* Design used from Bootstrap */}
           <div className='form-container'  style={{ minHeight: "90vh" }}>
            <form onSubmit={handleSubmit}>   {/* All feilds are marked as required */}
                <h4 className="title">REGISTER FORM</h4>
                <div className="mb-3">
                    <input type="text" className="form-control" id="exampleInputName" placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)} required/>
                </div>
                <div className="mb-3">
                    <input type="email" className="form-control" id="exampleInputEmail" placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" id="exampleInputPassword" placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <div className="mb-3">
                    <input type="text" className="form-control" id="exampleInputPhone" placeholder='Enter Phone number' value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <input type="text" className="form-control" id="exampleInputAddress" placeholder='Enter Address' value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <input type="text" className="form-control" id="exampleInputAnswer" placeholder='Enter your first School name' value={answer} onChange={(e) => setAnswer(e.target.value)} required />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
           </div> 
        </Layout>
    </>
  )
}

export default Register
