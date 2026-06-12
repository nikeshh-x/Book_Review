import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addReview, deleteReview, fetchBook, rateBook } from "../services/api";

const BookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    loadBook();
  }, [id]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const res = await fetchBook(id);
      setBook(res.data);
      if (res.data.user_rating) {
        setRating(res.data.user_rating);
      }
    } catch (error) {
      console.error("Failed to load book", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (score) => {
    if (!isAuthenticated) {
      alert("Please login to rate");
      return;
    }
    try {
      await rateBook(id, score);
      setRating(score);
      loadBook();
    } catch (error) {
      console.error("Failed to rate:", error);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please login to review");
      return;
    }
    try {
      await addReview(id, { title: reviewTitle, comment: reviewComment });
      setReviewTitle("");
      setReviewComment("");
      loadBook(); // Refresh to show new review
    } catch (error) {
      console.error("Failed to add review:", error);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setReviewTitle(review.title);
    setReviewComment(review.comment);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review ?")) return;
    try {
      await deleteReview(id, reviewId);
      loadBook();
    } catch (error) {
      console.error(("Failed to delete review", error));
    }
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setReviewTitle("");
    setReviewComment("");
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!book) return <div className="text-center py-10">Book not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to={"/"} className="p-4 text-blue-500 ">
        <span className="text-3xl">←</span> Back to Books
      </Link>
      <div className="bg-white rounded-lg shadow-md p-6 mt-4">
        
        <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
        <p className="text-gray-600 mb-4">{book.author}</p>

        <div className="flex items-center mb-4">
          <span className="text-yellow-500 text-2xl">★</span>
          <span className="text-xl font-semibold ml-2">
            {book.average_rating || "No Ratigns"}
          </span>
          <span className="text-gray-400 ml-2">
            ({book.total_ratings} ratings)
          </span>
        </div>
        <p className="text-gray-700 mb-6">{book.description}</p>

        {/* rating stars */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Your Rating:</h3>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                className={`text-3xl ${rating >= star ? "text-yellow-500" : "text-gray-300"} hover:text-yellow-400`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Add review */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Add Review</h3>
          {isAuthenticated ? (
            <form onSubmit={handleReview} className="space-y-3">
              <input
                type="text"
                placeholder="Review Title"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
              <textarea
                placeholder="Your Review"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                rows={4}
                required
              />

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingReview ? "Update Review" : "Submit Review"}
              </button>
              {editingReview && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-400 ml-2 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              )}
            </form>
          ) : (
            <p className="text-gray-500">
              Please{" "}
              <Link className="text-blue-600 font-semibold" to={"/login"}>
                Login
              </Link>{" "}
              to leave a review
            </p>
          )}
        </div>

        {/* Review List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Reviews ({book.reviews?.length || 0})
          </h3>
          {book.reviews?.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {book.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-l-4 border-blue-500 pl-4"
                >
                  <h4 className="font-semibold">{review.title}</h4>
                  <p className="text-gray-600">{review.comment}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    By {review.user?.username} on{" "}
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                  {isAuthenticated && review.user?.id == user?.id && (
                    <div className="mt-2 space-x-2">
                      <button
                        onClick={() => handleEdit(review)}
                        className="text-blue-500 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="text-red-500 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookPage;
