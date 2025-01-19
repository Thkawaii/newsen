import React, { useEffect, useState } from "react";
import "./edit.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Endpoint } from "../../../config/Endpoint";
import { apiRequest } from "../../../config/ApiService";

import { Select, MenuItem, Checkbox, ListItemText } from "@mui/material";

interface Review {
  review_id: number;
  rating: number;
  comment: string;
  booking_id: number;
  passenger_id: number;
  driver_id: number;
  feedback: string;
}

const Edit: React.FC = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    driverId: "",
    passengerId: "",
    comment: "",
    rating: "",
  });

  const [feedbackOptions, setFeedbackOptions] = React.useState<string[]>([]);

  const location = useLocation();
  const { reviewId } = location.state || {};

  const [review, setReview] = useState<Review | null>();

  const fetchReview = async () => {
    try {
      const response = await apiRequest<Review>(
        "GET",
        `${Endpoint.REVIEW}/${reviewId}`
      );

      if (response) {
        setReview(response);

        const feedbackArray = response.feedback
          ? response.feedback.split(",").map((item) => item.trim())
          : [];
        setFeedbackOptions(feedbackArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReview();
  }, []);

  const availableFeedbacks = [
    "like",
    "dislike",
    "love",
    "comfortable",
    "safety",
    "communication",
    "cleanliness",
  ];

  const handleChangeFeedback = (event: any) => {
    const { value } = event.target;
    setFeedbackOptions(typeof value === "string" ? value.split(",") : value);
  };

  const offensiveWords = {
    shit: "s*",
    damn: "d*",
    hell: "h*",
    stupid: "s*",
    fuck: "f*",
    asshole: "a*",
    bastard: "b*",
    jerk: "j*",
    crap: "c*",
    bitch: "b*",
    ควาย: "ค*",
    บ้า: "บ*",
    แม่ง: "แ*",
    กาก: "ก*",
    เลว: "ล*",
    สันดาน: "ส*",
    ไอ้เวร: "ไ*",
    โง่: "โ*",
    ถ่อย: "ถ*",
    ชั่ว: "ช*",
    ไอ้: "อ*",
  };

  const handleSave = async () => {
    try {
      if (review != null) {
        let containsOffensiveWord = false;

        Object.keys(offensiveWords).forEach((word) => {
          const regex = new RegExp(word, "gi");
          if (regex.test(review?.comment)) {
            containsOffensiveWord = true;
          }
        });

        if (containsOffensiveWord) {
          alert("คำไม่สุภาพไม่สามารถแสดงข้อมูลได้");
          return;
        }

        if (review.rating < 1) {
          alert("Rating must be between 1 and 5.");
          return;
        }

        const reviewData = {
          rating: review.rating,
          comment: review.comment.trim(),
          booking_id: review.booking_id,
          passenger_id: review.passenger_id,
          driver_id: review.driver_id,
          feedback:
            feedbackOptions.length > 0 ? feedbackOptions.join(", ") : "",
        };

        const response = await apiRequest(
          "PUT",
          `${Endpoint.REVIEW}/${review.review_id}`,
          reviewData
        );

        if (response) {
          alert("Review updated Successfully!");
          navigate("/review/history");
        }
      } else {
        alert("Failed to update review.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update review.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleChange = (field: keyof Review, value: string | number) => {
    setReview((prev: any) => {
      return { ...prev, [field]: value };
    });
    validateField(field, value);
  };
  const validateField = (field: keyof Review, value: string | number) => {
    let errorMessage = "";

    if (field === "driver_id" || field === "passenger_id") {
      if (!/^\d+$/.test(value as string)) {
        errorMessage = "Must be numeric only.";
      }
    }

    if (field === "rating") {
      if ((value as number) < 1 || (value as number) > 5) {
        errorMessage = "Rating must be between 1 and 5.";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: errorMessage }));
  };

  return (
    <div className="em">
      <div className="edit-card">
        <h2 className="edit-title">Edit Review</h2>
        <div className="edit-form">
          <div className="form-row">
            <label>Driver ID</label>
            <input
              type="number"
              value={review?.driver_id}
              onChange={(e) =>
                handleChange("driver_id", parseInt(e.target.value))
              }
              style={{ color: "#000000" }}
            />
            {errors.driverId && (
              <div className="error-message">{errors.driverId}</div>
            )}
          </div>
          <div className="form-row">
            <label>Passenger ID</label>
            <input
              type="number"
              value={review?.passenger_id}
              onChange={(e) =>
                handleChange("passenger_id", parseInt(e.target.value))
              }
              style={{ color: "#000000" }}
            />
            {errors.passengerId && (
              <div className="error-message">{errors.passengerId}</div>
            )}
          </div>
          <div className="form-row">
            <label>Review ID</label>
            <input
              type="number"
              value={review?.review_id}
              style={{ color: "#000000" }}
              readOnly
            />
          </div>
          <div className="form-row">
            <label>Comment</label>
            <input
              type="text"
              value={review?.comment}
              onChange={(e) => handleChange("comment", e.target.value)}
              style={{ color: "#000000" }}
            />
            {errors.comment && (
              <div className="error-message">{errors.comment}</div>
            )}
          </div>

          <div className="form-row">
            <label>Feedback</label>
            <Select
              multiple
              value={feedbackOptions}
              onChange={handleChangeFeedback}
              displayEmpty
              size="small"
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return (
                    <span style={{ color: "#888888" }}>Select Feedback</span>
                  );
                }
                return selected.join(", ");
              }}
              style={{
                padding: "5px 3px",
                borderRadius: "12px",
                fontSize: "14px",
                background: "#f9f9f9",
              }}
            >
              {availableFeedbacks.map((feedback) => (
                <MenuItem key={feedback} value={feedback}>
                  <Checkbox
                    checked={feedbackOptions.indexOf(feedback) > -1}
                    size="small"
                  />
                  <ListItemText primary={feedback} />
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className="form-row">
            <label>Rating</label>
            <input
              type="number"
              min={1}
              max={5}
              value={review?.rating}
              onChange={(e) => handleChange("rating", parseInt(e.target.value))}
              style={{ color: "#000000" }}
            />
            {errors.rating && (
              <div className="error-message">{errors.rating}</div>
            )}
          </div>
        </div>
        <div className="edit-actions">
          <button className="back-btn" onClick={handleBack}>
            Go Back
          </button>
          <button className="save-btx" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edit;
