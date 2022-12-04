import { React, useState } from "react";
import { FcGoogle } from "react-icons/fc";

export const Login = () => {
  const [input, setInput] = useState({ keyInput: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput({ ...input, [name]: [value] });
  };

  const forgotPassword = () => {};
  const googleAuth = () => {};

  return (
    <main className="background">
      <section className="center">
        <div className="login-form">
          <div className="login-form-header">Log In</div>
          <form
            className="login-form-input"
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <input
              autoFocus
              className="login-form-key"
              name="keyInput"
              placeholder="Phone number, username or email"
              maxLength="75"
              value={input.keyInput}
              onChange={(e) => {
                handleChange(e);
              }}
            />
            <input
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
              <button
                className="login-form-google__button"
                onClick={() => googleAuth()}
              >
                <span className="login-form-google__span">
                  <FcGoogle className="login-form-google__icon" />
                </span>
                <p className="login-form-google__text">Continue with Google</p>
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
              <a className="login-form-signup" draggable="true">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};
