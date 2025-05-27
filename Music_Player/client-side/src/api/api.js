import axios from 'axios';

const API_BASE_URL = 'https://localhost:7293/api'; // Replace with your API URL

export const getAlbums = () => axios.get(`${API_BASE_URL}/album`);
export const createAlbum = (data) => axios.post(`${API_BASE_URL}/album`, data);

export const getPlaylists = () => axios.get(`${API_BASE_URL}/playlists`);
export const createPlaylist = (data) => axios.post(`${API_BASE_URL}/playlists`, data);

export const getSongs = () => axios.get(`${API_BASE_URL}/songs`);
export const createSong = (data) => axios.post(`${API_BASE_URL}/songs`, data);

export const getUsers = () => axios.get(`${API_BASE_URL}/users`);
export const createUser = (data) => axios.post(`${API_BASE_URL}/users`, data);
