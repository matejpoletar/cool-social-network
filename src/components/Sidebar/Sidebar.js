import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { appContext } from "../../AppContext";

export default function Sidebar() {
  const context = useContext(appContext);

  const [activeIndex, setActiveIndex] = useState(-1);
  const location = useLocation();

  const sidebarNavItems = [
    {
      display: "Home",
      icon: <HomeIcon />,
      to: "/",
      section: "home",
    },
    {
      display: "Profile",
      icon: <PersonIcon />,
      to: `/profile/${context.user.username}`,
      section: "profile",
    },
    {
      display: "New Post",
      icon: <PostAddIcon />,
      to: "/create-post",
      section: "create-post",
    },
    {
      display: "Settings",
      icon: <SettingsIcon />,
      to: "/settings",
      section: "settings",
    },
  ];

  useEffect(() => {
    const currentPath = location.pathname.split("/")[1];
    const activeItem = sidebarNavItems.findIndex((item) => item.section === currentPath);
    setActiveIndex(currentPath.length === 0 ? 0 : activeItem);
  }, [location]);

  return (
    <div className="sidebar">
      <div className="sidebar__menu">
        {sidebarNavItems.map((item, index) => (
          <Link to={item.to} key={index}>
            <div className={`sidebar__menu__item ${activeIndex === index ? "sidebar__menu__item--active" : ""}`}>
              <div className="sidebar__menu__item__icon">{item.icon}</div>
              <div className="sidebar__menu__item__text">{item.display}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
