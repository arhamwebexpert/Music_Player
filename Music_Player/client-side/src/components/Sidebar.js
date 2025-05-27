import React, { useState } from 'react';
import { Nav, Modal, Button, Form, Alert } from 'react-bootstrap';
import '../style/Sidebar.css';
import axios from 'axios';

const Sidebar = ({ onCreatePlaylist, onCreateSong, onLoginUser, onCreateUser }) => {
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [showSongModal, setShowSongModal] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const [newPlaylist, setNewPlaylist] = useState({ name: '', userId: '', isPublic: false });
    const [newSong, setNewSong] = useState({ name: '', singer: '', genre: '', duration: '00:00:00', file: null });

    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        passwordHash: '',
        profilePicture: null,
    });

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Toggle modals
    const handlePlaylistModalClose = () => setShowPlaylistModal(false);
    const handlePlaylistModalShow = () => setShowPlaylistModal(true);

    const handleSongModalClose = () => setShowSongModal(false);
    const handleSongModalShow = () => setShowSongModal(true);

    const handleSignUpModalClose = () => setShowSignUpModal(false);
    const handleSignUpModalShow = () => setShowSignUpModal(true);

    const handleLoginModalClose = () => setShowLoginModal(false);
    const handleLoginModalShow = () => setShowLoginModal(true);

    // Handle playlist creation
    const handleCreatePlaylist = (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');
        const sessionId = localStorage.getItem('sessionToken');
        if (!sessionId) {
            alert('Please log in to create a playlist.');
            window.location.href = '/';
        }
        const playlistData = { ...newPlaylist, userId };

        onCreatePlaylist(playlistData);
        setNewPlaylist({ name: '', userId: userId, isPublic: false });
        setShowPlaylistModal(false);
    };

    // Handle song creation
    const handleCreateSong = (e) => {
        e.preventDefault();

        // Validate duration format
        if (!/^(\d{2}):(\d{2}):(\d{2})$/.test(newSong.duration)) {
            alert('Invalid duration format. Use hh:mm:ss.');
            return;
        }

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('name', newSong.name);
        formData.append('singer', newSong.singer);
        formData.append('genre', newSong.genre);
        formData.append('duration', newSong.duration);
        if (newSong.file) {
            formData.append('file', newSong.file); // Replace "file" with the name expected by the API
        }

        onCreateSong(formData);
        setNewSong({ name: '', singer: '', genre: '', duration: '00:00:00', file: null });
        setShowSongModal(false);
    };

    // Handle user creation (Sign Up)
    const handleCreateUser = (e) => {
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
                setNewUser({ username: '', email: '', passwordHash: '', profilePicture: null });
                setShowSignUpModal(false);
            })
            .catch((error) => {
                setErrorMessage(error.response?.data || 'Error creating user');
                setSuccessMessage('');
            });
    };

    // Handle user login
    const handleLogin = (e) => {
        e.preventDefault();

        onLoginUser(loginData)
            .then(() => {
                setSuccessMessage('Logged in successfully!');
                setErrorMessage('');
                setLoginData({ email: '', password: '' });
                setShowLoginModal(false);
            })
            .catch((error) => {
                setErrorMessage(error.response?.data || 'Invalid credentials');
                setSuccessMessage('');
            });
    };

    // Handle logout
    const handleLogout = () => {
        // Log the session token and user data before removing them
        console.log('Before logout:');
        console.log('Session Token:', localStorage.getItem('sessionToken'));  // Check session token
        console.log('User ID:', localStorage.getItem('userId'));  // Check user ID
        console.log('Username:', localStorage.getItem('username'));  // Check username

        // Remove session token and user data from localStorage
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');

        // Debug: Verify that the values are removed
        console.log('After logout:');
        console.log('Session Token:', localStorage.getItem('sessionToken'));
        console.log('User ID:', localStorage.getItem('userId'));

        // Redirect user to login page (or you can just change the state/UI)
        window.location.href = '/';  // Redirect to login page
    };

    return (
        <div className="sidebar d-flex flex-column bg-dark text-white p-3 vh-100">
            <h4 className="text-primary mb-4">SoundWave</h4>
            <Nav className="flex-column">
                <Nav.Link href="/" className="text-white">
                    <i className="fa fa-home me-2"></i> Discover
                </Nav.Link>
                <Nav.Link href="#" className="text-white">
                    <i className="fa fa-search me-2"></i> Browse
                </Nav.Link>
                <Nav.Link href="/liked-songs" className="text-white">
                    <i className="fa fa-heart me-2"></i> Liked Songs
                </Nav.Link>
                <Nav.Link href="/playlists" className="text-white">
                    <i className="fa fa-plus me-2"></i> Playlist
                </Nav.Link>

                <Nav.Link href="#" className="text-white" onClick={handlePlaylistModalShow}>
                    <i className="fa fa-plus me-2"></i> Create Playlist
                </Nav.Link>
                <Nav.Link href="#" className="text-white" onClick={handleSongModalShow}>
                    <i className="fa fa-music me-2"></i> Add Song
                </Nav.Link>

                {/* Login, Sign Up, and Logout buttons */}
                {localStorage.getItem('sessionToken') ? (
                    <Nav.Link href="#" className="text-white" onClick={handleLogout}>
                        <i className="fa fa-sign-out me-2"></i> Log Out
                    </Nav.Link>
                ) : (
                    <>
                        <Nav.Link href="#" className="text-white" onClick={handleSignUpModalShow}>
                            <i className="fa fa-user-plus me-2"></i> Sign Up
                        </Nav.Link>
                        <Nav.Link href="#" className="text-white" onClick={handleLoginModalShow}>
                            <i className="fa fa-sign-in me-2"></i> Log In
                        </Nav.Link>
                    </>
                )}
            </Nav>

            {/* Modal for Creating Playlist */}
            <Modal show={showPlaylistModal} onHide={handlePlaylistModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Playlist</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreatePlaylist}>
                        <Form.Group controlId="playlistName">
                            <Form.Label>Playlist Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter playlist name"
                                value={newPlaylist.name}
                                onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="isPublic">
                            <Form.Check
                                type="checkbox"
                                label="Is Public"
                                checked={newPlaylist.isPublic}
                                onChange={(e) => setNewPlaylist({ ...newPlaylist, isPublic: e.target.checked })}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            Create Playlist
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal for Adding Song */}
            <Modal show={showSongModal} onHide={handleSongModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Song</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateSong}>
                        <Form.Group controlId="songName">
                            <Form.Label>Song Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter song name"
                                value={newSong.name}
                                onChange={(e) => setNewSong({ ...newSong, name: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="singer">
                            <Form.Label>Singer</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter singer name"
                                value={newSong.singer}
                                onChange={(e) => setNewSong({ ...newSong, singer: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="genre">
                            <Form.Label>Genre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter genre"
                                value={newSong.genre}
                                onChange={(e) => setNewSong({ ...newSong, genre: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="duration">
                            <Form.Label>Duration</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter duration (e.g., 00:02:00 for 2 minutes)"
                                value={newSong.duration}
                                onChange={(e) => setNewSong({ ...newSong, duration: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="file">
                            <Form.Label>Audio File</Form.Label>
                            <Form.Control type="file" onChange={(e) => setNewSong({ ...newSong, file: e.target.files[0] })} />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            Add Song
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modals for Sign Up and Log In */}
            <Modal show={showSignUpModal} onHide={handleSignUpModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sign Up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateUser}>
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

export default Sidebar;
