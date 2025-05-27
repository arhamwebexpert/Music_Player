import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import image from '../assets/download.jpeg'; // Default image for songs

const Player = ({ song, isPlaying, togglePlay, onNext, onPrevious }) => {
    const [progress, setProgress] = useState(0);  // Progress of the song
    const [currentTime, setCurrentTime] = useState('00:00');  // Current time of the song
    const [totalTime, setTotalTime] = useState('00:00');  // Total duration of the song
    const audioRef = useRef(null);  

    useEffect(() => {
        if (song && audioRef.current) {
            audioRef.current.src = `https://localhost:7293${song.fileUrl}`;  
            audioRef.current.load();  

            setProgress(0);  
            setCurrentTime('00:00'); 

           
            const handleLoadedMetadata = () => {
                setTotalTime(formatTime(audioRef.current.duration));  
            };

            audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

        
            return () => {
                if (audioRef.current) {
                    audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
                }
            };
        }
    }, [song]); 

    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch((error) => {
                console.error('Play interrupted:', error);
            });
        } else if (audioRef.current) {
            audioRef.current.pause();
        }
    }, [isPlaying]);  

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

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };


    const handleCanPlay = () => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play().catch((error) => {
                console.error('Play interrupted:', error);
            });
        }
    };

    const handleNext = () => {
        if (onNext) {
            onNext();  
        }
    };


    const handlePrevious = () => {
        if (onPrevious) {
            onPrevious();  
        }
    };

    return (
        song && (
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
                        {/* Song Details */}
                        <Col xs={3} className="d-flex align-items-center">
                            <img
                                src={image}
                                alt="Album Art"
                                className="me-3"
                                style={{ borderRadius: '50%', width: '60px', height: '60px' }}
                            />
                            <div>
                                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{song.name}</div>
                                <small style={{ color: '#bbb' }}>{song.singer}</small>
                            </div>
                        </Col>

                        {/* Play / Pause Button */}
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
                                onClick={togglePlay}  // Toggle play/pause
                            >
                                {isPlaying ? (
                                    <i className="fa fa-pause" style={{ fontSize: '20px' }}></i>
                                ) : (
                                    <i className="fa fa-play" style={{ fontSize: '20px' }}></i>
                                )}
                            </Button>
                        </Col>

                        {/* Progress Bar */}
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

                        {/* Additional Buttons (Next / Previous) */}
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

                <audio ref={audioRef} onCanPlay={handleCanPlay} onEnded={handleNext} preload="auto" />
            </div>
        )
    );
};

export default Player;
