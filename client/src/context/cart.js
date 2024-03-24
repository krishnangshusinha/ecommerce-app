import {useState , useContext , createContext, useEffect} from 'react';
/*

    useContext is a React hook that provides a way to share data (context) across multiple components without 
    explicitly passing it through props. i.e setting a global variable

*/

const CartContext = createContext();

const CartProvider = ({children}) => {

    const [cart,setCart] = useState([]);
    
    useEffect(()=>{
        let existingItems = localStorage.getItem("cart");       // initially getting the cart items stored in localstorage
        if(existingItems){
            setCart(JSON.parse(existingItems));     // updating it in setCart()
        }
    },[])

    return (
        <CartContext.Provider value={[cart , setCart]}>         {/* Wrapping the chilren with the context Provider to let "auth" share among all the components whoever imports this useAuth */}
            {children}
        </CartContext.Provider>
    );
};

// custom hook
const useCart = () => useContext(CartContext);

export {useCart , CartProvider};