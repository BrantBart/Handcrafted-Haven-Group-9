"use client";
import { useState, useEffect } from "react";
import Select from "react-select";
import Link from "next/link";
import Image from "next/image";
import { getMerch, getCategories, isSellerSession } from "@/utils/merch";

interface Merch {
  merch_id: string;
  name: string;
  created_on: string;
  price: number;
  description: string;
  image_link: string;
}

export default function GalleryMerchPage() {
  const [merch, setMerch] = useState<Merch[]>([]);
  const [isSeller, setIsSeller] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]); // Now an array for multi-select
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]); // Changed to { value, label }

  useEffect(() => {
    async function fetchAndSetCategories() {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    }
    fetchAndSetCategories();
  }, []);

  // Fetch merch whenever searchQuery or categoryFilter changes
// Debounce search query
useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedQuery(searchQuery);
  }, 500); // 500ms debounce delay

  return () => {
    clearTimeout(handler); // Clear timeout if searchQuery changes again
  };
}, [searchQuery]);

// Fetch merch when debouncedQuery or categoryFilter changes
useEffect(() => {
  async function fetchAndSetMerch() {
    const merchData = await getMerch(debouncedQuery, categoryFilter);
    setMerch(merchData);
  }
  fetchAndSetMerch();
}, [debouncedQuery, categoryFilter]);

  // Handle category filter change
  const handleCategoryChange = (selectedOptions: unknown) => {
    const selectedValues =
      (selectedOptions as Array<{ value: string }>)?.map(
        (option) => option.value
      ) ?? [];
    setCategoryFilter(selectedValues);
  };

  useEffect(() => {
    const fetchSession = async () => {
      const result = await isSellerSession();
      setIsSeller(result ?? false);
    };
    fetchSession();
  });

  return (
    <main>
      {/* Search Bar */}
      <div className="flex lg:flex-row text-center sm:flex-col justify-center items-center mb-4 gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for items..."
          className="w-full max-w-md px-4 py-2 border rounded-lg"
        />
        <Select
          isMulti
          options={categories} // Options are now in { value, label } format
          value={categories.filter((cat) => categoryFilter.includes(cat.value))} // Filter categories to match the selected values
          onChange={handleCategoryChange}
          placeholder="Select categories"
          className="react-select-container w-full max-w-md"
          classNamePrefix="react-select"
        />

      {/* Create New List Item */}
      {isSeller && (
        <Link
        href="merch/create"
        className="grid self-center gap-2 rounded-lg bg-black px-6 py-3 text-sm text-center font-medium text-white transition-colors w-auto max-w-xs" // Adjust width for Link
        >
        Create New List Item
      </Link>
      )}
      </div>

      {/* Merchandise Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
        {merch.length > 0 ? (
          merch.map((merchItem) => (
            <div
              key={merchItem.merch_id}
              className="border p-4 h-72 rounded-lg shadow-lg transition-shadow hover:shadow-xl bg-[#a3b18aff] hover:bg-[#dad7cdff]"
            >
              <Link href={`/merch/${merchItem.merch_id}`}>
                <div className="relative group h-full">
                  {merchItem.image_link ? (
                    <div className="relative h-48">
                      <Image
                        src={merchItem.image_link}
                        alt={merchItem.description}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md cursor-pointer transition-transform duration-300 group-hover:blur-[0.5px]"
                      />
                    </div>
                  ) : (
                    <p className="text-center text-black text-lg font-bold">
                      Image not available
                    </p>
                  )}
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-medium">{merchItem.name}</h3>
                    <p className="text-sm text-gray-600">${merchItem.price}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center h-72">
            <p className="text-center text-black font-bold text-4xl">
              No merchandise found, please refine your search!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
