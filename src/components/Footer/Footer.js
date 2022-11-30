import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      {" "}
      <small>
        <p>&copy; Copyright {new Date().getFullYear()}. All rights reserved </p>
      </small>{" "}
    </footer>
  );
}
