"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProfessorPage() {
  const [prof, setProf] = useState(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
//
//    /professor/278fsbfsj
//


  useEffect(() => {
    // fetch professor
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/professors/${params.id}`)
    .then(res => res.json())
    .then(data => setProf(data))
    .catch(err => console.error(err));
  
    // fetch reviews
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${params.id}`)
    .then(res => res.json())
    .then(data => setReviews(Array.isArray(data) ? data : []))
    .catch(err => console.error(err));
  
  }, [params.id]);

  const handleSubmit = async () => {

    if(isSubmitting) return;

    const numRating = Number(rating);

    if (isNaN(numRating) || numRating < 1 || numRating > 10) {
      alert("Rating must be between 1 and 10");
      return;
    }
    
    if (!comment.trim()) {
      alert("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          professor_id: params.id,
          rating: numRating,
          comment: comment.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit review");
      }

      const data = await res.json();

      console.log(data);

      const newReviews = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${params.id}`)
        .then((res) => res.json());

      setReviews(Array.isArray(newReviews) ? newReviews : []);

      alert("Review submitted ✅");

      setRating("");
      setComment("");
    } catch (err) {
      console.error(err);
      alert("Something Went Wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!prof) return <p>Loading...</p>;

  const avgRating =
  reviews.length > 0
    ? (
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      ).toFixed(1)
    : "N/A";

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <Link
        href="/"
        style={{
          color: "white",
          textDecoration: "none",
          display: "inline-block",
          marginBottom: "20px",
        }}
      >
        ← Back
      </Link>

      <h1>{prof.name}</h1>
      <p>{prof.department}</p>
      <p>⭐ {avgRating}</p>

      <div style={{ marginTop: "30px" }}> 
        <h3>Add Review</h3>

        <input
          type="number"
          placeholder="Rating (1-10)"
          min = "1"
          max = "10"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          style={{
            padding: "10px",
            marginBottom: "10px",
            width: "100%",
            borderRadius: "8px",
          }}
        />

        <textarea
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{
            padding: "10px",
            marginBottom: "10px",
            width: "100%",
            borderRadius: "8px",
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            cursor: isSubmitting ? "not-allowed" : "pointer",
            padding: "10px 20px",
            borderRadius: "8px",
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

      </div>

      <div style={{ marginTop: "40px" }}>
        <h3>Reviews</h3>

        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                border: "1px solid #333",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "10px",
              }}
            >
              <p>⭐ {rev.rating}</p>
              <p>{rev.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}