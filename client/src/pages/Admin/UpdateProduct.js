import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layouts/layout'
import AdminMenu from '../../components/Layouts/AdminMenu'
import axios from 'axios';
import toast from 'react-hot-toast';
import { Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
const {Option} = Select;        // this Option can be used to make a drop down list

let REACT_APP_API = "https://ecommerce-app-sx2y.onrender.com"

const UpdateProduct = () => {

    const [categories , setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [shipping, setShipping] = useState("");
    const [photo, setPhoto] = useState("");
    const [id , setId] = useState();

    const navigate = useNavigate();
    const params = useParams();         // used to fetch variables from the URL

  // get single product
  const getSingleProduct = async () => {
    try {
        // fetching from the backend
        const {data} = await axios.get(`${REACT_APP_API}/api/v1/product/get-product/${params.slug}`)
        setName(data.product.name);
        setId(data.product._id);
        setDescription(data.product.description);
        setPrice(data.product.price);
        setQuantity(data.product.quantity);
        setShipping(data.product.shipping);
        setCategory(data.product.category._id);

    } 
    catch (error) {
        console.log(error);    
    }
  }

  useEffect(()=> {
    getSingleProduct();
  } , [])

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
      toast.error("Something went wrong in getting Categories");  
    }
  }

  useEffect(()=> {
    getAllCategory();     // so calls this function each time the component is begin rendered.
  }, []);

  // update the product according to the entries
  const handleUpdate = async (e) =>{
    e.preventDefault();

    try{

      const productData = new FormData();     // form data is used since we have photo and it cant be sent normally like other values
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      photo && productData.append("photo", photo);        // if photo present then only append it
      productData.append("category", category);

      const {data} = await axios.put(`${REACT_APP_API}/api/v1/product/update-product/${id}`, productData);   // all values are passed via this productData

      if( data?.success ){
        toast.success("Product updated Successfully");
        navigate("/dashboard/admin/products");
      }
      else{
        toast.error(data?.message);
      }

    } 
    catch(error){
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  // delete the product
  const handleDelete = async (e) => {
    try {
        
        // check if surely admin wants to delete the product
        const answer = window.prompt("Are you sure you want to delete this product");
        if( !answer ){
            return;
        }

        const {data} = await axios.delete(`${REACT_APP_API}/api/v1/product/delete-product/${id}`);
        toast.success("Product deleted Successfully");
        navigate("/dashboard/admin/products");
           
    }
    catch (error) {
        console.log(error);
        toast.error("Something went wrong");    
    }
  }


    return (

    <>
        <Layout title="Creact Product-Admin">
            <div className='container-fluid m-3 p-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu/>
                    </div>
                    <div className='col-md-9'>
                        <h1>Update Product</h1>
                        <div className='m-1 w-75'>

                                {/* this part is to map through the list of all categories and show a drop down list of them also provides search feature */}
                                <Select bordered={false} placeholder="Select a category" size='large' showSearch className='form-select mb-3' value={category} onChange={(value) => setCategory(value)} >
                                    {categories?.map(c => (
                                    <Option key={c._id} value={c._id}>
                                        {c.name}
                                    </Option>
                                    ))}
                                </Select>

                                {/* div to upload the photo of the product */}
                                <div className='mb-3'>
                                    <label className='btn btn-outline-secondary col-md-12'>
                                    {photo ? photo.name : "Upload Photo"}
                                    <input type='file' name='photo' accept='image/*' onChange={(e) => setPhoto(e.target.files[0])} hidden />    {/* This feild inputs the image of any type since mentioned "image/*" */}
                                    </label>
                                </div>

                                {/* this div is used to show preview of the selected image, here we are getting our image from the URL property of the browser */}
                                <div className='mb-3'>
                                    {
                                    photo ? (
                                        <div className='text-center'>
                                        <img src={URL.createObjectURL(photo)} alt='product_photo' height={"200px"} className='img img-responsive' />
                                        </div>
                                    ): (
                                        <div className='text-center'>
                                        <img src={`${REACT_APP_API}/api/v1/product/product-photo/${id}`} alt='product_photo' height={"200px"} className='img img-responsive' />
                                        </div>
                                    )
                                    }
                                </div>
                                
                                <div className='mb-3'>
                                    <input type='text' value={name} placeholder='Write product name' className='form-control' onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className='mb-3'>
                                    <textarea type='text' value={description} placeholder='Write product description' className='form-control' onChange={(e) => setDescription(e.target.value)} />
                                </div>
                                <div className='mb-3'>
                                    <input type='text' value={price} placeholder='Write product price' className='form-control' onChange={(e) => setPrice(e.target.value)} />
                                </div>
                                <div className='mb-3'>
                                    <input type='text' value={quantity} placeholder='Write product quantity' className='form-control' onChange={(e) => setQuantity(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <Select bordered={false} placeholder="Select Shipping " size="large" showSearch className="form-select mb-3" value={shipping ? "Yes" : "No"} onChange={(value) => { setShipping(value); }}>
                                        <Option value="0">No</Option>
                                        <Option value="1">Yes</Option>
                                    </Select>

                                    <div className="mb-3">
                                        <button className="btn btn-primary" onClick={handleUpdate}>
                                            UPDATE PRODUCT
                                        </button>
                                    </div>
                                    <div className="mb-3">
                                        <button className="btn btn-danger" onClick={handleDelete}>
                                            DELETE PRODUCT
                                        </button>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    </>
  )
}

export default UpdateProduct
