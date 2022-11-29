import React, { useContext } from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Page from "../Page/Page";
import "./AppLayout.css";
import FlashMessage from "../FlashMessage/FlashMessage";
import MobileMenu from "../MobileMenu/MobileMenu";
import SearchOverlay from "../SearchOverlay/SearchOverlay";
import { appContext } from "../../AppContext";

export default function AppLayout(props) {
  const context = useContext(appContext);
  return (
    <div className="app-layout">
      <Header />
      <Sidebar />
      <MobileMenu />
      <Page>
        {context.isSearching && <SearchOverlay />}
        <FlashMessage />
        {props.children}
      </Page>
    </div>
  );
}
