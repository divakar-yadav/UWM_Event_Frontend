import { Navbar, Nav } from 'react-bootstrap';
import logo from './images/new_logo.png';
import React, { useState } from 'react';
import { useEffect } from 'react';

function NavigationBar() {
  // This increments every time the user logs out
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // On every render, we run ValidateToken() again
  React.useEffect(() => {

       fetch(
        `${process.env.REACT_APP_API_URL}/home/validate_token/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((response) => {
        console.log("Response status: ", response.status);

      console.log(response.status);

        if (response.status === 200) {
          setIsAuthenticated(true);
          console.log("Authenticated");
        }
        setIsLoading(false);

  })}, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('first_name');
    console.log("Logged out");
    setIsAuthenticated(false)
    window.location.href = "/"; // Redirect to home page
    // Force a state update -> triggers re-render -> ValidateToken runs again
  };



  return (
    <Navbar bg="light" expand="lg">
      <div className="container-fluid">
        <Navbar.Brand href="/">
          <img
            src={logo}
            alt="Logo"
            width="500"
            height="500"
            className="d-inline-block align-text-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav"/>
        <Navbar.Collapse id="navbarNav">
          {isAuthenticated ? (
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          ) : (
            <Nav className="me-auto">
              <Nav.Link href="/">Student Research Poster Competition - 2025</Nav.Link>
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/signup">Register</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default NavigationBar;
