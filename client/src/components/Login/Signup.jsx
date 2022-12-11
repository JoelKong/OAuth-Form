import { React, useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import Axios from "axios";
import { Login } from "./Login";

export const Signup = () => {
  //States
  const [input, setInput] = useState({
    keyInput: "",
    fullName: "",
    userName: "",
    password: "",
  });
  const [isLogIn, setIsLogIn] = useState(false);
  const [disable, setDisable] = useState(true);
  const [passConditions, setPassConditions] = useState({
    keyInput: false,
    userName: false,
    password: false,
  });

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

  //Email Validation
  const emailValidation = () => {
    const email = input.keyInput[0];
    const regEx = new RegExp(
      /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,8}(.[a-z{2,8}])?/g
    );
    if (regEx.test(email)) {
      setPassConditions({ ...passConditions, keyInput: true });
    } else if (!regEx.test(email) && email !== "") {
      setPassConditions({ ...passConditions, keyInput: false });
    }
  };

  //Username Validation
  const userNameValidation = () => {
    const userName = input.userName[0];
    const regEx = new RegExp(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/);
    if (regEx.test(userName)) {
      setPassConditions({ ...passConditions, userName: true });
    } else if (!regEx.test(userName) && userName !== "") {
      setPassConditions({ ...passConditions, userName: false });
    }
  };

  //Password Validation
  const passwordValidation = () => {
    const password = input.password[0];
    const regEx = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
    );
    if (regEx.test(password)) {
      setPassConditions({ ...passConditions, password: true });
    } else if (!regEx.test(password) && password !== "") {
      setPassConditions({ ...passConditions, password: false });
    }
  };

  //Validate all
  const validateAll = () => {
    if (input.fullName === "") {
      return;
    }
    emailValidation();
    userNameValidation();
    passwordValidation();

    console.log(passConditions);
  };

  useEffect(() => {
    //Check whether input is present
    if (
      input.keyInput[0] &&
      input.fullName[0] &&
      input.userName[0] &&
      input.password[0]
    ) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [input]);

  if (isLogIn) {
    return <Login />;
  }

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
              placeholder="Email"
              maxLength="40"
              value={input.keyInput}
              onChange={(e) => {
                handleChange(e);
              }}
            />
            <input
              autoComplete="true"
              className="login-form-password"
              name="fullName"
              placeholder="Full Name"
              maxLength="30"
              value={input.fullName}
              onChange={(e) => {
                handleChange(e);
              }}
            />
            <input
              autoComplete="true"
              className="login-form-password"
              name="userName"
              placeholder="Username"
              maxLength="20"
              value={input.userName}
              onChange={(e) => {
                handleChange(e);
              }}
            />
            <input
              autoComplete="true"
              className="login-form-password"
              type="password"
              name="password"
              placeholder="Password"
              maxLength="20"
              value={input.password}
              onChange={(e) => {
                handleChange(e);
              }}
            />
            <button
              disabled={disable}
              className="login-form-button"
              onClick={() => validateAll()}
            >
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
                onClick={() => setIsLogIn(true)}
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
