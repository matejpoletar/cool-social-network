import React, { useContext, useState, useEffect } from "react";
import { appContext } from "../../AppContext";
import Axios from "axios";
import Loading from "../Loading/Loading";
import { Link, useParams } from "react-router-dom";
import formatDate from "../../assets/scripts/formatDate";
import ReactMarkdown from "react-markdown";
import "./Home.css";
import { Avatar } from "@mui/material";

export default function Home() {
  const context = useContext(appContext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAllUserPosts() {
      try {
        const res = await Axios.post(`/home`, { token: context.user.token });
        setPosts(res.data);
        setIsLoading(false);
      } catch {
        console.log("Error in fetching feed.");
      }
    }
    fetchAllUserPosts();
  }, []);

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
      <>
        <h2 className="home__heading">See the latest posts of users you are following</h2>
        <div className="posts-list">
          {posts.length === 0 && <p>You don't follow anyone yet. Follow other users to see their latest posts here.</p>}
          {posts.map((post, index) => {
            return (
              <div key={index} className="posts-list__item">
                <div className="posts-list__item__title">
                  <Link to={`/profile/${post.author.username}`}>
                    <Avatar alt={post.author.username} src={post.author.avatar} sx={{ bgcolor: "orange", width: 34, height: 34 }} />
                  </Link>
                  <h3>{post.title}</h3>
                </div>
                <div className="posts-list__item__info">
                  <span>
                    Posted on {formatDate(new Date(post.createdAt))} by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link>
                  </span>
                </div>
                <div className="posts-list__item__content">
                  <ReactMarkdown children={trimContent(post.content) + "..."} />
                </div>
                <div className="posts-list__item__read-more">
                  <Link to={`/post/${post.id}`}>Read more...</Link>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }
}
