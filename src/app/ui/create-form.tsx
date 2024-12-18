"use client";

import { useState } from "react";

export default function CreateForm() {
  const [isSeller, setIsSeller] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null); // State to track password match

  const handleKeyUp = () => {
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    const confirmPasswordInput = document.getElementById(
      "confirmPassword"
    ) as HTMLInputElement;

    if (passwordInput && confirmPasswordInput) {
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      if (password === confirmPassword) {
        setPasswordsMatch(true); // Set match state to true
        confirmPasswordInput.style.borderColor = "green";
        passwordInput.style.borderColor = "green";
        confirmPasswordInput.style.borderWidth = "3px";
        passwordInput.style.borderWidth = "3px";
      } else {
        setPasswordsMatch(false); // Set match state to false
        confirmPasswordInput.style.borderColor = "red";
        passwordInput.style.borderColor = "red";
        confirmPasswordInput.style.borderWidth = "3px";
        passwordInput.style.borderWidth = "3px";
      }
    }
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);
    setMessage("");

    // Get form values
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!username || !email || !password || isSeller === null || passwordsMatch === false) {
      setMessage("Please fill in all fields correctly.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          seller: isSeller,
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
    <form className="space-y-3" onSubmit={handleCreateUser}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pt-6 login-form text-black">
        <h1 className="mb-3 text-2xl">Create an Account with Us!</h1>
        {message && (
          <div className="bg-blue-500 text-white p-2 rounded mb-4">
            {message}
          </div>
        )}
        <div className="w-full">
          {/* Username Field */}
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium"
              htmlFor="username"
            >
              Username
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500 bg-gray-300 text-black"
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>
          {/* Email Field */}
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500 bg-gray-300 text-black"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>
          {/* Password Field */}
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500 bg-gray-300 text-black"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
                onKeyUp={handleKeyUp}
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-2 placeholder:text-gray-500 bg-gray-300 text-black"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                minLength={6}
                onKeyUp={handleKeyUp}
              />
            </div>
            {passwordsMatch === false && (
              <p className="text-red-500 text-xs mt-2">
                Passwords do not match!
              </p>
            )}
          </div>
          {/* Seller Option */}
          <div className="mt-4">
            <label className="mb-3 mt-5 block text-xs font-medium">
              Seller
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                className={`w-full create-account-button p-3 ${
                  isSeller === true
                    ? "seller-buttons text-white"
                    : "bg-gray-300 text-black"
                }`}
                onClick={() => setIsSeller(true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={`w-full create-account-button p-3 ${
                  isSeller === false
                    ? "seller-buttons text-white"
                    : "bg-gray-300 text-black"
                }`}
                onClick={() => setIsSeller(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full create-account-button p-3"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        ></div>
      </div>
    </form>
  );
}
