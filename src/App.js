import React, { useReducer, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./components/Home/Home";
import LoginRegistration from "./components/LoginRegistration/LoginRegistration";
import { appContext, appContextDispatch } from "./AppContext";

export default function App() {
  const initialState = {
    isLoggedIn: Boolean(localStorage.getItem("coolSocialNetworkUsername")),
    user: {
      username: localStorage.getItem("coolSocialNetworkUsername"),
      token: localStorage.getItem("coolSocialNetworkToken"),
    },
  };

  const reducer = (prevState, action) => {
    switch (action.type) {
      case "login":
        return { ...prevState, isLoggedIn: true, user: { username: action.data.username, token: action.data.token } };
      case "logout":
        return { ...prevState, isLoggedIn: false, user: {} };
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.isLoggedIn) {
      localStorage.setItem("coolSocialNetworkUsername", state.user.username);
      localStorage.setItem("coolSocialNetworkToken", state.user.token);
    } else {
      localStorage.removeItem("coolSocialNetworkUsername");
      localStorage.removeItem("coolSocialNetworkToken");
    }
  }, [state.isLoggedIn]);

  return (
    <appContext.Provider value={state}>
      <appContextDispatch.Provider value={dispatch}>
        <BrowserRouter>
          {state.isLoggedIn ? (
            <>
              <Header />
              <Sidebar />
              <Routes>
                <Route path="/dashboard" element={<></>} />
                <Route path="/create-post" element={<></>} />
                <Route path="/settings" element={<></>} />
                <Route path="/" element={<Home />} />
              </Routes>
            </>
          ) : (
            <LoginRegistration />
          )}
        </BrowserRouter>
      </appContextDispatch.Provider>
    </appContext.Provider>
  );
}
