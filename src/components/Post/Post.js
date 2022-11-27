import React, { useContext, useState, useEffect } from "react";
import "./Post.css";
import ReactMarkdown from "react-markdown";
import { appContext, appContextDispatch } from "../../AppContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import formatDate from "../../assets/scripts/commonFunctions";
import Axios from "axios";
import { Avatar, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Loading from "../Loading/Loading";

export default function Post() {
  const context = useContext(appContext);
  const dispatch = useContext(appContextDispatch);
  const [postData, setPostData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPostById() {
      try {
        const res = await Axios.get(`/post/${id}`);
        setPostData(res.data);
        setIsLoading(false);
      } catch {
        console.log("Error in fetching post data.");
      }
    }
    fetchPostById();
  }, [id]);

  async function deleteHandler() {
    const areYouSure = window.confirm("Do you really want to delete this post?");
    if (areYouSure) {
      try {
        const res = await Axios.delete(`/post/${id}/delete`, { data: { token: context.user.token } });
        if (res.data == "Success") {
          dispatch({ type: "flashMessage", data: { message: "Post has been deleted.", status: "info" } });
          navigate("/");
        }
      } catch {
        dispatch({ type: "flashMessage", data: { message: "Post can't be deleted.", status: "error" } });
      }
    }
  }
  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <div className="post">
        <div className="post__title">
          <h2 className="post__title__heading">{postData.title}</h2>
          {context.user.username === postData.author.username && (
            <div className="post__buttons">
              <Button onClick={() => navigate(`/post/${id}/edit`)} variant="outlined" startIcon={<EditIcon />}>
                Edit
              </Button>
              <Button onClick={deleteHandler} variant="contained" color="error" startIcon={<DeleteIcon />}>
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="post__info">
          <Link to={`/profile/${postData.author.username}`}>
            <Avatar alt={context.user.username} src="/" sx={{ bgcolor: "orange", width: 34, height: 34 }} />
          </Link>
          <span className="post__info__text">
            Posted by <Link to={`/profile/${postData.author.username}`}>{postData.author.username}</Link> on {formatDate(new Date(postData.createdAt))}
          </span>
        </div>
        <div className="post__content">
          <ReactMarkdown children={postData.content} />
        </div>
      </div>
    );
  }
}
