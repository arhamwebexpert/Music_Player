import React, { useEffect, useState } from 'react';
import { getSongs, createSong } from '../api/api';
import { Button, Form, Table, Container } from 'react-bootstrap';

const SongsPage = () => {
    const [songs, setSongs] = useState([]);
    const [newSong, setNewSong] = useState({
        name: '',
        singer: '',
        genre: '',
        fileUrl: '',
        duration: '00:00:00', // Default valid format
        playCount: 0
    });
    useEffect(() => {
        getSongs()
            .then((response) => setSongs(response.data))
            .catch((error) => console.error(error));
    }, []);

    const handleCreate = (e) => {
        e.preventDefault();

        // Validate duration format
        if (!/^(\d{2}):(\d{2}):(\d{2})$/.test(newSong.duration)) {
            alert("Invalid duration format. Use hh:mm:ss.");
            return;
        }

        createSong(newSong)
            .then(() => getSongs().then((response) => setSongs(response.data)))
            .catch((error) => {
                console.error(error.response?.data || error.message);
                alert(`Error: ${error.response?.data?.message || "An error occurred."}`);
            });
    };
    
    return (
        <Container>
            <h2 className="mb-4">Songs</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Singer</th>
                        <th>Genre</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {songs.map((song) => (
                        <tr key={song.id}>
                            <td>{song.id}</td>
                            <td>{song.name}</td>
                            <td>{song.singer}</td>
                            <td>{song.genre}</td>
                            <td>{song.duration}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h4 className="mt-4">Add New Song</h4>
            <Form onSubmit={handleCreate}>
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

                <Form.Group controlId="fileUrl">
                    <Form.Label>File URL</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter file URL"
                        value={newSong.fileUrl}
                        onChange={(e) => setNewSong({ ...newSong, fileUrl: e.target.value })}
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


                <Button variant="primary" type="submit" className="mt-3">
                    Add Song
                </Button>
            </Form>
        </Container>
    );
};

export default SongsPage;
