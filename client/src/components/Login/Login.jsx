import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { Signup } from "./Signup";
import Axios from "axios";

export const Login = () => {
  //States
  const [input, setInput] = useState({ keyInput: "", password: "" });
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const user = localStorage.getItem("email");

  //Google OAuth
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      const res = await Axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        }
      ).then(async (response) => {
        const userGoogleData = {
          firstName: response.data.given_name,
          lastName: response.data.family_name,
          email: response.data.email,
          picture: response.data.picture,
        };
        const userData = await Axios.post(
          "http://localhost:3001/handletokens",
          userGoogleData
        ).then((res) => {
          localStorage.setItem("email", res.data.email);
        });

        window.location.href = "http://localhost:3000/home";
      });
    },
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput({ ...input, [name]: [value] });
  };

  const forgotPassword = () => {};

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, []);

  if (!user && !isSignUp) {
    return (
      <main className="background">
        <section className="center">
          <div className="login-form">
            <div className="login-form-header">Log In</div>
            <form
              className="login-form-input"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                autoFocus
                autoComplete="true"
                className="login-form-key"
                name="keyInput"
                placeholder="Username or Email"
                maxLength="75"
                value={input.keyInput}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
              <input
                autoComplete="true"
                className="login-form-password"
                placeholder="Password"
                name="password"
                type="password"
                maxLength="75"
                value={input.password}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
              <button disabled className="login-form-button">
                Log In
              </button>
              <div className="login-form-option">
                <p>OR</p>
              </div>
              <div className="login-form-google">
                <button onClick={login} className="login-form-google__button">
                  <FcGoogle className="login-form-google__icon" />
                  <p className="login-form-google__text">
                    Continue with Google
                  </p>
                </button>
              </div>
              <a
                className="login-form-forgotpassword"
                draggable="true"
                onClick={() => {
                  forgotPassword();
                }}
              >
                Forgot Password?
              </a>
              <p className="login-form-signuptext">
                Don't have an account?{" "}
                <a
                  className="login-form-signup"
                  draggable="true"
                  onClick={() => setIsSignUp(true)}
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </section>
      </main>
    );
  }
  if (isSignUp) {
    return <Signup />;
  }
};
