"use client";

import { useState, useEffect } from "react";

export default function ReviewCreate() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [reviews, setReviews] = useState<any[]>([]); // Store reviews locally

  const [merchId, setMerchId] = useState<string | null>(null); // State for merch_id

  // Extract merch_id from URL on component mount
  useEffect(() => {
    const url = window.location.href;
    const pathParts = url.split("/");
    const id = pathParts[pathParts.length - 1]; // Assuming the merch_id is the last part of the URL
    setMerchId(id);
  }, []);

  const handleCreateReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);
    setMessage("");

    // Get form values
    const formData = new FormData(e.currentTarget);
    const rating = formData.get("rating") as string;
    const userId = formData.get("user_id") as string;
    const description = formData.get("description") as string;

    if (!rating || !userId || !description || !merchId) {
      setMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    // Create a new review object
    const newReview = {
      merch_id: merchId,
      user_id: userId,
      review_score: rating,
      comment: description,
    };

    // Add the review to the reviews state (simulating a local DB)
    setReviews((prevReviews) => [...prevReviews, newReview]);

    // Show success message
    setMessage("Review created successfully!");

    // Reset form
    e.currentTarget.reset();
    setLoading(false);
  };

  return (
    <form className="space-y-3" onSubmit={handleCreateReview}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pt-6 login-form text-black">
        <h1 className="mb-3 text-2xl">Create New Review</h1>
        {message && (
          <div className="bg-blue-500 text-white p-2 rounded mb-4">
            {message}
          </div>
        )}

        {/* Rating Field */}
        <div className="mt-4">
          <label className="mb-3 mt-5 block text-xs font-medium" htmlFor="rating">
            Rating (1-5)
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500 bg-gray-300 text-black"
              id="rating"
              type="number"
              name="rating"
              min="1"
              max="5"
              placeholder="Rate from 1 to 5"
              required
            />
          </div>
        </div>

        {/* User ID Field */}
        <div className="mt-4">
          <label className="mb-3 mt-5 block text-xs font-medium" htmlFor="user_id">
            User ID
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500 bg-gray-300 text-black"
              id="user_id"
              type="text"
              name="user_id"
              placeholder="Enter your user ID"
              required
            />
          </div>
        </div>

        {/* Description Field */}
        <div className="mt-4">
          <label className="mb-3 mt-5 block text-xs font-medium" htmlFor="description">
            Review Description
          </label>
          <div className="relative">
            <textarea
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500 bg-gray-300 text-black"
              id="description"
              name="description"
              placeholder="Enter your review"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full create-account-button p-3"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
}
