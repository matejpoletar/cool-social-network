import React, { useState } from "react";
import Axios from "axios";
import "./LoginRegistration.css";
import { TextField, Button } from "@mui/material";

export default function LoginRegistration(props) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post("/login", { username, password });
      console.log(response);
      props.setIsLoggedIn(true);
      props.setUsername(username);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post("/register", { username, password, email });
      console.log(response);
      props.setIsLoggedIn(true);
      props.setUsername(username);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="page">
      <h1 className="page__title">Cool Social Network</h1>
      <h3 className="page__subtitle">Sign up for Cool Social Network today.</h3>
      <div className="wrapper">
        <div className="form-container">
          <h2 className="form-container__label">Login</h2>
          <form onSubmit={handleLogin} className="form-container__form">
            <TextField onChange={(e) => setUsername(e.target.value)} label="Username" variant="filled" required />
            <TextField onChange={(e) => setPassword(e.target.value)} label="Password" variant="filled" type="password" required />
            <Button variant="contained" type="submit">
              Login
            </Button>
          </form>
        </div>
        <div className="form-container">
          <h2 className="form-container__label">Register</h2>
          <form onSubmit={handleRegister} className="form-container__form">
            <TextField onChange={(e) => setUsername(e.target.value)} label="Username" variant="filled" required />
            <TextField onChange={(e) => setEmail(e.target.value)} label="Email" variant="filled" type="email" required />
            <TextField onChange={(e) => setPassword(e.target.value)} label="Password" variant="filled" type="password" required />
            <Button variant="contained" type="submit">
              Register
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
