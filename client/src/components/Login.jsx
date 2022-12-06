import { React, useState } from "react";

export const Login = () => {
  //States
  const [input, setInput] = useState({ keyInput: "", password: "" });

  //Google OAuth
  window.onGoogleLibraryLoad = () => {
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.CLIENT_ID,
      // ux_mode: "redirect",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("login-form-google"),
      {
        theme: "outline",
        width: "300px",
        text: "continue_with",
      }
    );
  };

  const handleCallbackResponse = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput({ ...input, [name]: [value] });
  };

  const forgotPassword = () => {};

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
              autoComplete="true"
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
            <div
              id="login-form-google"
              className="login-form-googleclass"
            ></div>
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
