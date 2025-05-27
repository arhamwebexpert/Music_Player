import React, { useEffect, useState } from 'react';
import { getUsers, createUser } from '../api/api';
import { Button, Form, Table, Container } from 'react-bootstrap';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', Email: '', passwordHash: '', ProfilePictureUrl: '' ,Playlists:[] ,LikedSongs: [] });

    useEffect(() => {
        getUsers()
            .then((response) => setUsers(response.data))
            .catch((error) => console.error(error));
    }, []);

    const handleCreate = (e) => {
        e.preventDefault();
        createUser(newUser)
            .then(() => getUsers().then((response) => setUsers(response.data)))
            .catch((error) => console.error(error));
    };

    return (
        <Container>
            <h2 className="mb-4">Users</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h4 className="mt-4">Add New User</h4>
            <Form onSubmit={handleCreate}>
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
                <Form.Group controlId="ProfilePictureUrl">
                    <Form.Label>ProfilePictureUrl</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter ProfilePictureUrl"
                        value={newUser.ProfilePictureUrl}
                        onChange={(e) => setNewUser({ ...newUser, ProfilePictureUrl: e.target.value })}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Add User
                </Button>
            </Form>
        </Container>
    );
};

export default UsersPage;
