"use client";

import { useEffect, useState } from "react";
import { getUserId } from "@/utils/merch";

export default function CreateMerchForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<number>(); // State to store the user ID
  useEffect(() => {
    const fetchUserId = async () => {
      const result = await getUserId();
      setUserId(result);
    };
    fetchUserId();
  }, []);

  const handleCreateMerch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);
    setMessage("");

    // Get form values
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const description = formData.get("description") as string;
    const imageLink = formData.get("image_link") as string;

    if (!name || !userId || !price || !description || !imageLink) {
      setMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }


    try {
      const response = await fetch("/api/merch/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          user_id: userId,
          price,
          description,
          image_link: imageLink,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Merchandise created successfully!");
      } else {
        setMessage(data.message || "An error occurred.");
      }
    } catch (error) {
      setMessage("Failed to create merchandise. Please try again.");
      console.error("Error creating merchandise:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleCreateMerch}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pt-6 login-form text-black">
        <h1 className="mb-3 text-2xl">Create New Merchandise!</h1>
        {message && (
          <div className="bg-blue-500 text-white p-2 rounded mb-4">
            {message}
          </div>
        )}
        <div className="w-full">
          {/* Name Field */}
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium"
              htmlFor="name"
            >
              Name
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500 bg-gray-300 text-black"
                id="name"
                type="text"
                name="name"
                placeholder="Enter the merchandise name"
                required
              />
            </div>
          </div>
          {/* Price Field */}
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium"
              htmlFor="price"
            >
              Price
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500 bg-gray-300 text-black"
                id="price"
                type="number"
                name="price"
                placeholder="Enter the price"
                required
              />
            </div>
          </div>
          {/* Description Field */}
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium"
              htmlFor="description"
            >
              Description
            </label>
            <div className="relative">
              <textarea
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500 bg-gray-300 text-black"
                id="description"
                name="description"
                placeholder="Enter a description"
                required
              />
            </div>
          </div>
          {/* Image Link Field */}
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium"
              htmlFor="image_link"
            >
              Image Link
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500 bg-gray-300 text-black"
                id="image_link"
                type="url"
                name="image_link"
                placeholder="Enter the image URL"
                required
              />
            </div>
          </div>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full create-account-button p-3"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Merchandise"}
        </button>

        {/* Display the userId in a p tag */}
        {userId && <p className="mt-4 text-blue-500">User ID: {userId}</p>}
      </div>
    </form>
  );
}
