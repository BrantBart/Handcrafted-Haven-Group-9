"use client";
import { useState } from "react";

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCreateUser = async () => {
    setLoading(true);
    setMessage(""); // Clear previous messages

    try {
      // Request to create a new user with mock data
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "testuser", // You can replace these with dynamic values
          email: "newuser@example.com",
          password: "password123", // Store securely in production
          seller: false, // This will be false for now (you can adjust this)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("User created successfully!");
      } else {
        setMessage(data.message || "An error occurred.");
      }
    } catch (error) {
      setMessage("Failed to create user. Please try again.");
      console.error("Error creating user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-sm w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create New User
        </h2>
        {message && (
          <div className="bg-blue-500 text-white p-2 rounded mb-4">
            {message}
          </div>
        )}
        <button
          onClick={handleCreateUser}
          className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </div>
    </div>
  );
}
