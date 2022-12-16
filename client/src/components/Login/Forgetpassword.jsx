import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Forgetpassword = () => {
  //States
  const [isSubmit, setIsSubmit] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendLink = (e) => {
    e.preventDefault();
    setIsSubmit(true);
  };

  return (
    <main className="background">
      <section className="center1">
        <div className="forget-password-form">
          <div className="login-form-header">Forgot Password?</div>
          <form className="login-form-input" onSubmit={(e) => sendLink(e)}>
            {isSubmit && (
              <p className="forget-password-form-linksent">
                Link Successfully Sent! Check your email.
              </p>
            )}
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
              Send Link
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
