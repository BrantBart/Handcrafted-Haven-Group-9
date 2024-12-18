"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Import usePathname
import { getUserId } from "@/utils/merch";

export default function ReviewForm() {
  const pathname = usePathname(); // Get the current path
  const merchIdFromUrl = pathname.split("/").pop(); // Extract merchId from the path

  const [userId, setUserId] = useState<number>(); // User ID state
  const [merchId, setMerchId] = useState<number | null>(null); // Merch ID state
  const [comment, setComment] = useState(""); // Comment state
  const [reviewScore, setReviewScore] = useState<number | null>(null); // Review score state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Ensure all required fields are filled
    if (!comment || reviewScore === null || !userId || !merchId) {
      setMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/reviews/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          merch_id: merchId, // Use the merchId state
          comment,
          review_score: reviewScore,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Review submitted successfully!");
      } else {
        setMessage(data.message || "An error occurred.");
      }
    } catch (error) {
      setMessage("Failed to submit review. Please try again.");
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const result = await getUserId();
      setUserId(result);
    };

    fetchUserId();

    // Set merchId from URL if available
    if (merchIdFromUrl) {
      setMerchId(Number(merchIdFromUrl)); // Convert merchId to a number
    }
  }, [merchIdFromUrl]);

  return (
    <form className="space-y-3" onSubmit={handleSubmitReview}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pt-6 text-black">
        <h1 className="mb-3 text-2xl">Submit a Review</h1>
        {message && (
          <div className="bg-blue-500 text-white p-2 rounded mb-4">
            {message}
          </div>
        )}

        {/* Comment Field */}
        <div className="w-full">
          <label
            className="mb-3 mt-5 block text-xs font-medium"
            htmlFor="comment"
          >
            Review Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            className="block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm placeholder:text-gray-500 bg-gray-300 text-black"
            placeholder="Enter your review here"
            rows={4}
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Review Score Input */}
        <div className="mt-4">
          <label className="mb-3 mt-5 block text-xs font-medium">Rating</label>
          <input
            type="number"
            value={reviewScore || ""}
            onChange={(e) => setReviewScore(Number(e.target.value))}
            min="1"
            max="5"
            className="block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm placeholder:text-gray-500 bg-gray-300 text-black"
            placeholder="Enter a rating between 1 and 5"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full p-3 bg-blue-500 text-white"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
}
