import React, { useEffect, useState } from 'react'
import Layout from '../components/Layouts/layout'
import { useAuth } from '../context/auth';
import { useCart } from '../context/cart';
import { useNavigate } from 'react-router-dom';
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios';
import toast from 'react-hot-toast';
import '../styles/CartStyles.css';


let REACT_APP_API = "https://ecommerce-app-sx2y.onrender.com"

const CartPage = () => {
    const [auth , setAuth] = useAuth();
    const [cart , setCart] = useCart();

    const [clientToken , setClientToken] = useState("");      // for managing the client token used for payment
    const [instance , setInstance] = useState("");      // used for payment    

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

  //calculates total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // removing items from cart
  const removeCartItem = (pid) => {
    try {
        
        let myCart = [...cart];     // getting all cart elements
        let index = myCart.findIndex(item => item._id === pid);         // finds index of the item to be removed
        myCart.splice(index,1);         // removes the element at that index

        setCart(myCart);
        localStorage.setItem("cart" , JSON.stringify(myCart));          // updating the local storage too.
    } 
    catch (error) {
        console.log(error);    
    }
  }

  // gets client token
  const getToken = async () => {
    try {
        const {data} = await axios.get(`${REACT_APP_API}/api/v1/product/braintree/token`);
        setClientToken(data?.clientToken);
    } 
    catch (error) {
        console.log(error);    
    }
  }

  useEffect(() => {
    getToken();
  }, [auth?.token]);        // call the getToken() if user is login


  // making payment
  const handlePayment = async () => {
    try {
        setLoading(true);
        const {nonce} = await instance.requestPaymentMethod();
        const {data} = await axios.post(`${REACT_APP_API}/api/v1/product/braintree/payments`, {nonce , cart});
        setLoading(false);
        localStorage.removeItem("cart");        // since payment is done so make the cart empty
        setCart([]);
        navigate("/dashboard/user/orders");
        toast.success("Payment done successfully");
    } 
    catch (error) {
        console.log(error)    
        setLoading(false);
    }
  }


  return (
    <Layout title="Add to cart - Ecommerce App">
        <div className=" cart-page">
            <div className="row">
                <div className="col-md-12">
                    <h1 className="text-center bg-light p-2 mb-1">
                        {!auth?.user
                            ? "Hello Guest"
                            : `Hello  ${auth?.token && auth?.user?.name}`}
                        <p className="text-center">
                            {cart?.length
                            ? `You Have ${cart.length} items in your cart ${auth?.token ? "" : "please login to checkout !"}`
                            : " Your Cart Is Empty"}
                        </p>
                    </h1>
                </div>
            </div>

            <div className="container ">
                <div className="row ">
                    <div className="col-md-7  p-0 m-0">
                        {cart?.map((p) => (
                            <div className="row card flex-row" key={p._id}>
                                <div className="col-md-4">
                                    <img
                                    src={`${REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                                    className="card-img-top"
                                    alt={p.name}
                                    width="100%"
                                    height={"130px"}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <p>{p.name}</p>
                                    <p>{p.description.substring(0, 30)}</p>
                                    <p>Price : {p.price}</p>
                                </div>
                                <div className="col-md-4 cart-remove-btn">
                                    <button
                                    className="btn btn-danger"
                                    onClick={()=> removeCartItem(p._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='col-md-5 cart-summary'>
                        <h2> Cart Summary </h2>
                        <p>Total | Checkout | Payment </p>
                        <hr/>
                        <h4>Total : {totalPrice()}</h4>
                        {auth?.user?.address ? (
                            <>
                            <div className="mb-3">
                                <h4>Current Address</h4>
                                <h5>{auth?.user?.address}</h5>
                                <button
                                className="btn btn-outline-warning"
                                onClick={() => navigate("/dashboard/user/profile")}
                                >
                                Update Address
                                </button>
                            </div>
                            </>
                        ) : (
                            <div className="mb-3">
                                {auth?.token ? (
                                    <button
                                    className="btn btn-outline-warning"
                                    onClick={() => navigate("/dashboard/user/profile")}
                                    >
                                    Update Address
                                    </button>
                                ) : (
                                    <button
                                    className="btn btn-outline-warning"
                                    onClick={() =>
                                        navigate("/login", {
                                        state: "/cart",
                                    })
                                    }
                                    >
                                    Plase Login to checkout
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="mt-2">
                            {!clientToken || !auth?.token || !cart?.length ? (
                            ""
                            ) : (
                            <>
                                <DropIn
                                options={{
                                    authorization: clientToken,
                                    paypal: {
                                    flow: "vault",
                                    },
                                }}
                                onInstance={(instance) => setInstance(instance)}
                                />

                                <button
                                className="btn btn-primary"
                                onClick={handlePayment}
                                disabled={loading || !instance || !auth?.user?.address}
                                >
                                {loading ? "Processing ...." : "Make Payment"}
                                </button>
                            </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default CartPage
