import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import { GiShoppingBag } from "react-icons/gi";
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import SearchInput from '../Form/SearchInput';
import useCategory from '../../hooks/useCategory';
import { useCart } from '../../context/cart';

const Header = () => {

  const [auth , setAuth] = useAuth();   // context API global variable for Authentication
  const [cart , setCart] = useCart();   // context API global variable for cart

  const categories = useCategory();

  const handleLogout = () => {

    setAuth({   // setting the auth value as empty since the user is logged out
      ...auth,
      user: null,
      token:'',
    })

    localStorage.removeItem("auth");    // remove it from localStorage
    toast.success("Logout Successfully");
  };

  return (
    <>
    {/* Copied from Bootstrap and then converted HTML to JSX (small modifications done)*/}
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link to="/" className="navbar-brand" href="#">
            <GiShoppingBag /> Ecommerce App
            </Link>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <SearchInput />     {/* for searching of products */}
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
              </li>
              
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to={"/categories"} data-bs-toggle="dropdown">
                  Categories
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to={"/categories"}>
                      All Categories
                    </Link>
                  </li>
                  {categories?.map((c) => (
                    <li>
                      <Link className="dropdown-item" to={`/category/${c.slug}`}>
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>


              {
                !auth?.user ?      /* If user does not exist then show both Register and Login option, but if user is already logged in then only show LogOut option */
                (
                  <>
                    <li className="nav-item">
                      <NavLink to="/register" className="nav-link" href="#">
                        Register
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink  to="/login" className="nav-link" href="#">
                        Login
                      </NavLink>
                    </li>
                  </>
                ):
                (
                  <>
                  <li className="nav-item dropdown">
                    <NavLink
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      style={{ border: "none" }}
                    >
                    {auth?.user?.name}      {/* Getting name of the current logged in user */}
                    </NavLink>

                    <ul className="dropdown-menu">    {/* This style would show a drop down button having two option either to go to dashboard or to logout */}
                      <li>
                        <NavLink
                          to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user" }`}
                          className="dropdown-item"
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          onClick={handleLogout}
                          to="/login"
                          className="dropdown-item"
                        >
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </>
                )
              }
              <li className="nav-item">
                <NavLink to="/cart" className="nav-link" href="#">
                  Cart ({cart?.length})
                </NavLink>
              </li>
              
            </ul>
            
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header
