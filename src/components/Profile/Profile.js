import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Tooltip } from "@mui/material";
import Axios from "axios";
import { appContext } from "../../AppContext";
import Loading from "../Loading/Loading";
import PostsList from "../PostsList/PostsList";
import "./Profile.css";
import { useImmer } from "use-immer";

export default function Profile() {
  const context = useContext(appContext);

  const { username } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useImmer();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const checkResponse = await Axios.post("/check-username", { username: username });
        if (!checkResponse.data) {
          navigate("/");
          return;
        }
        const res = await Axios.post(`/profile/${username}`, { token: context.user.token });
        setUserData(res.data);
        setIsLoading(false);
      } catch {
        console.log("Error in fetching post data.");
      }
    }
    fetchUserData();
  }, [username]);

  const onClickHandler = async () => {
    try {
      if (userData.isFollowing) {
        await Axios.delete(`/profile/${username}/unfollow`, { data: { token: context.user.token } });
        setUserData((state) => {
          state.isFollowing = false;
          state.counts.followersCount--;
        });
      } else {
        await Axios.post(`/profile/${username}/follow`, { token: context.user.token });
        setUserData((state) => {
          state.isFollowing = true;
          state.counts.followersCount++;
        });
      }
    } catch {
      console.log("Error in handle follow/unfollow.");
    }
  };

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <div className="profile">
        <div className="profile__info">
          <img alt={userData.username} src={userData.profileImgUrl} />
          <div>
            <h2 className="profile__username">{userData.username}</h2>
            <div className="profile__counts">
              <span>Posts: {userData.counts.postsCount}</span>
              <span>Followers: {userData.counts.followersCount}</span>
              <span>Following: {userData.counts.followingCount}</span>
            </div>
          </div>
        </div>
        {userData.username !== context.user.username && (
          <div className="profile__follow">
            <i>{userData.isFollowing ? "You are following this user" : ""}</i>
            <Tooltip arrow title={userData.isFollowing ? "" : "Follow this user to see latest posts from this user in your Home page"}>
              <Button onClick={onClickHandler} variant="contained">
                {userData.isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </Tooltip>
          </div>
        )}
        <div className="profile__posts">
          <h2 className="profile__posts__title">{userData.username === context.user.username ? "Your" : username + "'s"} posts:</h2>
          {userData.counts.postsCount === 0 && userData.username === context.user.username && <p>You don't have any posts yet. Create some new posts.</p>}
          {userData.counts.postsCount === 0 && userData.username !== context.user.username && <p>{userData.username} doesn't have any posts yet.</p>}
          <PostsList />
        </div>
      </div>
    );
  }
}
