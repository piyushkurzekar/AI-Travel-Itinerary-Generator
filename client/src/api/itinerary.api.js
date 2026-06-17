import api from "./axios";

export const generateItinerary = (data) =>
  api.post("/itineraries/generate", data);

export const getItineraries = (params) =>
  api.get("/itineraries", { params });

export const getItinerary = (id) => api.get(`/itineraries/${id}`);

export const updateItinerary = (id, data) =>
  api.put(`/itineraries/${id}`, data);

export const deleteItinerary = (id) => api.delete(`/itineraries/${id}`);

export const enableSharing = (id) =>
  api.post(`/itineraries/${id}/share`);

export const regenerateShareLink = (id) =>
  api.post(`/itineraries/${id}/share/regenerate`);

export const disableSharing = (id) =>
  api.patch(`/itineraries/${id}/share/disable`);

export const getSharedItinerary = (shareId) =>
  api.get(`/shared/${shareId}`);
