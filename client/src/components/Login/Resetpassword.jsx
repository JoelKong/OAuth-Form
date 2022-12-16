import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";

export const Resetpassword = () => {
  const [isAllowed, setIsAllowed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id, token } = useParams();

  const sendParams = async () => {
    const getParams = await Axios.get(
      `http://localhost:3001/reset-password/${id}/${token}`
    ).then((res) => {
      if (res.data) {
        setIsAllowed(true);
      }
    });
  };

  const resetPassword = (e) => {
    e.preventDefault();
    setIsLoading(true);
  };

  useEffect(() => {
    sendParams();
  }, []);

  if (isAllowed) {
    return (
      <main className="background">
        <section className="center1">
          <div className="reset-password-form">
            <div className="login-form-header">Reset Password</div>
            <form
              className="login-form-input"
              onSubmit={(e) => resetPassword(e)}
            >
              <label htmlFor="password" className="forget-password-form-label">
                Enter your new password:
              </label>
              <input
                className="forget-password-form-key"
                id="password"
                autoFocus
              />
              <label
                htmlFor="confirmpassword"
                className="reset-password-form-label"
              >
                Re-enter your new password:
              </label>
              <input
                className="forget-password-form-key"
                id="confirmpassword"
              />
              <button
                className="reset-form-button"
                onClick={(e) => resetPassword(e)}
              >
                {isLoading ? (
                  <div className="login-form-button-loader"></div>
                ) : (
                  "Confirm"
                )}
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  } else {
    return <div>Access Denied. Link has expired or invalid user.</div>;
  }
};
