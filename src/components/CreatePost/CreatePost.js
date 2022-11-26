import React, { useContext, useState, useEffect } from "react";
import Axios from "axios";
import { TextField, Button } from "@mui/material";
import "./CreatePost.css";
import { appContext } from "../../AppContext";
import { useNavigate, useParams } from "react-router-dom";

export default function createPost(props) {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const appState = useContext(appContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const request = props.editing ? `/post/${id}/update` : "/post";
    try {
      const res = await Axios.post(request, { title: postTitle, content: postContent, token: appState.user.token });
      navigate(props.editing ? `/post/${id}` : `/post/${res.data._id}`);
      console.log("New post was created.");
    } catch (e) {
      console.log("Error creating post.");
    }
  };

  async function fetchPostById() {
    try {
      const res = await Axios.get(`/post/${id}`);
      setPostTitle(res.data.title);
      setPostContent(res.data.content);
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
            SUBMIT
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
