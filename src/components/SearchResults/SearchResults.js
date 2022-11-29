import { Avatar } from "@mui/material";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import formatDate from "../../assets/scripts/formatDate";

export default function SearchResults(props) {
  const trimContent = (text) => {
    return text
      .split(/(?=\s)/gi)
      .slice(0, 15)
      .join("");
  };

  return (
    <div className="posts-list">
      <h3>Search results: {props.results.length}</h3>
      {props.results.map((post, index) => {
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
  );
}
