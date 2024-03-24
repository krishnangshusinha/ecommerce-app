import {useState , useContext , createContext, useEffect } from 'react';
import axios from 'axios';
/*

    useContext is a React hook that provides a way to share data (context) across multiple components without 
    explicitly passing it through props. i.e setting a global variable

*/

const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [auth,setAuth] = useState({
        user: null,
        token:"",
    });

    // default axios (setting header so that every request has this "Authoriaation" header value present in it )
    axios.defaults.headers.common["Authorization"] = auth?.token;

    useEffect(()=>{     // each time the component is rendered we retrive the data stored in "auth" and parse it and update its value
        
        const data = localStorage.getItem("auth");      // getting data stored in localstorage
        if( data ){
            const parseData = JSON.parse(data);

            setAuth({
                ...auth,
                user: parseData.user,
                token: parseData.token,
            });
        }

        //eslint-disable-next-line

    }, []);     // incase in the dependency we provided auth then in instantanious time it went to the watch mode continously that we dont want so we rmeoved it, but not providing a dependency showed and error, to avoid that we wrote the comment 

    return (
        <AuthContext.Provider value={[auth , setAuth]}>         {/* Wrapping the chilren with the context Provider to let "auth" share among all the components whoever imports this useAuth */}
            {children}
        </AuthContext.Provider>
    );
};

// custom hook
const useAuth = () => useContext(AuthContext);

export {useAuth , AuthProvider};