import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center">
      <h2>Whoops, we could not find that page.</h2>
      <p className="lead text-muted">
        {" "}
        Please visit <Link to="/">homepage</Link>
      </p>
    </div>
  );
}
