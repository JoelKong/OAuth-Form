import { React, useState } from "react";

export const Login = () => {
  const [input, setInput] = useState({ keyInput: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setInput({ keyInput: "", password: "" });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput({ ...input, [name]: [value] });
  };

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
              value={input.keyInput}
              onChange={(e) => {
                handleChange(e);
              }}
            ></input>
            <input
              className="login-form-password"
              placeholder="Password"
              name="password"
              value={input.password}
              onChange={(e) => {
                handleChange(e);
              }}
            ></input>
            <button className="login-form-button">Log In</button>
            <div className="login-form-option">
              <div className="login-form-line"></div>
              <p>OR</p>
              <div className="login-form-line"></div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};
