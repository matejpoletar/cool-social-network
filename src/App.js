import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { appContext, appContextDispatch } from "./AppContext";
import { useImmerReducer } from "use-immer";
import Axios from "axios";

import Home from "./components/Home/Home";
import CreatePost from "./components/CreatePost/CreatePost";
import LoginRegistration from "./components/LoginRegistration/LoginRegistration";
import AppLayout from "./components/AppLayout/AppLayout";
import Post from "./components/Post/Post";
import Profile from "./components/Profile/Profile";
import Settings from "./components/Settings/Settings";

export default function App() {
  const initialState = {
    isLoggedIn: Boolean(localStorage.getItem("coolSocialNetworkUsername")),
    user: {
      username: localStorage.getItem("coolSocialNetworkUsername"),
      email: localStorage.getItem("coolSocialNetworkEmail"),
      registeredAt: localStorage.getItem("coolSocialNetworkRegisteredAt"),
      token: localStorage.getItem("coolSocialNetworkToken"),
      avatar: localStorage.getItem("coolSocialNetworkAvatar"),
    },
    flashMessages: [],
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "login":
        state.isLoggedIn = true;
        state.user.username = action.data.username;
        state.user.token = action.data.token;
        state.user.email = action.data.email;
        state.user.registeredAt = action.data.registeredAt;
        state.user.avatar = action.data.avatar ? action.data.avatar : "";
        break;
      case "logout":
        state.isLoggedIn = false;
        state.user = {};
        break;
      case "flashMessage":
        state.flashMessages.push(action.data);
        break;
      case "setAvatar":
        state.user.avatar = action.data;
        localStorage.setItem("coolSocialNetworkAvatar", action.data);
        break;
    }
  };

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    if (state.isLoggedIn) {
      localStorage.setItem("coolSocialNetworkUsername", state.user.username);
      localStorage.setItem("coolSocialNetworkToken", state.user.token);
      localStorage.setItem("coolSocialNetworkEmail", state.user.email);
      localStorage.setItem("coolSocialNetworkRegisteredAt", state.user.registeredAt);
      localStorage.setItem("coolSocialNetworkAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("coolSocialNetworkUsername");
      localStorage.removeItem("coolSocialNetworkToken");
      localStorage.removeItem("coolSocialNetworkEmail");
      localStorage.removeItem("coolSocialNetworkRegisteredAt");
      localStorage.removeItem("coolSocialNetworkAvatar");
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
                <Route path="/settings" element={<Settings />} />
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
