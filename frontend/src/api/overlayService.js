import axios from 'axios';

const API_URL = 'http://localhost:5000/api/overlays'; // Backend URL

export const getOverlays = () => {
  return axios.get(API_URL);
};

export const createOverlay = (overlayData) => {
  return axios.post(API_URL, overlayData);
};

export const updateOverlay = (id, overlayData) => {
  return axios.put(`${API_URL}/${id}`, overlayData);
};

export const deleteOverlay = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};