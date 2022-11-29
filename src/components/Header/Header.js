import React, { useContext, useEffect, useState } from "react";
import "./Header.css";
import { Avatar, TextField, Button, InputAdornment, Menu, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { deepOrange } from "@mui/material/colors";
import { appContext, appContextDispatch } from "../../AppContext";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const context = useContext(appContext);
  const dispatch = useContext(appContextDispatch);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "logout" });
    navigate("/");
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm.length) {
      dispatch({ type: "searchOpen" });
    } else {
      dispatch({ type: "searchClose" });
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm.length) {
        dispatch({ type: "searchAfterDelay", data: searchTerm });
      }
    }, 2000);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  return (
    <header className="header">
      <h2 className="header__title">Cool Social Network</h2>
      <div className="header__searchbar">
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          id="outlined-basic"
          variant="outlined"
          label="Search"
          size="small"
          fullWidth
          placeholder="Search for posts and people"
          onChange={handleSearch}
        />
      </div>
      <div className="header__user-area">
        <span>Welcome {context.user.username}!</span>
        <Link to={`/profile/${context.user.username}`}>
          <Avatar alt={context.user.username} src={context.user.avatar} sx={{ bgcolor: deepOrange[500] }} />
        </Link>
        <Button onClick={handleLogout} variant="contained" color="error">
          Logout
        </Button>
      </div>
    </header>
  );
}
