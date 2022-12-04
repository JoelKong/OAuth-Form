import React from "react";

export const Login = () => {
  return (
    <main className="background">
      <section className="center">
        <div className="login-form">
          <div className="login-form-header">Log In</div>
          <form className="login-form-input">
            <input
              className="login-form-key"
              placeholder="Phone number, username or email"
            ></input>
            <input
              className="login-form-password"
              placeholder="Password"
            ></input>
          </form>
        </div>
      </section>
    </main>
  );
};
