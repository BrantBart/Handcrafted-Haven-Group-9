"use client";

import { logout } from "@/actions";
import { useRouter } from "next/navigation"; // Use router for navigation

const LogoutForm = () => {
  const router = useRouter();

  const handleLogout = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await logout(); // Execute logout function
      router.push("/"); // Redirect to home page after successful logout
    } catch (error) {
      console.error("Logout error", error); // Handle any potential errors
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-md font-medium hover:bg-[#588157ff] p-3 rounded-xl transition-colors"
    >
      Logout
    </button>
  );
};

export default LogoutForm;
