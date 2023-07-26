import React, { useState, useEffect } from "react";
import { NavLink, useHistory, Redirect } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import "bootstrap/dist/css/bootstrap.css";

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cookies, setCookies] = useCookies(["jwtoken"]);

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://bookshelf-backend-e2pg.onrender.com/signin", {
        email,
        password,
      });

      if (response.status === 200) {
        window.alert("Login Successful");


        const token = response.data.token;
        handleToken(token);
        setIsLoggedIn(true);
        history.push("/");
      } else {
        window.alert("Login Failed:Invalid Credentials");
      }
    } catch (error) {
      window.alert("Error occurred during login");
      console.error(error);
    }
  };

  const handleToken = (token) => {
    localStorage.setItem("token", token);
    setCookies("jwtoken", token, { path: "/" });
    setAuthToken(token);
  };

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    const token = cookies.jwtoken;
    if (token) {
      setAuthToken(token);
      setIsLoggedIn(true);
    }
  }, [cookies.jwtoken]);

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <section className="sign-up">
        <form>
          <div className="form-group mb-2 row m-1">
            <label htmlFor="email" className="col-sm-1 col-form-label">
              Email
            </label>
            <div className="col-sm-5">
              <input
                type="text"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter your email ID"
              />
            </div>
          </div>

          <div className="form-group mb-3 row mb-2 m-1">
            <label htmlFor="password" className="col-sm-1 col-form-label">
              Password
            </label>
            <div className="col-sm-5">
              <input
                type="text"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="enter your password"
              />
            </div>
          </div>

          <div className="col-auto m-3 mb-4 mt-1">
            <button
              type="submit"
              name="signin"
              id="signin"
              className="form-submit custom-button"
              value="Log In"
              onClick={loginUser}
            >
              Login
            </button>
          </div>
        </form>
      </section>

      <NavLink to="/register">Create an Account</NavLink>
    </>
  );
};

export default Login;
