import React, {useState , useEffect} from 'react'
import AdminMenu from '../../components/Layouts/AdminMenu'
import Layout from '../../components/Layouts/layout'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

let REACT_APP_API = "https://ecommerce-app-sx2y.onrender.com"

const Products = () => {
    const [products, setProducts] = useState([]);       // list that stores all the products

  //getall products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`${REACT_APP_API}/api/v1/product/get-product`);   // getting all the products
      setProducts(data.products);// set the products list
    } 
    catch (error) {
      console.log(error);
      toast.error("Someething Went Wrong");
    }
  };

  //lifecycle method
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <>
        <Layout title='Products - Ecommer App'>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminMenu/>
                </div>
                <div className='col-md-9'>
                    <h1 className='text-center'>All Products</h1>
                    <div className="d-flex flex-wrap">
                        {products?.map((p) => (
                        <Link key={p._id} to={`/dashboard/admin/product/${p.slug}`} className="product-link">

                            <div className="card m-2" style={{ width: "18rem" }}>
                                <img src={`${REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name}/>
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">{p.description}</p>
                                </div>
                            </div>

                        </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    </>
  )
}

export default Products
