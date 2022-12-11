import { React, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import Axios from "axios";

export const Signup = () => {
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

  return (
    <main className="background">
      <section className="center">
        <div className="login-form">
          <div className="login-form-header">Sign Up</div>
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
              placeholder="Mobile Number or Email"
              maxLength="75"
              // value={input.keyInput}
              onChange={(e) => {
                // handleChange(e);
              }}
            />
            <input
              autoComplete="true"
              className="login-form-password"
              name="keyInput"
              placeholder="Full Name"
              maxLength="75"
              // value={input.keyInput}
              onChange={(e) => {
                // handleChange(e);
              }}
            />
            <input
              autoComplete="true"
              className="login-form-password"
              name="keyInput"
              placeholder="Username"
              maxLength="75"
              // value={input.keyInput}
              onChange={(e) => {
                // handleChange(e);
              }}
            />
            <input
              autoComplete="true"
              className="login-form-password"
              name="keyInput"
              placeholder="Password"
              maxLength="75"
              // value={input.keyInput}
              onChange={(e) => {
                // handleChange(e);
              }}
            />
            <button disabled className="login-form-button">
              Sign Up
            </button>
            <div className="login-form-option">
              <p>OR</p>
            </div>
            <div className="login-form-google">
              <button onClick={login} className="login-form-google__button">
                <FcGoogle className="login-form-google__icon" />
                <p className="login-form-google__text">Continue with Google</p>
              </button>
            </div>
            <p className="login-form-signuptext">
              Have an account?{" "}
              <a
                className="login-form-signup"
                draggable="true"
                onClick={() => console.log("sad")}
              >
                Log In
              </a>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};
