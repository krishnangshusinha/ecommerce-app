import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layouts/layout'
import AdminMenu from '../../components/Layouts/AdminMenu'
import axios from 'axios'
import toast from 'react-hot-toast'
import CategoryForm from '../../components/Form/CategoryForm'
import { Modal } from "antd";

const CreateCategory = () => {
  const [categories , setCategories] = useState([]);    // array to store all categories
  const [name, setName] = useState();
  const [visible , setVisible] = useState(false);   // for the modal that pops up on clicking the "Edit"  button
  const [selected , setSelected] = useState(null);    // to determin which category is selected
  const [updatedName , setUpdatedName] = useState();    // incase the name of category is being updated using the "Edit" button

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // posts this request by sending the "name" to the backend
      const {data} = await  axios.post(`${process.env.REACT_APP_API}/api/v1/category/create-category`, {name});

      if( data?.success ){
        toast.success(`${name} is created`);
        getAllCategory();
      }
      else{
        toast.error(data.message);
      }
    } 
    catch (error) {
      console.log(error);
      toast.error("Something went wrong in input form");  
    }
  }

  // handle update in name of category
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {

      // put this request by sending the "name" as "updatedName" to the backend.
      const {data} = await  axios.put(`${process.env.REACT_APP_API}/api/v1/category/update-category/${selected._id}`, {name:updatedName});
      
      if( data?.success ){
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);    // make the modal non-visible
        getAllCategory();
      }
      else{
        toast.error(data.message);
      }
    } 
    catch (error) {
      console.log(error);  
    }
  }

  // handle delete category
  const handleDelete = async (pid) => {
    
    try {

      // put this request by sending the "name" as "updatedName" to the backend.
      const {data} = await  axios.delete(`${process.env.REACT_APP_API}/api/v1/category/delete-category/${pid}`);
      
      if( data?.success ){
        toast.success(`Category is deleted`);
        getAllCategory();
      }
      else{
        toast.error(data.message);
      }
    } 
    catch (error) {
      console.log(error);  
    }
  }

  // gets all the categories
  const getAllCategory = async () => {
    try {
      // getting data from the backend from this URL
      const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`); 

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

  return (
    <Layout title="Creact Category-Admin">
        <div className='container-fluid m-3 p-3'>
          <div className='row'>
              <div className='col-md-3'>
                  <AdminMenu/>
              </div>
              <div className='col-md-9'>
                  <h1>Manage Category</h1>
                  <div className='p-3 w-50'>
                    <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName}/>
                  </div>
                  <div className='w-75'>
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody>

                          { categories?.map((c) => (
                            <>
                              <tr>
                                <td key={c._id}>{c.name}</td>
                                <td>
                                  <button className='btn btn-primary ms-2' onClick={() => {setVisible(true) ; setUpdatedName(c.name) ; setSelected(c)}}>Edit</button>
                                  <button className='btn btn-danger ms-2' onClick={() => handleDelete(c._id)}>Delete</button>
                                </td>
                              </tr>
                            </>
                          ))} 

                        </tbody>
                      
                      </table>

                  </div>
                  <Modal onCancel={()=>setVisible(false)} footer={null} visible={visible} >  {/* for the pop up modal incase of "Edit" button */}

                    <CategoryForm handleSubmit={handleUpdate} value={updatedName} setValue={setUpdatedName} />

                  </Modal>   
              </div>
          </div>
        </div>
    </Layout>
  )
}

export default CreateCategory
