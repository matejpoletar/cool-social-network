import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.css";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

Axios.defaults.baseURL = "http://localhost:8080";

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<App />);

if (module.hot) {
  module.hot.accept();
}
