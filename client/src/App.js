import React from "react";
import Layout from "./components/Layouts/layout.js";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import About from "./pages/About.js";
import Contact from "./pages/Contact.js";
import Policy from "./pages/Policy.js";
import PageNotFound from "./pages/PageNotFound.js";
import Register from "./pages/Auth/Register.js";
import Login from "./pages/Auth/Login.js";
import PrivateRoute from './components/Routes/Private.js';
import ForgotPassword from "./pages/Auth/ForgotPassword.js";
import AdminRoute from "./components/Routes/AdminRoute.js";
import AdminDashboard from "./pages/Admin/AdminDashboard.js";
import CreateCategory from "./pages/Admin/CreateCategory.js";
import CreateProduct from "./pages/Admin/CreateProduct.js";
import Users from "./components/Layouts/Users.js";
import Dashboard from "./pages/user/dashboard.js";
import Orders from "./pages/user/Orders.js";
import Profile from "./pages/user/Profile.js";
import Products from "./pages/Admin/Products.js";
import UpdateProduct from "./pages/Admin/UpdateProduct.js";
import Search from "./pages/Search.js";
import ProductDetails from "./pages/ProductDetails.js";
import Categories from "./pages/Categories.js";
import CategoryProduct from "./pages/CategoryProduct.js";
import CartPage from "./pages/CartPage.js";
import AdminOrders from "./pages/Admin/AdminOrders.js";

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" Component={HomePage}/>
                <Route path="/register" Component={Register}/>
                <Route path="/login" Component={Login}/>
                <Route path="/search" Component={Search}/>
                <Route path="/product/:slug" Component={ProductDetails}/>
                <Route path="/categories" Component={Categories}/>
                <Route path="/category/:slug" Component={CategoryProduct}/>
                <Route path="/cart" Component={CartPage}/>


                {/* For users , verified using PrivateRoute */}
                <Route path="/dashboard" element={<PrivateRoute/>}>     {/* So firstly whenever the user tries to go to this url it is checked whether it is logged in or not, if logged in then only allows to go to dashboard else redirected using a spinner(loading interface).Since we used <Outlet/> in the Private.js component hence it allowed nested routing in here */}
                    <Route path="user" Component={Dashboard}/>
                    <Route path="user/orders" Component={Orders}/>
                    <Route path="user/profile" Component={Profile}/>
                </Route>


                {/* For Admin , verified using AdminRoute */}
                <Route path="/dashboard" element={<AdminRoute/>}>     {/* So firstly whenever the user tries to go to this url it is checked whether it is logged in or not, if logged in then only allows to go to dashboard else redirected using a spinner(loading interface).Since we used <Outlet/> in the Private.js component hence it allowed nested routing in here */}
                    <Route path="admin" Component={AdminDashboard}/>
                    <Route path="admin/create-category" Component={CreateCategory}/>
                    <Route path="admin/create-product" Component={CreateProduct}/>
                    <Route path="admin/product/:slug" Component={UpdateProduct}/>
                    <Route path="admin/products" Component={Products}/>
                    <Route path="admin/users" Component={Users}/>
                    <Route path="admin/orders" Component={AdminOrders}/>
                </Route>


                <Route path="/about" Component={About}/>
                <Route path="/forgot-password" Component={ForgotPassword}/>
                <Route path="/contact" Component={Contact}/>
                <Route path="/policy" Component={Policy}/>
                <Route path="*" Component={PageNotFound}/>      {/* Incase no valid URL is added then page not found is displayed */}
            </Routes>
        </>
    );
}

export default App;