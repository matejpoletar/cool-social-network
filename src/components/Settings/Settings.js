import React, { useContext, useEffect, useState } from "react";
import { appContext, appContextDispatch } from "../../AppContext";
import formatDate from "../../assets/scripts/formatDate";
import Axios from "axios";
import "./Settings.css";
import { Form, Button } from "react-bootstrap";
import { useImmer } from "use-immer";
import Loading from "../Loading/Loading";
import { Avatar } from "@mui/material";

export default function Settings() {
  const context = useContext(appContext);
  const dispatch = useContext(appContextDispatch);
  const [loading, setLoading] = useState(false);

  const imageInitial = {
    imgFile: null,
    imgUrl: context.user.avatar,
  };
  const [image, setImage] = useImmer(imageInitial);

  const uploadFileHandler = (e) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];
      setImage((state) => {
        state.imgFile = imageFile;
        state.imgUrl = URL.createObjectURL(imageFile);
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (image.imgFile) {
      setLoading(true);
      const bodyFormData = new FormData();
      bodyFormData.append("file", image.imgFile);
      bodyFormData.append("token", context.user.token);

      try {
        const res = await Axios.post("/profile-image", bodyFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        dispatch({ type: "setAvatar", data: res.data.secure_url });
        dispatch({ type: "flashMessage", data: { message: "Profile image successfully changed.", status: "success" } });
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    } else {
      dispatch({ type: "flashMessage", data: { message: "You need to choose a new profile image.", status: "warning" } });
    }
  };

  return (
    <div className="settings">
      <h3 className="settings__title">
        <b>Username:</b> {context.user.username}
      </h3>
      <h3 className="settings__title">
        <b>Email:</b> {context.user.email}
      </h3>
      <h3 className="settings__title">
        <b>Registration date:</b> {formatDate(new Date(context.user.registeredAt))}
      </h3>
      <h3 className="settings__title">
        <b>Profile image:</b>
      </h3>
      <div className="settings__image">
        {image.imgUrl ? (
          <>
            <img className="settings__image__background" src={image.imgUrl} />
            <img className="settings__image__front" src={image.imgUrl} alt="Profile image" />{" "}
          </>
        ) : (
          <Avatar sx={{ width: 250, height: 250 }} />
        )}
      </div>
      {loading && <Loading />}
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3 mt-2" controlId="imageFile">
          <Form.Control type="file" onChange={uploadFileHandler} />
        </Form.Group>
        <Button variant="secondary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}
