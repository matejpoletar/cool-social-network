import React from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Page from "../Page/Page";
import "./AppLayout.css";
import FlashMessage from "../FlashMessage/FlashMessage";
import MobileMenu from "../MobileMenu/MobileMenu";

export default function AppLayout(props) {
  return (
    <div className="app-layout">
      <Header />
      <Sidebar />
      <MobileMenu />
      {
        <Page>
          <FlashMessage />
          <div className="page-wrapper">{props.children}</div>
        </Page>
      }
    </div>
  );
}
