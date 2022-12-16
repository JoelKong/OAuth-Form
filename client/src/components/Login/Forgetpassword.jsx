import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

export const Forgetpassword = () => {
  //States
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendLink = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const regEx = new RegExp(
      /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,8}(.[a-z{2,8}])?/g
    );
    if (regEx.test(email)) {
      const isRegistered = await Axios.post(
        "http://localhost:3001/checkregistered",
        { email: email }
      );
      if (isRegistered.data) {
        setIsSubmit(true);
        setMessage("Link Successfully Sent! Check your email.");
      } else {
        setIsSubmit(false);
        setIsLoading(false);
        setMessage("Email not Registered");
      }
    } else {
      setIsSubmit(false);
      setIsLoading(false);
      setMessage("Invalid Email");
    }
  };

  return (
    <main className="background">
      <section className="center1">
        <div className="forget-password-form">
          <div className="login-form-header">Forgot Password?</div>
          <form className="login-form-input" onSubmit={(e) => sendLink(e)}>
            <p
              className={
                isSubmit
                  ? "forget-password-form-success"
                  : "forget-password-form-error"
              }
            >
              {message}
            </p>

            <label htmlFor="email" className="forget-password-form-label">
              Enter your Email for a Reset Link:
            </label>
            <input
              className="forget-password-form-key"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              autoFocus
            />
            <button className="login-form-button" onClick={(e) => sendLink(e)}>
              {isLoading ? (
                <div className="login-form-button-loader"></div>
              ) : (
                "Send Link"
              )}
            </button>
            <a
              className="login-form-signup forget-password-form-back"
              draggable="true"
              onClick={() => navigate("/")}
            >
              Back to Log In
            </a>
          </form>
        </div>
      </section>
    </main>
  );
};
