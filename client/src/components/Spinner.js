import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner = ({ path = "login" }) => {   // default value of path is passed as "login"

  const [count, setCount] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {         // for redirecting the user within 5 second whenever this component is rendered

    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);

    count === 0 &&                  // incase timer is 0 navigate to "/login"
      navigate(`/${path}`, {
        state: location.pathname,       // passing the current path in a additional property called "state" ( this is done , since incase a user wants to move to move to dashboard, and has tried to access dashboard without login, then we redirect the user to a loading page i.e the spinner and then from there we get the pathname that it wants to go to and then redirect him to the login page once he logs in he is redirected to his desired page ie dashboard in this case)
      });

    return () => clearInterval(interval);

  }, [count, navigate, location, path]);


  return (
    <>
    {/* Obtained from bootstarp */}
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <h1 className="Text-center">Redirecting you in {count} second </h1>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </>
  );
};

export default Spinner;