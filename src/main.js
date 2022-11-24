import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.css";

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<App />);

if (module.hot) {
  module.hot.accept();
}
