import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import '../style/LikePage.css';
import image from '../assets/download.jpeg';
const LikedSongsPage = () => {
    const [likedSongs, setLikedSongs] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState('00:00');
    const [totalTime, setTotalTime] = useState('00:00');
    const audioRef = useRef(null);

    // Fetch liked songs on component mount
    useEffect(() => {
        const sessionToken = localStorage.getItem('sessionToken');
        const userId = localStorage.getItem('userId');

        if (!sessionToken || !userId) {
            alert('Please log in to view your liked songs.');
            return;
        }

        // Fetch liked songs for the logged-in user
        axios
            .get(`https://localhost:7293/api/users/${userId}/liked-songs`, {
                headers: {
                    'Session-Token': sessionToken,
                },
            })
            .then((response) => {
                setLikedSongs(response.data);
            })
            .catch((error) => {
                console.error('Error fetching liked songs:', error);
                alert('Error fetching liked songs');
            });
    }, []);

    // When the song changes, update the audio source and reset progress
    useEffect(() => {
        if (likedSongs[currentSongIndex] && audioRef.current) {
            audioRef.current.src = `https://localhost:7293${likedSongs[currentSongIndex].fileUrl}`;
            audioRef.current.load();
            setProgress(0);
            setCurrentTime('00:00');
            const handleLoadedMetadata = () => {
                setTotalTime(formatTime(audioRef.current.duration));
            };

            if (audioRef.current) {
                audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
            }

            return () => {
                if (audioRef.current) {
                    audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
                }
            };
        }
    }, [currentSongIndex, likedSongs]);

    // Play or pause the song when the play button is clicked
    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch((error) => {
                console.error('Play interrupted:', error);
            });
        } else if (audioRef.current) {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // Update progress and current time during playback
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

    // Format the time to MM:SS format
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // Toggle play/pause
    const togglePlay = () => {
        setIsPlaying((prev) => !prev);
    };

    // Go to the next song (and start playing it automatically)
    const handleNext = () => {
        if (currentSongIndex < likedSongs.length - 1) {
            setCurrentSongIndex(currentSongIndex + 1);
            setIsPlaying(true);  // Automatically start playing the next song
        }
    };

    const handleCanPlay = () => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch((error) => {
                console.error('Play interrupted:', error);
            });
        }
    };

    // Go to the previous song
    const handlePrevious = () => {
        if (currentSongIndex > 0) {
            setCurrentSongIndex(currentSongIndex - 1);
            setIsPlaying(true);  // Automatically start playing the previous song
        }
    };

    return (
        <div className="liked-songs-page">
            <Container>
                <Row className="mt-4 card-container">
                    {likedSongs.map((song, index) => (
                        <Col key={song.id} md={3} sm={6} xs={12}>
                            <Card className="card-style">
                                <Card.Img
                                    variant="top"
                                    src={image}
                                    alt={`${song.name} cover`}
                                    className="card-img-top"
                                />
                                <Card.Body>
                                    <Card.Title className="card-text">{song.name}</Card.Title>
                                    <Card.Text className="card-text">{song.singer}</Card.Text>
                                    <Button
                                        variant="success"
                                        className="play-btn w-100"
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


            {likedSongs.length > 0 && currentSongIndex >= 0 && (
                <div
                    className="player fixed-bottom bg-dark text-white d-flex align-items-center"
                    style={{
                        height: '70px', // Reduced height for the player
                        padding: '5px 20px', // Adjusted padding
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
                                    style={{ borderRadius: '50%', width: '50px', height: '50px' }}
                                />
                                <div>
                                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                        {likedSongs[currentSongIndex].name}
                                    </div>
                                    <small style={{ color: '#bbb' }}>
                                        {likedSongs[currentSongIndex].singer}
                                    </small>
                                </div>
                            </Col>

                            <Col xs={2} className="text-center">
                                <Button
                                    variant="outline-light"
                                    style={{
                                        borderRadius: '50%',
                                        width: '40px',  // Adjusted button size
                                        height: '40px',
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
                                            height: '5px', // Adjusted height for the progress bar
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

export default LikedSongsPage;
