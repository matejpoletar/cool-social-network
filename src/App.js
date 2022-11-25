import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./components/Home/Home";
import LoginRegistration from "./components/LoginRegistration/LoginRegistration";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      {isLoggedIn ? (
        <>
          <Header setIsLoggedIn={setIsLoggedIn} />
          <Sidebar />
          <Routes>
            <Route path="/dashboard" element={<></>} />
            <Route path="/create-post" element={<></>} />
            <Route path="/settings" element={<></>} />
            <Route path="/" element={<Home />} />
          </Routes>
        </>
      ) : (
        <LoginRegistration setIsLoggedIn={setIsLoggedIn} />
      )}
    </BrowserRouter>
  );
}
