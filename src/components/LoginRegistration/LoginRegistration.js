import React, { useContext, useState, useEffect } from "react";
import Axios from "axios";
import "./LoginRegistration.css";
import { TextField, Button } from "@mui/material";
import SouthEastIcon from "@mui/icons-material/SouthEast";
import { appContextDispatch } from "../../AppContext";
import { useImmerReducer } from "use-immer";
import Loading from "../Loading/Loading";

export default function LoginRegistration(props) {
  const appDispatch = useContext(appContextDispatch);

  const loginInitialState = {
    username: {
      value: "",
      hasError: false,
      message: "",
    },
    password: {
      value: "",
      hasError: false,
      message: "",
    },
  };

  const registerInitialState = {
    username: {
      value: "",
      hasError: false,
      message: "",
      checkCounter: 0,
      isUnique: false,
    },
    password: {
      value: "",
      hasError: false,
      message: "",
    },
    email: {
      value: "",
      hasError: false,
      message: "",
    },
  };

  const [isLoading, setIsLoading] = useState(false);

  function reducerLogin(state, action) {
    switch (action.type) {
      case "usernameImmediateChange":
        state.username.value = action.value;
        break;
      case "passwordImmediateChange":
        state.password.value = action.value;
        break;
      case "usernameOnLogin":
        state.username.hasError = false;
        state.username.message = "";
        state.password.hasError = false;
        state.password.message = "";
        if (action.value) {
          state.username.hasError = true;
          state.username.message = "Username does not exist.";
        }
        break;
      case "passwordOnLogin":
        state.username.hasError = false;
        state.username.message = "";
        state.password.hasError = false;
        state.password.message = "";
        if (action.value) {
          state.password.hasError = true;
          state.password.message = "Wrong password.";
        }
        break;
    }
  }

  function reducerRegister(state, action) {
    const message = "This is a mandatory field.";

    switch (action.type) {
      case "usernameImmediateChange":
        state.username.value = action.value;
        state.username.hasError = false;
        state.username.message = "";
        if (state.username.value.length > 30) {
          state.username.hasError = true;
          state.username.message = "Username cannot be longer than 30 characters.";
        }
        if (!/^[A-Za-z0-9 ]*$/.test(state.username.value)) {
          state.username.hasError = true;
          state.username.message = "Username can contain only letters and numbers.";
        }
        break;
      case "usernameAfterDelay":
        if (state.username.value.length < 3) {
          state.username.hasError = true;
          state.username.message = "Username must be at least 3 characters long.";
        }
        if (!state.username.hasError) {
          state.username.checkCounter++;
        }
        break;
      case "usernameAfterAxiosRequest":
        state.username.isUnique = !action.value;
        if (state.username.isUnique) {
          state.username.hasError = false;
          state.username.message = "";
        } else {
          state.username.hasError = true;
          state.username.message = "This username is already in use.";
        }
        break;

      case "emailImmediateChange":
        state.email.value = action.value.toLowerCase();
        state.email.hasError = false;
        state.email.message = "";
        break;
      case "emailAfterDelay":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.value)) {
          state.email.hasError = true;
          state.email.message = "This is not a valid email address.";
        }
        if (!state.email.hasError) {
          state.email.checkCounter++;
        }
        break;
      case "emailOnSubmit":
        if (action.value) {
          state.email.hasError = true;
          state.email.message = "User with this email is already registered.";
        }
        break;

      case "passwordImmediateChange":
        state.password.value = action.value;
        state.password.hasError = false;
        state.password.message = "";
        if (state.password.value.length > 30) {
          state.password.hasError = true;
          state.password.message = "Password cannot be longer than 30 characters.";
        }
        break;
      case "passwordAfterDelay":
        if (state.password.value.length < 8) {
          state.password.hasError = true;
          state.password.message = "Password must be at least 8 characters long.";
        }
        break;

      case "onRegister":
        if (!state.username.value.trim().length) {
          state.username.hasError = true;
          state.username.message = message;
        }
        if (!state.email.value.trim().length) {
          state.email.hasError = true;
          state.email.message = message;
        }
        if (!state.password.value.trim().length) {
          state.password.hasError = true;
          state.password.message = message;
        }
        break;
    }
  }

  const [stateLogin, dispatchLogin] = useImmerReducer(reducerLogin, loginInitialState);
  const [stateRegister, dispatchRegister] = useImmerReducer(reducerRegister, registerInitialState);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await Axios.post("/check-username", { username: stateLogin.username.value });
    if (res.data) {
      try {
        const response = await Axios.post("/login", { username: stateLogin.username.value, password: stateLogin.password.value });
        setIsLoading(false);
        if (response.data.user) {
          appDispatch({
            type: "login",
            data: {
              username: response.data.user.username,
              email: response.data.user.email,
              registeredAt: response.data.user.createdAt,
              token: response.data.token,
              avatar: response.data.user.profileImgUrl ? response.data.user.profileImgUrl : "",
            },
          });
        } else {
          dispatchLogin({ type: "passwordOnLogin", value: true });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      dispatchLogin({ type: "usernameOnLogin", value: true });
    }
    setIsLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const res = await Axios.post("/check-email", { email: stateRegister.email.value });
    dispatchRegister({ type: "emailOnSubmit", value: res.data });

    dispatchRegister({ type: "onRegister" });

    if (!stateRegister.username.hasError && !stateRegister.email.hasError && !stateRegister.password.hasError) {
      try {
        const response = await Axios.post("/register", { username: stateRegister.username.value, password: stateRegister.password.value, email: stateRegister.email.value });
        console.log(response);
        appDispatch({
          type: "login",
          data: {
            username: response.data.user.username,
            email: response.data.user.email,
            registeredAt: response.data.user.createdAt,
            token: response.data.token,
            avatar: "",
          },
        });
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (stateRegister.username.value.trim()) {
      const delay = setTimeout(() => dispatchRegister({ type: "usernameAfterDelay" }), 700);
      return () => clearTimeout(delay);
    }
  }, [stateRegister.username.value]);

  useEffect(() => {
    if (stateRegister.username.checkCounter) {
      const checkIfUsernameAlreadyExists = async () => {
        try {
          const res = await Axios.post("/check-username", { username: stateRegister.username.value });
          dispatchRegister({ type: "usernameAfterAxiosRequest", value: res.data });
        } catch (e) {
          console.log("There was a problem with check request.");
        }
      };
      checkIfUsernameAlreadyExists();
    }
  }, [stateRegister.username.checkCounter]);

  useEffect(() => {
    if (stateRegister.email.value.trim()) {
      const delay = setTimeout(() => dispatchRegister({ type: "emailAfterDelay" }), 2500);
      return () => clearTimeout(delay);
    }
  }, [stateRegister.email.value]);

  useEffect(() => {
    if (stateRegister.password.value) {
      const delay = setTimeout(() => dispatchRegister({ type: "passwordAfterDelay" }), 1200);
      return () => clearTimeout(delay);
    }
  }, [stateRegister.password.value]);

  const [isRegistrationActive, setIsRegistrationActive] = useState(false);

  return (
    <div className="login-page">
      {isLoading && <Loading />}
      <h1 className="login-page__title">Cool Social Network</h1>
      <p className="login-page__subtitle">Not yet registered? Sign up for Cool Social Network today.</p>
      <div className="login-page__registration-link">
        <SouthEastIcon />
        <button onClick={() => setIsRegistrationActive(!isRegistrationActive)}>{isRegistrationActive ? "Back to Login" : "Register here"}</button>
      </div>

      <div className="wrapper">
        <div className={`form-container form-container--login ${isRegistrationActive ? "form-container--hidden-mobile" : ""}`}>
          <h2 className="form-container__label">Login</h2>
          <form onSubmit={handleLogin} className="form-container__form">
            <TextField onChange={(e) => dispatchLogin({ type: "usernameImmediateChange", value: e.target.value })} label="Username" variant="filled" error={stateLogin.username.hasError} helperText={stateLogin.username.message} />
            <TextField onChange={(e) => dispatchLogin({ type: "passwordImmediateChange", value: e.target.value })} label="Password" variant="filled" type="password" error={stateLogin.password.hasError} helperText={stateLogin.password.message} />
            <Button variant="contained" type="submit">
              Login
            </Button>
          </form>
        </div>
        <div className={`form-container form-container--register ${!isRegistrationActive ? "form-container--hidden-mobile" : ""}`}>
          <h2 className="form-container__label">Register</h2>
          <form onSubmit={handleRegister} className="form-container__form">
            <TextField onChange={(e) => dispatchRegister({ type: "usernameImmediateChange", value: e.target.value })} label="Username" variant="filled" error={stateRegister.username.hasError} helperText={stateRegister.username.message} />
            <TextField onChange={(e) => dispatchRegister({ type: "emailImmediateChange", value: e.target.value })} label="Email" variant="filled" type="email" error={stateRegister.email.hasError} helperText={stateRegister.email.message} />
            <TextField onChange={(e) => dispatchRegister({ type: "passwordImmediateChange", value: e.target.value })} label="Password" variant="filled" type="password" error={stateRegister.password.hasError} helperText={stateRegister.password.message} />
            <Button variant="contained" type="submit">
              Register
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
