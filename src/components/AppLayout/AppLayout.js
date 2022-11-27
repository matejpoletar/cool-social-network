import React from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Page from "../Page/Page";
import "./AppLayout.css";
import FlashMessage from "../FlashMessage/FlashMessage";

export default function AppLayout(props) {
  return (
    <div className="app-layout">
      <Header />
      <Sidebar />
      <Page>
        <FlashMessage />
        <div className="page-wrapper">{props.children}</div>
      </Page>
    </div>
  );
}
