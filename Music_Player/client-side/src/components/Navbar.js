import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

const AppNavbar = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Navbar.Brand href="/">🎵 Music Player</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <NavLink to="/albums" className="nav-link">Albums</NavLink>
                    <NavLink to="/playlists" className="nav-link">Playlists</NavLink>
                    <NavLink to="/songs" className="nav-link">Songs</NavLink>
                    <NavLink to="/users" className="nav-link">Users</NavLink>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default AppNavbar;
