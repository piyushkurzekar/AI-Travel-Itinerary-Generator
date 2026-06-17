import api from "./axios";

export const extractBookings = (formData, onUploadProgress) =>
  api.post("/uploads/extract", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
