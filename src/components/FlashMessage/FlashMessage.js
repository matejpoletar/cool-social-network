import React, { useContext } from "react";
import Alert from "@mui/material/Alert";
import { appContext } from "../../AppContext";
import "./FlashMessage.css";

export default function FlashMessage() {
  const context = useContext(appContext);
  return (
    <>
      {context.flashMessages.map((data, index) => {
        return (
          <div className="flash-message">
            <Alert key={index} severity={data.status}>
              {data.message}
            </Alert>
          </div>
        );
      })}
    </>
  );
}
