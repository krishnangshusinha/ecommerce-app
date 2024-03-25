import React, { useEffect, useState } from 'react'
import Layout from '../components/Layouts/layout'
import axios from 'axios';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Prices';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
import '../styles/HomePage.css';

let REACT_APP_API = "https://ecommerce-app-sx2y.onrender.com"

const HomePage = () => {
  const [products , setProducts] = useState();
  const [categories , setCategories] = useState();
  const [checked , setChecked] = useState([]);    // used to store the list of categories selected in filter
  const [radio , setRadio] = useState([]);    // for the price filter
  const [total , setTotal] = useState(0);   // keeps track of total products
  const [page , setPage] = useState(1);     // keeps track of current page
  const [loading , setLoading] = useState(false);   // for loading

  const [cart ,setCart] = useCart();      // context API global variable for Cart

  const navigate = useNavigate();

  // get all categories
  const getAllCategory = async () => {
    try {
      // getting data from the backend from this URL
      const {data} = await axios.get(`${REACT_APP_API}/api/v1/category/get-category`); 

      if( data?.success ){
        setCategories(data?.category);
      }

    } 
    catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    getAllCategory();
    getTotal();
  },[])

  // getting all the products
  const getAllProduct = async() => {
    try{
      setLoading(true);
      const {data} = await axios.get(`${REACT_APP_API}/api/v1/product/product-list/${page}`);    // getting the poducts 
      setLoading(false);
      setProducts(data.products);     // setting the products
    }
    catch(error){
      setLoading(false);
      console.log(error);
    }
  }

  // handling the filter property
  const handleFilter = async (value , id) => {
    let all = [...checked];
    
    if( value ){
      all.push(id);   // if enter current category id
    }
    else{   // if no category is selectec
      all = all.filter( cid => cid !== id);
    }
    
    setChecked(all);
  }
  
  // get filtered products
  const filterProducts = async() => {
    try{
      
      const {data} = await axios.post(`${REACT_APP_API}/api/v1/product/product-filters`, {checked , radio});
      setProducts(data.products);   // updating current product list by all the filtered data
      
    }
    catch(error){
      console.log(error);
    }
  }

  // get total count of products
  const getTotal = async() => {
    try{
      const {data} = await axios.get(`${REACT_APP_API}/api/v1/product/product-count`);    // getting response from the URL
      setTotal(data?.total);    // updating total count of products
    }
    catch(error){
      console.log(error);
    }
  }

  // loadmore functionality for the button
  const loadMore = async () => {
    try{
      setLoading(true);
      const {data} = await axios.get(`${REACT_APP_API}/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products , ...data?.products]);
    }
    catch(error){
      setLoading(false);
      console.log(error);
    }
  }

  useEffect(() =>{
    if( page === 1 ){
      return;
    }

    loadMore();
  }, [page])
  
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProduct();   // if none of them exists the display all products
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProducts();      // if either of them exists display filtered product
  }, [checked, radio]);

  return (
    <Layout title="All products - Ecommerce App">
      {/* banner image */}
      <img
        src="/images/banner.png"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      />

      <div className='container-fluid row mt-3 home-page'>

        {/* Category filter */}
        <div className='col-md-3 filters'>
          <h4 className='text-center'>Filter By Category</h4>
          <div className='d-flex flex-column'>
            {categories?.map((c) => (
              <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked , c._id)}>
              {c.name}
              </Checkbox>
            ))}
          </div>

          {/* Prices filter */}
          <h4 className='text-center mt-4'>Filter By Prices</h4>
          <div className='d-flex flex-column'>
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((price) => (
                <div key={price._id}>
                  <Radio value={price.array}>{price.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className='d-flex flex-column'>
            <button className='btn btn-danger' onClick={() => window.location.reload()}>RESET</button>    {/* Just reloading the window in case RESET button is clicked */}
          </div>

        </div>
      
      

        <div className='col-md-9'>
          <h1 className='text-center'>All products</h1>
          <div className='d-flex flex-wrap'>
              {products?.map((p) => (

                  <div className="card m-2" key={p._id}>
                    <img
                      src={`${REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                    />
                    <div className="card-body">
                      <div className="card-name-price">
                        <h5 className="card-title">{p.name}</h5>
                        <h5 className="card-title card-price">
                          {p.price.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </h5>
                      </div>
                      <p className="card-text ">
                        {p.description.substring(0, 60)}...
                      </p>
                      <div className="card-name-price">
                        <button
                          className="btn btn-info ms-1"
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          More Details
                        </button>
                        <button
                          className="btn btn-dark ms-1"
                          onClick={() => {
                            setCart([...cart, p]);
                            localStorage.setItem(
                              "cart",
                              JSON.stringify([...cart, p])
                            );
                            toast.success("Item Added to cart");
                          }}
                        >
                          ADD TO CART
                        </button>
                      </div>
                    </div>
                </div>

              ))}
          </div>

          <div className='m-2 p-3'>
              {products && products.length < total && (
                <button className='btn loadmore' onClick={(e) => {e.preventDefault() ; setPage(page+1)}}>
                  {loading ? "Loading" : "Load More..."}
                </button>
              )}
          </div>

        </div>
      </div>

    </Layout>
  )
}

export default HomePage;
