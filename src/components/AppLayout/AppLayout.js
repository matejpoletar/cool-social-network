import React from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Page from "../Page/Page";
import "./AppLayout.css";

export default function AppLayout(props) {
  return (
    <div className="app-layout">
      <Header />
      <Sidebar />
      <Page>{props.children}</Page>
    </div>
  );
}
