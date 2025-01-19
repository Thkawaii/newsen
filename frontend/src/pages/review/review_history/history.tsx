import React, { useEffect, useState } from "react";
import "./History.css";
import { Outlet, useNavigate } from "react-router-dom";
import { apiRequest } from "../../../config/ApiService";
import { Endpoint } from "../../../config/Endpoint";

interface Review {
  review_id: number;
  rating: number;
  comment: string;
  booking_id: number;
  passenger_id: number;
  driver_id: number;
  feedback: string;
}

const History: React.FC = () => {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<Review[]>([]);

  const loadReviews = async () => {
    const response = await apiRequest<Review[]>("GET", Endpoint.REVIEW);

    if (response) {
      setReviews(response);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleEdit = (review_id: string): void => {
    navigate(`/edit`, {
      state: {
        reviewId: review_id,
      },
    });
  };

  const handleDelete = async (reviewId: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete review with ID: ${reviewId}?`
    );

    if (confirmDelete) {
      try {
        const response = await apiRequest(
          "DELETE",
          `${Endpoint.REVIEW}/${reviewId}`
        );

        if (response) {
          await loadReviews();
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert(`An error occurred while deleting review with ID: ${reviewId}.`);
      }
    }
  };


  const handleBackToHome = (): void => {
    navigate("/home");
  };

  return (
    <div className="gg">
      <div className="review-history-container">
        {/* Content */}
        <div className="review-history-content">
          <div className="lol">Review History</div>
          <table className="review-table">
            <thead>
              <tr>
                <th>Review ID</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Feedback</th>
                <th>Booking ID</th>
                <th>Passenger ID</th>
                <th>Driver ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review: any) => (
                <tr key={review.review_id}>
                  <td>{review.review_id}</td>
                  <td>{review.rating}</td>
                  <td>{review.comment}</td>
                  <td>{review.feedback}</td>
                  <td>{review.booking_id}</td>
                  <td>{review.passenger_id}</td>
                  <td>{review.driver_id}</td>
                  <td>
                    {/* Edit Button */}
                    <button
                      className="ii"
                      onClick={() => handleEdit(review.review_id)}
                      style={{ marginRight: "5px" }}
                    >
                      Edit
                    </button>
                    {/* Delete Button */}
                    <button
                      className="oo"
                      onClick={() => handleDelete(review.review_id)}
                      style={{ marginRight: "5px" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
           {/* Back to Home Button */}
        <button
          className="back-to-home-button"
          onClick={handleBackToHome}
        >
          Back to Home
        </button>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default History;
