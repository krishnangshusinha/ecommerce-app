import { useState,useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import Spinner from "../Spinner";
import axios from "axios";

let REACT_APP_API = "https://ecommerce-app-sx2y.onrender.com"

export default function AdminRoute() {

    const [ok , setOK] = useState(false);
    const [auth , setAuth] = useAuth();

    useEffect(()=>{
        const authCheck = async () => {

            const res = await axios.get(`${REACT_APP_API}/api/v1/auth/admin-auth`);      // getting the GET request from server

            if( res.data.ok ){
                setOK(true);
            }
            else{
                setOK(false);
            }
        }

        if(auth?.token)  authCheck();       // checks if token for current user exists or not

    } ,[auth?.token]);      // each time auth is recieved then we would recieve token too so render this useEffect()


    return ok ? <Outlet/> : <Spinner path=""/>;          // this Outlet is used to provide nested routing. Incase Ok is true then we need to redirect it to dashboard but via a nested routing of that specific user so for that purpose we use <Outlet/>
}                                                // incase ok is set to false then user is not logged in, so show <Spinner/>
