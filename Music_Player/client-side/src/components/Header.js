import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Alert, ListGroup, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import '../style/Header.css';

const Header = ({ toggleSidebar, onCreateUser, onLoginUser, onLogoutUser, onSearch }) => {
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        passwordHash: '',
        profilePicture: null,
    });

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Sign-Up Modal Handlers
    const handleSignUpModalClose = () => setShowSignUpModal(false);
    const handleSignUpModalShow = () => setShowSignUpModal(true);

    // Login Modal Handlers
    const handleLoginModalClose = () => setShowLoginModal(false);
    const handleLoginModalShow = () => setShowLoginModal(true);

    // Handle file change for profile picture
    const handleFileChange = (e) => {
        setNewUser({ ...newUser, profilePicture: e.target.files[0] });
    };

    // Handle user creation (Sign-up)
    const handleCreate = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', newUser.username);
        formData.append('email', newUser.email);
        formData.append('passwordHash', newUser.passwordHash);
        if (newUser.profilePicture) {
            formData.append('profilePicture', newUser.profilePicture);
        }
        onCreateUser(formData)
            .then(() => {
                setSuccessMessage('User created successfully!');
                setErrorMessage('');
                setNewUser({
                    username: '',
                    email: '',
                    passwordHash: '',
                    profilePicture: null,
                });
                setShowSignUpModal(false);
            })
            .catch((error) => {
                setErrorMessage(error.response?.data || 'Error creating user');
                setSuccessMessage('');
            });
    };

    // Handle login functionality
    const handleLogin = (e) => {
        e.preventDefault();
        if (typeof onLoginUser === 'function') {
            onLoginUser(loginData)
                .then(() => {
                    setSuccessMessage('Logged in successfully!');
                    setErrorMessage('');
                    setLoggedInUser(localStorage.getItem('username'));
                    setLoginData({ email: '', password: '' });
                    setShowLoginModal(false);
                })
                .catch((error) => {
                    setErrorMessage(error.response?.data || 'Invalid credentials');
                    setSuccessMessage('');
                });
        }
    };

    // Handle logout functionality
    const handleLogout = () => {
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        setLoggedInUser(null);
        window.location.href = '/';
    };

    // Update logged-in user status on component mount
    useEffect(() => {
        const user = localStorage.getItem('username');
        if (user) {
            setLoggedInUser(user);
        }
    }, []);

    // Handle search query change and trigger API search
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);  // Trigger onSearch passed from App.js
    };

    return (
        <div className="d-flex justify-content-between align-items-center p-3" style={{ backgroundColor: '#1c1c1c', color: 'white' }}>
            <div>
                <Button variant="outline-light" onClick={toggleSidebar} style={{ marginRight: '10px' }}>
                    <i className="fa fa-bars"></i>
                </Button>
                <span>SoundWave</span>
            </div>

            {/* Search Bar */}
            <Form className="d-flex w-50">
                <Form.Control
                    type="search"
                    placeholder="Search songs, albums ..."
                    value={searchQuery}
                    onChange={handleSearchChange} // Handle search query changes
                    className="me-2 search-bar"
                    style={{ backgroundColor: '#333', color: 'white', border: '1px solid #555' }}
                />
                <Button variant="outline-light">Search</Button>
            </Form>

            {/* User Authentication Buttons */}
            <div>
                {!loggedInUser ? (
                    <>
                        <Button variant="outline-light" className="me-2" onClick={handleSignUpModalShow}>
                            Sign Up
                        </Button>
                        <Button variant="outline-light" onClick={handleLoginModalShow}>
                            Log In
                        </Button>
                    </>
                ) : (
                    <Alert variant="success" className="d-inline-block">
                        Logged in as {loggedInUser}
                    </Alert>
                )}

                {loggedInUser && (
                    <Button variant="outline-light" onClick={handleLogout} className="ms-2">
                        Log Out
                    </Button>
                )}
            </div>

            {/* Sign-Up Modal */}
            <Modal show={showSignUpModal} onHide={handleSignUpModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sign Up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreate}>
                        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                        {successMessage && <Alert variant="success">{successMessage}</Alert>}
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="passwordHash">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={newUser.passwordHash}
                                onChange={(e) => setNewUser({ ...newUser, passwordHash: e.target.value })}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Sign Up
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Login Modal */}
            <Modal show={showLoginModal} onHide={handleLoginModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Log In</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleLogin}>
                        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={loginData.email}
                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Log In
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Header;
