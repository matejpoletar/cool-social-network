import React, { useContext, useState } from "react";
import Axios from "axios";
import { TextField, Button } from "@mui/material";
import "./CreatePost.css";
import { appContext } from "../../AppContext";
import { useNavigate } from "react-router-dom";

export default function createPost() {
  const [postTitle, setPostTitle] = useState();
  const [postContent, setPostContent] = useState();
  const appState = useContext(appContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await Axios.post("/post", { title: postTitle, content: postContent, token: appState.user.token });
      navigate(`/post/${res.data._id}`);
      console.log("New post was created.");
    } catch (e) {
      console.log("Error creating post.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="create-post">
        <div className="create-post__item">
          Title
          <TextField onChange={(e) => setPostTitle(e.target.value)} placeholder="Title" variant="outlined" fullWidth />
        </div>
        <div className="create-post__item">
          Content
          <TextField onChange={(e) => setPostContent(e.target.value)} placeholder="Content" multiline rows={8} fullWidth />
        </div>
        <div className="create-post__button">
          <Button variant="contained" type="submit">
            SUBMIT
          </Button>
        </div>
      </div>
    </form>
  );
}
