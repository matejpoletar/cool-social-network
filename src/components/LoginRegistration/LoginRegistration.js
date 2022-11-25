import React from "react";
import "./LoginRegistration.css";
import { TextField, Button } from "@mui/material";

export default function LoginRegistration(props) {
  const handleLogin = (e) => {
    e.preventDefault();
    props.setIsLoggedIn(true);
  };

  return (
    <div className="page">
      <h1 className="page__title">Cool Social Network</h1>
      <h3 className="page__subtitle">Sign up for Cool Social Network today.</h3>
      <div className="wrapper">
        <div className="form-container">
          <h2 className="form-container__label">Login</h2>
          <form onSubmit={handleLogin} className="form-container__form">
            <TextField label="Username" variant="filled" required />
            <TextField label="Password" variant="filled" type="password" required />
            <Button variant="contained" type="submit">
              Login
            </Button>
          </form>
        </div>
        <div className="form-container">
          <h2 className="form-container__label">Register</h2>
          <form className="form-container__form">
            <TextField label="Username" variant="filled" required />
            <TextField label="Email" variant="filled" type="email" required />
            <TextField label="Password" variant="filled" type="password" required />
            <Button variant="contained" type="submit">
              Register
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
