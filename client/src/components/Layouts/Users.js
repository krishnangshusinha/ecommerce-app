import React from 'react'
import Layout from './layout'
import AdminMenu from './AdminMenu'

const Users = () => {
  return (

    <Layout title="All Users-Admin">
        <div className='container-fluid m-3 p-3'>
            <div className='col-md-3'>
                <AdminMenu/>
            </div>
            <div className='col-md-9'>
                <h1>All users</h1>
            </div>
        </div>
    </Layout>
  )
}

export default Users
