// src/components/SearchBar.js

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, ListGroup, Alert } from 'react-bootstrap';
import axios from 'axios';

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState(''); // The search input
    const [searchResults, setSearchResults] = useState([]); // Array to store search results
    const [errorMessage, setErrorMessage] = useState('');

    // Function to handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value.length > 2) {
            // Call the API when the query length is more than 2 characters
            axios
                .get(`https://localhost:7293/api/search?query=${e.target.value}`)
                .then((response) => {
                    setSearchResults(response.data); // Set results if found
                    setErrorMessage(''); // Clear any previous error message
                })
                .catch((error) => {
                    setErrorMessage('No results found.');
                    console.error('Error searching:', error);
                    setSearchResults([]); // Clear the results if there's an error
                });
        } else {
            setSearchResults([]); // Clear results if query is too short
        }
    };

    return (
        <div style={{ padding: '2rem', backgroundColor: '#1c1c1c' }}>
            <Form className="d-flex mb-3">
                <Form.Control
                    type="search"
                    placeholder="Search songs, albums ..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="me-2"
                    style={{
                        backgroundColor: '#333',
                        color: 'white',
                        border: '1px solid #555',
                    }}
                />
                <Button variant="outline-light">Search</Button>
            </Form>

            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            {/* Display search results as cards */}
            {searchResults.length > 0 ? (
                <Row>
                    {searchResults.map((result, index) => (
                        <Col key={index} md={3} sm={6} xs={12} className="mb-4">
                            <Card style={{ backgroundColor: '#2c2f38', border: 'none', borderRadius: '12px' }}>
                                <Card.Img
                                    variant="top"
                                    src={result.imageUrl || 'https://via.placeholder.com/200'} // Placeholder if no image
                                    alt={result.name}
                                    style={{ borderRadius: '12px', height: '200px', objectFit: 'cover' }}
                                />
                                <Card.Body>
                                    <Card.Title style={{ color: '#fff' }}>{result.name}</Card.Title>
                                    <Card.Text style={{ color: '#aaa' }}>{result.artist}</Card.Text>
                                    <Button variant="outline-light" className="w-100">
                                        Play
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <p style={{ color: '#fff' }}>No results to display.</p>
            )}
        </div>
    );
};

export default SearchBar;
