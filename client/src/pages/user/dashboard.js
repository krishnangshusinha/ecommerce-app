import React from 'react'
import Layout from '../../components/Layouts/layout';
import UserMenu from '../../components/Layouts/UserMenu';
import { useAuth } from '../../context/auth';

const Dashboard = () => {

  const [auth, setAuth] = useAuth();

  return (
    <>
        <Layout title="Dashboard - Ecommerce App">
          <div className='container-fluid m-3 p-3'>
            <div className='row'>
              <div className='col-md-3'>
                <UserMenu/>
              </div>
              <div className='col-md-p'>
                <div className='card w-75 p-3'>
                  <h4>User Name: {auth?.user.name} </h4>      {/* Display the name of the logged in user */}
                  <h4>User Email: {auth?.user.email} </h4>      
                  <h4>User Address: {auth?.user.address} </h4>      
                </div>
              </div>

            </div>
          </div>
        </Layout>
    </>
  );
}

export default Dashboard;
