import React, { useReducer, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { appContext, appContextDispatch } from "./AppContext";
import { useImmerReducer } from "use-immer";

import Home from "./components/Home/Home";
import CreatePost from "./components/CreatePost/CreatePost";
import LoginRegistration from "./components/LoginRegistration/LoginRegistration";
import AppLayout from "./components/AppLayout/AppLayout";
import Post from "./components/Post/Post";
import Profile from "./components/Profile/Profile";

export default function App() {
  const initialState = {
    isLoggedIn: Boolean(localStorage.getItem("coolSocialNetworkUsername")),
    user: {
      username: localStorage.getItem("coolSocialNetworkUsername"),
      token: localStorage.getItem("coolSocialNetworkToken"),
    },
    flashMessages: [],
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "login":
        state.isLoggedIn = true;
        state.user.username = action.data.username;
        state.user.token = action.data.token;
        break;
      case "logout":
        state.isLoggedIn = false;
        state.user = {};
        break;
      case "flashMessage":
        state.flashMessages.push(action.data);
        break;
    }
  };

  const [state, dispatch] = useImmerReducer(reducer, initialState);

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
            <AppLayout>
              <Routes>
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/post/:id" element={<Post />} />
                <Route path="/post/:id/edit" element={<CreatePost editing />} />
                <Route path="/settings" element={<></>} />
                <Route path="/" element={<Home />} />
              </Routes>
            </AppLayout>
          ) : (
            <LoginRegistration />
          )}
        </BrowserRouter>
      </appContextDispatch.Provider>
    </appContext.Provider>
  );
}
