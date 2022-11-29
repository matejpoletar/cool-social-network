import React, { useContext, useState, useEffect } from "react";
import { appContext } from "../../AppContext";
import Axios from "axios";
import Loading from "../Loading/Loading";
import { Link, useParams } from "react-router-dom";
import formatDate from "../../assets/scripts/formatDate";
import ReactMarkdown from "react-markdown";
import "./PostsList.css";

export default function PostsList() {
  const context = useContext(appContext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { username } = useParams();

  useEffect(() => {
    async function fetchAllUserPosts() {
      try {
        const res = await Axios.post(`/profile/${username}/posts`, { token: context.user.token });
        setPosts(res.data);
        setIsLoading(false);
      } catch {
        console.log("Error in fetching post data.");
      }
    }
    fetchAllUserPosts();
  }, [username]);

  const trimContent = (text) => {
    return text
      .split(/(?=\s)/gi)
      .slice(0, 15)
      .join("");
  };

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <div className="posts-list">
        {posts.map((post, index) => {
          return (
            <div key={index} className="posts-list__item">
              <div className="posts-list__item__title">
                <h3>{post.title}</h3>
              </div>
              <div className="posts-list__item__info">
                <span>Posted on {formatDate(new Date(post.createdAt))}</span>
              </div>
              <div className="posts-list__item__content">
                <ReactMarkdown children={trimContent(post.content) + "..."} />
              </div>
              <div className="posts-list__item__read-more">
                <Link to={`/post/${post._id}`}>Read more...</Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
