import React from 'react'
import Layout from '../components/Layouts/layout'
import useCategory from '../hooks/useCategory'
import { Link } from 'react-router-dom';

const Categories = () => {

  const categories = useCategory();     // getting all the categories via this custom hook

  return (
    <Layout title="All Categories - Ecommerce App">
        <div className="container" style={{ marginTop: "100px" }}>
            <div className="row container">
                {categories.map((c) => (
                    <div className="col-md-4 mt-5 mb-3 gx-3 gy-3" key={c._id}>
                        <div className="card">
                            <Link to={`/category/${c.slug}`} className="btn cat-btn">
                                {c.name}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </Layout>
  )
}

export default Categories
