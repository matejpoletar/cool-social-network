import { Avatar } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { appContext } from "../../AppContext";
import PostsList from "../PostsList/PostsList";
import "./Profile.css";
import Axios from "axios";
import Loading from "../Loading/Loading";

export default function Profile() {
  const context = useContext(appContext);

  const { username } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await Axios.post("/check-username", { username: username });
        if (res.data === false) {
          navigate("/");
          return;
        }
      } catch {
        console.log("Error in checking username.");
      }

      try {
        const res = await Axios.post(`/profile/${username}`, { token: context.user.token });
        setUserData(res.data);
        setIsLoading(false);
        console.log(res.data);
      } catch {
        console.log("Error in fetching post data.");
      }
    }

    fetchUserData();
  }, [username]);

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <div className="profile">
        <div className="profile__info">
          <Avatar alt={userData.username} src="/" sx={{ height: 200, width: 200, bgcolor: "orange" }} />
          <div>
            <h2 className="profile__username">{userData.username}</h2>
            <div className="profile__counts">
              <span>Posts: {userData.counts.postsCount}</span>
              <span>Followers: {userData.counts.followersCount}</span>
              <span>Following: {userData.counts.followingCount}</span>
            </div>
          </div>
        </div>
        <div className="profile__posts">
          <h2 className="profile__posts__title">{username}'s posts:</h2>
          {userData.counts.postsCount === 0 && userData.username === context.user.username && <p>You don't have any posts yet. Create some new posts.</p>}
          {userData.counts.postsCount === 0 && userData.username !== context.user.username && <p>{userData.username} doesn't have any posts yet.</p>}
          <PostsList />
        </div>
      </div>
    );
  }
}
