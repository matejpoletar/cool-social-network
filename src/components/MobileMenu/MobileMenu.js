import React, { useContext, useState } from "react";
import { Nav, Navbar, Container, Form, Offcanvas } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./MobileMenu.css";
import { Button } from "@mui/material";
import { appContext, appContextDispatch } from "../../AppContext";
import Axios from "axios";

export default function MobileMenu() {
  const context = useContext(appContext);
  const dispatch = useContext(appContextDispatch);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "logout" });
    navigate("/");
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleClose = () => setMenuOpen(false);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchTerm.length) {
      try {
        const res = await Axios.post("/search", { keyword: searchTerm, token: context.user.token });
        dispatch({ type: "showSearchResults", data: res.data });
        setMenuOpen(false);
        navigate(`/search-results/?search=${searchTerm}`);
      } catch {
        console.log("Error in search results.");
      }
    }
  };

  return (
    <div className="mobile-menu">
      <Navbar collapseOnSelect expand={false} className="mb-3">
        <Container fluid>
          <Navbar.Toggle onClick={toggleMenu} />
          <Navbar.Offcanvas show={menuOpen} onHide={handleClose} restoreFocus={false} autoFocus responsive="sm" placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Cool Social Network</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link onClick={toggleMenu} as={Link} to="/">
                  Home
                </Nav.Link>
                <Nav.Link onClick={toggleMenu} as={Link} to={`/profile/${context.user.username}`}>
                  Profile
                </Nav.Link>
                <Nav.Link onClick={toggleMenu} as={Link} to="/create-post">
                  Create Post
                </Nav.Link>
                <Nav.Link onClick={toggleMenu} as={Link} to="/settings">
                  Settings
                </Nav.Link>
              </Nav>
              <Form className="d-flex mt-3" onSubmit={handleSubmit}>
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
                <Button variant="outline-success" type="submit">
                  Search
                </Button>
              </Form>
              <Button
                onClick={handleLogout}
                variant="contained"
                color="error"
                sx={{
                  marginTop: "50px",
                }}
              >
                Logout
              </Button>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </div>
  );
}
