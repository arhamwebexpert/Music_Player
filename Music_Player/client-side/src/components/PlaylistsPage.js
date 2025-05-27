// PlaylistPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PlaylistPage = () => {
    const [playlists, setPlaylists] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const sessionToken = localStorage.getItem('sessionToken');

        if (!userId || !sessionToken) {
            alert('Please log in to view your playlists');
            return;
        }

        axios
            .get(`https://localhost:7293/api/playlists/user/${userId}`, {
                headers: {
                    'Session-Token': sessionToken,
                },
            })
            .then((response) => {
                setPlaylists(response.data);
            })
            .catch((error) => {
                console.error('Error fetching playlists:', error);
            });
    }, []);

    const handlePlaylistClick = (playlistId) => {
        navigate(`/playlist/${playlistId}`);
    };

    return (
        <div className="d-flex flex-wrap">
            {playlists.map((playlist) => (
                <Card
                    key={playlist.id}
                    style={{ width: '18rem', margin: '1rem', backgroundColor: '#1c1c1c' }}
                    className="text-white"
                    onClick={() => handlePlaylistClick(playlist.id)}
                >
                    <Card.Body>
                        <Card.Title>{playlist.name}</Card.Title>
                        <Button variant="primary">View Playlist</Button>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default PlaylistPage;
