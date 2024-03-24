import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import {Helmet} from 'react-helmet';
import { Toaster } from 'react-hot-toast';


const Layout = (props) => {
    return (
        <>
            {/* This part of code is for reusable meta tags for SEO purpose. We can observe when we render to different components it renders different titles on the page  */}
            <Helmet>
                <meta charSet="UTF-8"/>
                <meta name="description" content={props.description} />
                <meta name="keywords" content={props.keywords} />
                <meta name="author" content={props.author} />
                <title>{props.title}</title>
            </Helmet>


            <Header/>
            <main style={{minHeight: '70vh'}}>      {/* This displays the child wrapped within <Layout> component */}
                {props.children}
                <Toaster/>       {/*This container needs to be used to give toastify effect */}
            </main>       
            <Footer/>
        </>
    );
}


/* This sets a default value for the "props" */
Layout.defaultProps = {
    title: "Ecommerce App Shop Now",
    description: "MERN stack Project",
    keywords:"MERN, mern , MongoDB , ExpressJS , ReactJS , NodeJS",
    author: "Krishnangshu Sinha"
}

export default Layout