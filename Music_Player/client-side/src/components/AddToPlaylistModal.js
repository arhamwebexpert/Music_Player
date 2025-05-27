import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const AddToPlaylistModal = ({ show, onClose, songId, userId }) => {
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState('');

    // Fetch the user's playlists when the modal opens
    useEffect(() => {
        if (userId) {
            axios
                .get(`https://localhost:7293/api/playlists/${userId}`, {
                    headers: {
                        'Session-Token': localStorage.getItem('sessionToken'),
                    },
                })
                .then((response) => setPlaylists(response.data))
                .catch((error) => console.error('Error fetching playlists:', error));
        }
    }, [userId, show]);

    const handleSubmit = () => {
        if (!selectedPlaylist) {
            alert('Please select a playlist.');
            return;
        }

        // Prepare the payload to send to the backend
        const payload = {
            songId,
            sessionToken: localStorage.getItem('sessionToken'),  // Include session token for authentication
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
                onClose(); // Close the modal after the song is added
            })
            .catch((error) => {
                console.error('Error adding song to playlist:', error);
                alert('Error adding song to playlist');
            });
    };

    return (
        <Modal show={show} onHide={onClose}>
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
                    <Button variant="primary" onClick={handleSubmit} disabled={!selectedPlaylist}>
                        Add to Playlist
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddToPlaylistModal;
