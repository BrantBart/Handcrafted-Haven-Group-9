"use client";
import { useState, useEffect } from "react";
import Select from "react-select";
import Link from "next/link";
import Image from "next/image";
import { neon } from "@neondatabase/serverless";
import { getSession } from "@/actions";
const sql = neon(`${process.env.NEXT_PUBLIC_DATABASE_URL}`);
const session = await getSession();

async function getMerch(searchQuery = "", categoryFilter: string[] = []) {
  try {
    // Query to fetch goods and join with users and categories
    let query = `
      SELECT 
        merch.*, 
        users.username,
        STRING_AGG(categories.name, ', ') AS Categories,
        STRING_AGG(reviews.review_id::text, ' | ') AS Reviews
      FROM merch
      JOIN users ON merch.user_id = users.user_id
      LEFT JOIN merch_categories ON merch.merch_id = merch_categories.merch_id
      LEFT JOIN categories ON merch_categories.category_id = categories.category_id
      LEFT JOIN reviews ON merch.merch_id = reviews.merch_id
    `;

    // Add search filter
    if (searchQuery) {
      query += ` WHERE merch.name ILIKE '%${searchQuery}%'`;
    }

    // Add category filter (multiple categories)
    if (categoryFilter && categoryFilter.length > 0) {
      query += searchQuery
        ? ` AND categories.name IN (${categoryFilter
            .map((cat) => `'${cat}'`)
            .join(", ")})`
        : ` WHERE categories.name IN (${categoryFilter
            .map((cat) => `'${cat}'`)
            .join(", ")})`;
    }

    query += `
      GROUP BY 
        merch.merch_id, 
        users.username,
        merch.name,
        merch.created_on,
        merch.price,
        merch.description,
        merch.image_link
    `;

    return (await sql(query)) as unknown as Promise<Merch[]>;
  } catch (error) {
    console.error("Error fetching goods:", error);
    return [];
  }
}

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
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]); // Now an array for multi-select
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]); // Changed to { value, label }

  // Fetch categories for filter dropdown
  useEffect(() => {
    async function fetchCategories() {
      const query = `SELECT DISTINCT name FROM categories`;
      const result = await sql(query);
      setCategories(
        result.map((cat) => ({ value: cat.name, label: cat.name }))
      ); // Set categories in { value, label } format
    }
    fetchCategories();
  }, []);

  // Fetch merch when search or filter changes
  useEffect(() => {
    async function fetchMerch() {
      const merchData = await getMerch(searchQuery, categoryFilter);
      setMerch(merchData);
    }
    fetchMerch();
  }, [searchQuery, categoryFilter]);

  // Handle category filter change (multi-select)
  const handleCategoryChange = (selectedOptions: unknown) => {
    const selectedValues =
      (selectedOptions as Array<{ value: string }>)?.map(
        (option) => option.value
      ) ?? [];
    setCategoryFilter(selectedValues);
  };

  return (
    <main>
      {/* Search Bar */}
      <div className="flex flex-row text-center justify-center items-center mb-4 gap-3">
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
      </div>

      {/* Create New List Item */}
      {session.isSeller && (
      <Link
        href="merch/create"
        className="grid self-center gap-2 rounded-lg bg-black px-6 py-3 text-sm text-center font-medium text-white transition-colors w-auto max-w-xs" // Adjust width for Link
      >
        Create New List Item
      </Link>
      )}

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
