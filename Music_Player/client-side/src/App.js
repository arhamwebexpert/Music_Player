import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DiscoverPage from './components/DiscoverPage';
import LikedSongsPage from './components/LikedSongs';
import PlaylistPage from './components/PlaylistsPage';
import PlaylistDetailPage from './components/PlaylistDetailPage';

function App() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');  // Store the current search query

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };
    const onCreateUser = (formData) => {
        return axios
            .post('https://localhost:7293/api/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important for file uploads
                },
            })
            .then((response) => {
                console.log('User created successfully:', response.data);
                alert("User created successfully");
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error creating user:', error.response?.data || error.message);
            });
    };
    const onCreateSong = (formData) => {
        axios
            .post('https://localhost:7293/api/songs', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(() => {
                alert('Song has been Created Successfully');
                window.location.reload();

            })
            .catch((error) => console.error('Error adding song:', error.response?.data || error.message));
    };
    const onLoginUser = (loginData) => {
        return axios.post('https://localhost:7293/api/users/login', loginData)
            .then(response => {
                localStorage.setItem('sessionToken', response.data.sessionToken);
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('username', response.data.username);
                alert('Login successful');
                window.location.reload();
            })
            .catch(error => {
                console.error('Login failed', error);
                throw new Error('Login failed');
            });
    };

    const handleSearch = (searchQuery) => {
        if (searchQuery.length > 2) {
            axios.get(`https://localhost:7293/api/search?query=${searchQuery}`)
                .then(response => {
                    setSearchResults(response.data);
                })
                .catch(error => {
                    console.error('Search error:', error);
                    setSearchResults([]);
                });
        } else {
            setSearchResults([]); // Clear if query is too short
        }
    };

    const onCreatePlaylist = (playlistData) => {
        // Make a POST request to create a playlist
        axios
            .post('https://localhost:7293/api/playlists', playlistData, {
                headers: {
                    'Session-Token': localStorage.getItem('sessionToken'), // Include session token in the header
                },
            })
            .then((response) => {
                console.log('Playlist created successfully:', response.data);
                alert("Playlist created successfully");
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error creating playlist:', error.response?.data || error.message);
            });
    };

    return (
        <Router>
            <div className="d-flex">
                {isSidebarOpen && <Sidebar onCreateSong={onCreateSong} onCreatePlaylist={onCreatePlaylist} onLoginUser={onLoginUser} onCreateUser={onCreateUser} />}
                <div className="flex-grow-1" style={{ marginLeft: isSidebarOpen ? '250px' : '0', transition: 'margin-left 0.3s' }}>
                    <Header toggleSidebar={toggleSidebar} onSearch={handleSearch} onLoginUser={onLoginUser} onCreateUser={onCreateUser} />
                    <Routes>
                        <Route path="/" element={<DiscoverPage searchResults={searchResults}  />} />
                        <Route path="/liked-songs" element={<LikedSongsPage />} />
                        <Route path="/playlists" element={<PlaylistPage />} />
                        <Route path="/playlist/:playlistId" element={<PlaylistDetailPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
