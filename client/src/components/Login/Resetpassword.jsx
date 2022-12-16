import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal } from "./Modal";
import Axios from "axios";

export const Resetpassword = () => {
  const [isAllowed, setIsAllowed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alert, setAlert] = useState({ show: false, msg: "" });
  const [newPassword, setNewPassword] = useState({
    password: "",
    confirmpassword: "",
  });
  const { id, token } = useParams();
  const navigate = useNavigate();

  const sendParams = async () => {
    const getParams = await Axios.get(
      `http://localhost:3001/reset-password/${id}/${token}`
    ).then((res) => {
      if (res.data) {
        setIsAllowed(true);
      }
    });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setNewPassword({ ...newPassword, [name]: value });
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    //Check Empty
    if (!newPassword.password || !newPassword.confirmpassword) {
      setAlert({ show: true, msg: "Invalid Fields" });
      setIsLoading(false);
      return;
    }

    //Check Same
    if (newPassword.password !== newPassword.confirmpassword) {
      setAlert({ show: true, msg: "Passwords Not Identical" });
      setIsLoading(false);
      return;
    }

    //Regex + Axios if success
    const regEx = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
    );
    if (regEx.test(newPassword.password)) {
      const resetPassword = await Axios.post(
        `http://localhost:3001/reset-password/${id}/${token}`,
        { password: newPassword.password }
      );
      if (resetPassword.data) {
        setIsLoading(false);
        setIsSuccess(true);
      } else {
        setIsLoading(false);
        setAlert({ show: true, msg: "Please Try Again" });
      }
    } else {
      setAlert({ show: true, msg: "Weak Password" });
      setIsLoading(false);
      return;
    }
  };

  useEffect(() => {
    sendParams();
  }, []);

  if (isAllowed && !isSuccess) {
    return (
      <main className="background">
        <section className="center1">
          <div className="reset-password-form">
            {alert.show && <Modal alert={alert} />}
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
                type="password"
                id="password"
                value={newPassword.password}
                name="password"
                onChange={(e) => handleChange(e)}
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
                type="password"
                id="confirmpassword"
                value={newPassword.confirmpassword}
                name="confirmpassword"
                onChange={(e) => handleChange(e)}
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
  } else if (isSuccess) {
    return (
      <main className="background">
        <section className="center1">
          <div className="reset-password-form">
            <div className="login-form-header">Password Reset Successful</div>
            <button
              className="reset-form-button-success"
              onClick={() => navigate("/")}
            >
              Go Back To Log In
            </button>
          </div>
        </section>
      </main>
    );
  } else {
    return <div>Access Denied. Link has expired or invalid user.</div>;
  }
};
