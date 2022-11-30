import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./main.css";
import Axios from "axios";

Axios.defaults.baseURL = process.env.BACKENDURL || "https://coolsocialnetworkbackend.onrender.com";

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<App />);

if (module.hot) {
  module.hot.accept();
}
