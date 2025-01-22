import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { BASE_URL_DEV, fetchAuth } from "../utils";
import { UserContext } from "../App";

const Login = () => {
  const history = useHistory();
  const { dispatch } = useContext(UserContext);

  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const auth = fetchAuth();
    if (auth && auth.authToken && auth.userPublicId) {
      history.push("/dashboard");
      console.log(auth);
    }
  }, [history]);

  const loginUser = async (e) => {
    e.preventDefault();
    if (!userDetails.username || !userDetails.password) return null;
    const response = await fetch(`${BASE_URL_DEV}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Assume you handle authentication token here if needed
      },
      body: JSON.stringify(userDetails),
    });
    const json = await response.json();
    console.log(json);
    if (response.ok) {
      dispatch({ type: "AUTH", payload: json });
      history.push("/dashboard");
    } else {
      // Handle errors, e.g., unauthorized access
      console.error('Login failed:', json);
    }
  };
  
  return (
    <div className="mt-5 auth-page" style={{ height: "85vh" }}>
      <div className="d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-5 mx-auto">
            <div className="card text-center py-3 mt-3 bg-dark2 px-3 px-sm-5">
              <div className="brand-logo">
                <img src={require("../images/scaletransm2.png")} alt="logo" />
              </div>
              <h4>Copilot for Lawyers</h4>
              {/* <h6 className="font-weight-light">Please Sign in to continue.</h6> */}
              <Form className="pt-3">
                <Form.Group className="d-flex search-field">
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    size="lg"
                    className="h-auto"
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        username: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="d-flex search-field">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    size="lg"
                    className="h-auto"
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        password: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <div className="mt-3">
                  <Button
                    className="btn btn-block btn-primary btn font-weight-medium auth-form-btn btn btn-primary align-self-center"
                    onClick={loginUser}
                  >
                    SIGN IN
                  </Button>
                </div>
                <div className="text-center mt-4 font-weight-light">
                  Don't have an account?{" "} <br></br>
                  <Link to="/register" className="text-primary">
                    Create your account
                  </Link>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
