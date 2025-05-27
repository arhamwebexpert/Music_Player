import React, { useEffect, useState } from 'react';
import { getAlbums, createAlbum } from '../api/api';
import { Button, Form, Table, Container } from 'react-bootstrap';

const AlbumsPage = () => {
    const [albums, setAlbums] = useState([]);
    const [newAlbum, setNewAlbum] = useState({
        name: '',
        artist: '',
        releaseDate: '',
        coverImageUrl: '', // Include this field
        songIds: [],       // Include this field (default empty array)
    });

    useEffect(() => {
        getAlbums()
            .then((response) => setAlbums(response.data))
            .catch((error) => console.error(error));
    }, []);

    const handleCreate = (e) => {
        e.preventDefault();
        createAlbum(newAlbum)
            .then(() => getAlbums().then((response) => setAlbums(response.data)))
            .catch((error) => console.error(error));
    };

    return (
        <Container>
            <h2 className="mb-4">Albums</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Artist</th>
                        <th>Release Date</th>
                    </tr>
                </thead>
                <tbody>
                    {albums.map((album) => (
                        <tr key={album.id}>
                            <td>{album.id}</td>
                            <td>{album.name}</td>
                            <td>{album.artist}</td>
                            <td>{new Date(album.releaseDate).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h4 className="mt-4">Add New Album</h4>
            <Form onSubmit={handleCreate}>
                <Form.Group controlId="albumName">
                    <Form.Label>Album Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter album name"
                        value={newAlbum.name}
                        onChange={(e) => setNewAlbum({ ...newAlbum, name: e.target.value })}
                    />
                </Form.Group>

                <Form.Group controlId="albumArtist">
                    <Form.Label>Artist</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter artist name"
                        value={newAlbum.artist}
                        onChange={(e) => setNewAlbum({ ...newAlbum, artist: e.target.value })}
                    />
                </Form.Group>

                <Form.Group controlId="albumCoverImageUrl">
                    <Form.Label>Cover Image URL</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter cover image URL"
                        value={newAlbum.coverImageUrl}
                        onChange={(e) => setNewAlbum({ ...newAlbum, coverImageUrl: e.target.value })}
                    />
                </Form.Group>

                <Form.Group controlId="albumReleaseDate">
                    <Form.Label>Release Date</Form.Label>
                    <Form.Control
                        type="date"
                        value={newAlbum.releaseDate}
                        onChange={(e) => setNewAlbum({ ...newAlbum, releaseDate: e.target.value })}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Add Album
                </Button>
            </Form>

        </Container>
    );
};

export default AlbumsPage;
