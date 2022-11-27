import React, { useContext, useState, useEffect } from "react";
import "./Header.css";
import { Avatar, TextField, Button, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { deepOrange } from "@mui/material/colors";
import { appContext, appContextDispatch } from "../../AppContext";
import Axios from "axios";
import arrayBufferToBase64 from "../../assets/scripts/formatImage";
import { Link } from "react-router-dom";

export default function Header(props) {
  const context = useContext(appContext);
  const dispatch = useContext(appContextDispatch);
  const [avatar, setAvatar] = useState();

  const handleLogout = () => {
    dispatch({ type: "logout" });
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await Axios.post(`/profile/${context.user.username}`, { token: context.user.token });
        if (res.data.avatar) {
          setAvatar(res.data.avatar.data);
        } else {
        }
      } catch {
        console.log("Error in fetching user data.");
      }
    }
    fetchUserData();
  }, []);

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
        <Link to={`/profile/${context.user.username}`}>
          <Avatar alt={context.user.username} src={avatar ? arrayBufferToBase64(avatar) : "/"} sx={{ bgcolor: deepOrange[500] }} />
        </Link>
        <Button onClick={handleLogout} variant="contained" color="error">
          Logout
        </Button>
      </div>
    </header>
  );
}
