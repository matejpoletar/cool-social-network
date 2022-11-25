import React, { useContext } from "react";
import "./Header.css";
import { Avatar, TextField, Button, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { appContext, appContextDispatch } from "../../AppContext";

export default function Header(props) {
  const context = useContext(appContext);
  const dispatch = useContext(appContextDispatch);

  const handleLogout = () => {
    dispatch({ type: "logout" });
  };

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
        />
      </div>
      <div className="header__user-area">
        <span>Welcome {context.user.username}!</span>
        <Avatar />
        <Button onClick={handleLogout} variant="contained" color="error">
          Logout
        </Button>
      </div>
    </header>
  );
}
