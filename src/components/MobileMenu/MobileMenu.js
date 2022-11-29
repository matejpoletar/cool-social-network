import React, { useContext, useState } from "react";
import { Nav, Navbar, Container, Form, Offcanvas } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./MobileMenu.css";
import { Button } from "@mui/material";
import { appContext, appContextDispatch } from "../../AppContext";

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
              <Form className="d-flex mt-3">
                <Form.Control type="search" placeholder="Search" className="me-2" />
                <Button variant="outline-success">Search</Button>
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
