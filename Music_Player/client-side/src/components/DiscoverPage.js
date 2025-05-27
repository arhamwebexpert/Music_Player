import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import DiscoverCard from './DiscoverCard';
import Player from './Player'; 
import image from '../assets/2.jpg'; 

const DiscoverPage = ({ searchResults, onCreateSong }) => {
    const [loading, setLoading] = useState(true); 
    const [songs, setSongs] = useState([]); 
    const [filteredSongs, setFilteredSongs] = useState([]); 
    const [currentSongIndex, setCurrentSongIndex] = useState(0); 
    const [isPlaying, setIsPlaying] = useState(false); 
    const [progress, setProgress] = useState(0); 
    const [currentTime, setCurrentTime] = useState('00:00'); 
    const [totalTime, setTotalTime] = useState('00:00'); 
    const [searchQuery, setSearchQuery] = useState(''); 
    const audioRef = useRef(null); 

   
    useEffect(() => {
        setLoading(true);
        axios
            .get('https://localhost:7293/api/songs') 
            .then((response) => {
                setSongs(response.data);
                setFilteredSongs(response.data); 
                setLoading(false); 
            })
            .catch((error) => {
                console.error('Error fetching songs:', error);
                setLoading(false);             });
    }, []);

    useEffect(() => {
        if (songs[currentSongIndex] && audioRef.current) {
            audioRef.current.src = `https://localhost:7293${songs[currentSongIndex].fileUrl}`;
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
    }, [currentSongIndex, songs]);

    // When play/pause button is clicked, play or pause the song
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
                const duration = audioRef.current.duration || 1; // Avoid divide by zero
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

    // Format time to MM:SS format
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // Toggle play/pause state
    const togglePlay = () => {
        setIsPlaying((prev) => !prev);
    };

    // Go to the next song
    const handleNext = () => {
        if (currentSongIndex < songs.length - 1) {
            setCurrentSongIndex(currentSongIndex + 1);
            setIsPlaying(true); // Automatically start playing the next song
        }
    };

    // Go to the previous song
    const handlePrevious = () => {
        if (currentSongIndex > 0) {
            setCurrentSongIndex(currentSongIndex - 1);
            setIsPlaying(true); // Automatically start playing the previous song
        }
    };

    // Handle search input change and filter songs
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 2) {
            const filtered = songs.filter((song) =>
                song.name.toLowerCase().includes(query.toLowerCase()) ||
                song.singer.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredSongs(filtered);
        } else {
            setFilteredSongs(songs); // Show all songs when search query is less than 3 characters
        }
    };

    return (
        <div className="p-4" style={{ marginLeft: '250px' }}>
            <h2 className="text mb-4">Discover</h2>

            {/* Show loading spinner while loading */}
            {loading ? (
                <div className="d-flex justify-content-center align-items-center">
                    <Spinner animation="border" variant="light" />
                    <span className="ms-3 text">Loading...</span>
                </div>
            ) : (
                <div className="d-flex flex-wrap justify-content-start">
                    {/* Render search results if available, else render all songs */}
                    {(searchResults.length > 0 ? searchResults : filteredSongs).map((song, index) => (
                        <DiscoverCard
                            key={song.id}
                            title={song.name}
                            image={image}
                            tracks={song.singer}
                            genre={song.genre}
                            songId={song.id}
                            onPlay={() => setCurrentSongIndex(index)} // Set current song index when play is clicked
                        />
                    ))}
                </div>
            )}

            {/* Player Section */}
            {songs.length > 0 && currentSongIndex >= 0 && (
                <Player
                    song={songs[currentSongIndex]}
                    isPlaying={isPlaying}
                    togglePlay={togglePlay}
                    progress={progress}
                    currentTime={currentTime}
                    totalTime={totalTime}
                    handleNext={handleNext}
                    handlePrevious={handlePrevious}
                />
            )}
        </div>
    );
};

export default DiscoverPage;
