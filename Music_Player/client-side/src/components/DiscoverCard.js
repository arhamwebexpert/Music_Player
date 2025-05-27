import React, { useState } from 'react';
import { Button, Card, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import '../style/card.css'; // Ensure the correct path to the CSS

const DiscoverCard = ({ title, image, tracks, genre, onPlay, songId }) => {
    const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState('');

    // Fetch user playlists when the modal opens
    const fetchPlaylists = (userId) => {
        axios
            .get(`https://localhost:7293/api/playlists/user/${userId}`, {
                headers: {
                    'Session-Token': localStorage.getItem('sessionToken'),
                },
            })
            .then((response) => setPlaylists(response.data))
            .catch((error) => console.error('Error fetching playlists:', error));
    };

    // Handle the Add to Playlist button click
    const handleAddToPlaylist = () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetchPlaylists(userId); // Fetch playlists for the logged-in user
            setShowAddToPlaylistModal(true);
        } else {
            alert('Please log in to add songs to your playlist');
        }
    };

    // Handle adding song to the selected playlist
    const handleAddSongToPlaylist = () => {
        if (!selectedPlaylist) {
            alert('Please select a playlist');
            return;
        }
        const payload = {
            songId,
            sessionToken: localStorage.getItem('sessionToken'),  // Pass session token for authentication
        };

        // Send the request to add the song to the selected playlist
        axios
            .post(
                `https://localhost:7293/api/playlists/${selectedPlaylist}/add-song`,
                payload,
                {
                    headers: {
                        'Session-Token': localStorage.getItem('sessionToken'),
                    },
                }
            )
            .then(() => {
                alert('Song added to playlist');
                setShowAddToPlaylistModal(false);  // Close the modal
            })
            .catch((error) => {
                console.error('Error adding song to playlist:', error);
                alert('Error adding song to playlist');
            });
    };

    // Handle liking the song
    const handleLikeSong = () => {
        const userId = localStorage.getItem('userId');
        const sessionToken = localStorage.getItem('sessionToken');

        if (!userId || !sessionToken) {
            alert('Please log in to like songs');
            return;
        }

        // Send the request to add the song to liked songs
        axios
            .post(
                `https://localhost:7293/api/users/${userId}/like-song`,
                { songId },
                {
                    headers: {
                        'Session-Token': sessionToken,
                    },
                }
            )
            .then(() => {
                alert('Song liked successfully');
            })
            .catch((error) => {
                console.error('Error liking song:', error);
                alert('Error liking song');
            });
    };

    return (
        <div className="card-container"> {/* Wrap the cards with the container */}
            <Card className="shadow-lg rounded card-style">
                <Card.Img variant="top" src={image} alt={`${title} cover`} className="card-img-top rounded-top" />
                <Card.Body>
                    <Card.Title className="text-white">{title}</Card.Title>
                    <Card.Text className="text-white">{tracks}</Card.Text>
                    <Card.Text className="text-white">Genre: {genre}</Card.Text>

                    {/* Play Button */}
                    <Button variant="success" className="w-100 mb-2" onClick={onPlay}>
                        <i className="fa fa-play"></i> Play
                    </Button>

                    {/* Add to Playlist Button */}
                    <Button variant="info" className="w-100 mb-2" onClick={handleAddToPlaylist}>
                        <i className="fa fa-plus me-2"></i> Add to Playlist
                    </Button>

                    {/* Like Button */}
                    <Button variant="danger" className="w-100" onClick={handleLikeSong}>
                        <i className="fa fa-heart me-2"></i> Like Song
                    </Button>
                </Card.Body>
            </Card>

            {/* Add to Playlist Modal */}
            <Modal show={showAddToPlaylistModal} onHide={() => setShowAddToPlaylistModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Song to Playlist</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="playlistSelect">
                            <Form.Label>Select Playlist</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedPlaylist}
                                onChange={(e) => setSelectedPlaylist(e.target.value)}
                            >
                                <option value="">Select Playlist</option>
                                {playlists.map((playlist) => (
                                    <option key={playlist.id} value={playlist.id}>
                                        {playlist.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Button
                            variant="primary"
                            onClick={handleAddSongToPlaylist}
                            disabled={!selectedPlaylist}
                            className="mt-3 w-100"
                        >
                            Add to Playlist
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default DiscoverCard;
