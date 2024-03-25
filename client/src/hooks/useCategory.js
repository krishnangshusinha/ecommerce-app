import { useState , useEffect } from "react";
import axios from "axios";

let REACT_APP_API = "https://ecommerce-app-sx2y.onrender.com"

export default function useCategory(){
    const [categories , setCategories] = useState([]);

    // get all categories
    const getCategories = async () => {
        try{
          const {data} = await axios.get(`${REACT_APP_API}/api/v1/category/get-category`); 
          setCategories(data?.category);

        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        getCategories();
    } , []);

    return categories;
}
