import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchBooks = () => api.get("/books/");
export const fetchBook = (id) => api.get(`/books/${id}/`);
export const rateBook = (id, score) =>
  api.post(`/books/${id}/rate_book/`, { score });
export const addReview = (id, review) =>
  api.post(`/books/${id}/add_review/`, review);
export const editReview = (bookId, reviewId, reviewData) =>
  api.put(`/books/${bookId}/edit_review/`, {
    review_id: reviewId,
    title: reviewData.title,
    comment: reviewData.comment,
  });
export const deleteReview = (bookId, reviewId) =>
  api.delete(`/books/${bookId}/delete_review/`, {
    data: { review_id: reviewId },
  });

export default api;
