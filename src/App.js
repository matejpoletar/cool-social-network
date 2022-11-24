import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./components/Home/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Sidebar />
      <Routes>
        <Route path="/dashboard" element={<></>} />
        <Route path="/create-post" element={<></>} />
        <Route path="/settings" element={<></>} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
