"use client";

export default function CreateMerchPage() {
  const createMerch = async () => {
    try {
      const response = await fetch("/api/merch/create", {
        method: "POST",
      });

      if (response.ok) {
        alert("New merch item created successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error: unknown) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <button
        onClick={createMerch}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Create New Merch Item
      </button>
    </div>
  );
}
