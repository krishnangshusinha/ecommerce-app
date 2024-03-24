import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
import {BrowserRouter} from 'react-router-dom';
import { AuthProvider } from './context/auth.js';
import "antd/dist/reset.css";
import { SearchProvider } from './context/Search.js';
import { CartProvider } from './context/cart.js';

// Bootstrap is being used hence the <link> and <script> tags are included from the website in the "index.html" file

/*
  npm i react-router-dom    --> for routing
  npm i react-icons         --> for the icons
  npm i react-helmet        --> this is used for SEO optimization of our page. React by default does not support SEO and we hence need this third party package to SEO optimize our website. For SEO optimization we need to have relevant keywords in the <meta> tag , which could be done using this npm package. Using this package we would create re usable meta tags
  npm i axios               --> popular npm package used to communicate with the backend
  npm i react-hot-toast     --> this package gives us the facility to toast a notification
  npm i antd                --> used for using popup modals like the one used in "Edit" button for admin dashboard fro "create category". And some more design stuff like checkbox facility
  npm i braintree-web-drop-in-react   --> used for UI of payment gateway
  npm i moment              --> to deal with time and date 
  
*/

/*

    Context API is being used in order to manage the state of global variables. Managing states means making the 
    website interactive for the user on the basis of there input, i.e each user having there own state.
    That can be achieved using Context API. (it is provided by default in React not need to install any package).
    The Context API consists of two parts context provider and context consumer.
    The basic set up of which is done in ./context/auth.js

*/

ReactDOM.render(
  <AuthProvider>    {/* This AuthProvider enables usage of context API for authorisaion */}
    <SearchProvider>    {/* This SearchProvider enables usage of context API for search */}
      <CartProvider>  {/* This CartProvider enables usage of context API for cart */}
        <BrowserRouter>   {/* This BrowserRouter enables usage of React router dom */}
          <App/>
        </BrowserRouter>
      </CartProvider>
    </SearchProvider>
  </AuthProvider>
  ,
  document.getElementById('root')
);
