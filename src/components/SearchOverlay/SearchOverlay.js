import React, { useContext, useEffect, useRef, useState } from "react";
import { appContext, appContextDispatch } from "../../AppContext";
import Axios from "axios";
import "./SearchOverlay.css";
import Loading from "../Loading/Loading";
import formatDate from "../../assets/scripts/formatDate";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";

export default function SearchOverlay() {
  const context = useContext(appContext);
  const dispatch = useContext(appContextDispatch);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const ref = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (ref.current && ref.current.contains(e.target)) {
        dispatch({ type: "searchClose" });
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, []);

  useEffect(() => {
    async function fetchSearchResults() {
      if (context.searchRequestCount) {
        try {
          setIsLoading(true);
          const res = await Axios.post("/search", { keyword: context.searchTerm, token: context.user.token });
          setResults(res.data);

          setIsLoading(false);
        } catch {
          console.log("Error in fetching search results.");
        }
      }
    }
    fetchSearchResults();
  }, [context.searchRequestCount]);

  const trimContent = (text) => {
    return text
      .split(/(?=\s)/gi)
      .slice(0, 10)
      .join("");
  };

  const handleShowMore = () => {
    dispatch({ type: "showSearchResults", data: results });
  };

  const handleLinkClick = () => {
    dispatch({ type: "searchClose" });
  };

  return (
    <div className="search-overlay">
      <div className="search-overlay__mask" ref={ref}></div>
      <div className="search-overlay__results">
        {isLoading && <Loading />}
        {!isLoading && (
          <>
            <p>Search results: {results.length}</p>
            {results.slice(0, 3).map((post, index) => {
              return (
                <div key={index} className="search-overlay_result">
                  <h3 className="search-overlay_result__title">
                    <Link onClick={handleLinkClick} to={`/profile/${post.author.username}`}>
                      <Avatar alt={post.author.username} src={post.author.avatar} sx={{ bgcolor: "orange", width: 34, height: 34 }} />
                    </Link>
                    <Link onClick={handleLinkClick} to={`post/${post.id}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="search-overlay_result__description">
                    Posted on {formatDate(new Date(post.createdAt))} by{" "}
                    <Link onClick={handleLinkClick} to={`/profile/${post.author.username}`}>
                      {post.author.username}
                    </Link>
                  </p>
                  <p className="search-overlay_result__content">{trimContent(post.content)}...</p>
                </div>
              );
            })}

            {results.length > 3 && (
              <Link onClick={handleShowMore} to={`/search-results/?search=${context.searchTerm}`}>
                Show more...
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
