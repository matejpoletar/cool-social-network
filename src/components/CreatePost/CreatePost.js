import React, { useContext, useState, useEffect } from "react";
import Axios from "axios";
import { TextField, Button } from "@mui/material";
import "./CreatePost.css";
import { appContext, appContextDispatch } from "../../AppContext";
import { useNavigate, useParams } from "react-router-dom";

export default function createPost(props) {
  const dispatch = useContext(appContextDispatch);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const appState = useContext(appContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (props.editing) {
      try {
        await Axios.post(`/post/${id}/update`, { title: postTitle, content: postContent, token: appState.user.token });
        dispatch({ type: "flashMessage", data: { message: "Post successfully updated.", status: "success" } });
        navigate(`/post/${id}`);
      } catch {
        dispatch({ type: "flashMessage", data: { message: "Post could not be updated. Please try again later.", status: "error" } });
      }
    } else {
      try {
        const res = await Axios.post("/post", { title: postTitle, content: postContent, token: appState.user.token });
        dispatch({ type: "flashMessage", data: { message: "Post successfully created.", status: "success" } });
        navigate(`/post/${res.data._id}`);
      } catch {
        dispatch({ type: "flashMessage", data: { message: "Post could not be created. Please try again later.", status: "error" } });
      }
    }
  };

  async function fetchPostById() {
    try {
      const res = await Axios.get(`/post/${id}`);

      if (appState.user.username === res.data.author.username) {
        setPostTitle(res.data.title);
        setPostContent(res.data.content);
      } else {
        dispatch({ type: "flashMessage", data: { message: "You don't have permission to edit this post.", status: "error" } });
        navigate("/");
      }
    } catch {
      console.log("Error in fetching post data.");
    }
  }

  useEffect(() => {
    if (props.editing) {
      fetchPostById();
    }
  }, [id]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="create-post">
        <div className="create-post__item">
          Title
          <TextField value={postTitle} onChange={(e) => setPostTitle(e.target.value)} placeholder="Title" variant="outlined" fullWidth />
        </div>
        <div className="create-post__item">
          Content
          <TextField value={postContent} onChange={(e) => setPostContent(e.target.value)} placeholder="Content" multiline rows={8} fullWidth />
        </div>
        <div className="create-post__buttons">
          <Button variant="contained" type="submit">
            Submit
          </Button>
          {props.editing && (
            <Button variant="contained" onClick={fetchPostById}>
              Discard
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
