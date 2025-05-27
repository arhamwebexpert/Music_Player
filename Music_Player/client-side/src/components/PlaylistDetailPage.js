import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../style/card.css';  // Assuming you have card.css for card styles
import image from '../assets/download.jpeg';
const PlaylistDetailPage = () => {
    const { playlistId } = useParams();
    const [songs, setSongs] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState('00:00');
    const [totalTime, setTotalTime] = useState('00:00');
    const audioRef = useRef(null);

    // Fetch songs in the playlist
    useEffect(() => {
        axios
            .get(`https://localhost:7293/api/playlists/${playlistId}/songs`)
            .then((response) => {
                setSongs(response.data);
                setCurrentSongIndex(0); // Set the first song as the initial one
            })
            .catch((error) => {
                console.error('Error fetching songs:', error);
            });
    }, [playlistId]);

    // Handle audio source change when song changes
    useEffect(() => {
        if (songs[currentSongIndex] && audioRef.current) {
            audioRef.current.src = `https://localhost:7293${songs[currentSongIndex].fileUrl}`;
            audioRef.current.load();
            setProgress(0);
            setCurrentTime('00:00');
            const handleLoadedMetadata = () => {
                setTotalTime(formatTime(audioRef.current.duration));
            };

            // Ensure event listener is removed when song changes
            if (audioRef.current) {
                audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
            }

            return () => {
                if (audioRef.current) {
                    audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
                }
            };
        }
    }, [currentSongIndex, songs]);

    // Play or pause the song
    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch((error) => {
                console.error('Play interrupted:', error);
            });
        } else if (audioRef.current) {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // Automatically play next song after one ends
    useEffect(() => {
        if (currentSongIndex !== null) {
            setIsPlaying(true); // Start playing the new song
        }
    }, [currentSongIndex]);

    // Update progress during playback
    useEffect(() => {
        const handleTimeUpdate = () => {
            if (audioRef.current) {
                const current = audioRef.current.currentTime;
                const duration = audioRef.current.duration || 1;
                setProgress((current / duration) * 100);
                setCurrentTime(formatTime(current));
            }
        };

        if (audioRef.current) {
            audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
            }
        };
    }, [isPlaying]);

    // Format time as MM:SS
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // Toggle play/pause
    const togglePlay = () => {
        setIsPlaying((prev) => !prev);
    };

    // Go to next song
    const handleNext = () => {
        if (currentSongIndex < songs.length - 1) {
            setCurrentSongIndex(currentSongIndex + 1);
        }
    };

    // Go to previous song
    const handlePrevious = () => {
        if (currentSongIndex > 0) {
            setCurrentSongIndex(currentSongIndex - 1);
        }
    };

    const handleCanPlay = () => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch((error) => {
                console.error('Play interrupted:', error);
            });
        }
    };

    return (
        <div className="playlist-detail-page">
            <Container>
                <Row className="mt-4 card-container">
                    {songs.map((song, index) => (
                        <Col key={song.id} md={3} sm={6} xs={12}>
                            <Card className="card-style">
                                <Card.Img
                                    variant="top"
                                    src={image }
                                    alt={`${song.name} cover`}
                                    className="card-img-top"
                                />
                                <Card.Body>
                                    <Card.Title className="card-title">{song.name}</Card.Title>
                                    <Card.Text className="card-text">{song.singer}</Card.Text>
                                    <Button
                                        variant="success"
                                        className="w-100 mb-2"
                                        onClick={() => setCurrentSongIndex(index)}
                                    >
                                        <i className="fa fa-play"></i> Play
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            {currentSongIndex !== null && songs[currentSongIndex] && (
                <div
                    className="player fixed-bottom bg-dark text-white d-flex align-items-center"
                    style={{
                        height: '100px',
                        padding: '10px 20px',
                        borderTop: '1px solid #444',
                    }}
                >
                    <Container fluid>
                        <Row className="align-items-center">
                            <Col xs={3} className="d-flex align-items-center">
                                <img
                                    src={image}
                                    alt="Album Art"
                                    className="me-3"
                                    style={{ borderRadius: '50%', width: '60px', height: '60px' }}
                                />
                                <div>
                                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                        {songs[currentSongIndex].name}
                                    </div>
                                    <small style={{ color: '#bbb' }}>
                                        {songs[currentSongIndex].singer}
                                    </small>
                                </div>
                            </Col>

                            <Col xs={2} className="text-center">
                                <Button
                                    variant="outline-light"
                                    style={{
                                        borderRadius: '50%',
                                        width: '50px',
                                        height: '50px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onClick={togglePlay}
                                >
                                    {isPlaying ? (
                                        <i className="fa fa-pause" style={{ fontSize: '20px' }}></i>
                                    ) : (
                                        <i className="fa fa-play" style={{ fontSize: '20px' }}></i>
                                    )}
                                </Button>
                            </Col>

                            <Col xs={5}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        color: '#bbb',
                                    }}
                                >
                                    <span style={{ fontSize: '12px' }}>{currentTime}</span>
                                    <div
                                        style={{
                                            flexGrow: 1,
                                            height: '6px',
                                            backgroundColor: '#555',
                                            borderRadius: '3px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: `${progress}%`,
                                                height: '100%',
                                                backgroundColor: '#1DB954',
                                                borderRadius: '3px',
                                            }}
                                        ></div>
                                    </div>
                                    <span style={{ fontSize: '12px' }}>{totalTime}</span>
                                </div>
                            </Col>

                            <Col xs={2} className="text-end">
                                <Button
                                    variant="link"
                                    style={{ color: '#bbb', textDecoration: 'none', fontSize: '20px' }}
                                    onClick={handlePrevious}
                                >
                                    <i className="fa fa-step-backward"></i>
                                </Button>
                                <Button
                                    variant="link"
                                    style={{ color: '#bbb', textDecoration: 'none', fontSize: '20px' }}
                                    onClick={handleNext}
                                >
                                    <i className="fa fa-step-forward"></i>
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                    <audio
                        ref={audioRef}
                        onCanPlay={handleCanPlay}
                        onEnded={handleNext}
                        preload="auto"
                    />
                </div>
            )}
        </div>
    );
};

export default PlaylistDetailPage;
