import Link from "next/link";
import Image from "next/image";
import { neon } from "@neondatabase/serverless";
const sql = neon(`${process.env.DATABASE_URL}`);

async function getMerch() {
  "use client";
  try {
    // Query to fetch goods and join with users and categories
    const query = `
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
        GROUP BY 
          merch.merch_id, 
          users.username,
          merch.name,
          merch.created_on,
          merch.price,
          merch.description,
          merch.image_link
      `;
    return await sql(query);
  } catch (error) {
    console.error("Error fetching goods:", error);
    return [];
  }
}

const merch = await getMerch();

export default async function GalleryMerchPage() {
  // const images = await fetchHandcraftImages("handcraft");

  return (
    <main>
      <Link
        href="merch/create"
        className="grid self-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors"
      >
        Create New List Item
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-100">
        {merch.map((merch) => (
          <div
            key={merch.merch_id}
            className="border p-4 h-72 rounded-lg shadow-lg transition-shadow hover:shadow-xl bg-white"
          >
            {/* Link to Individual Image Page */}
            <Link href={`/merch/${merch.merch_id}`}>
              <div className="relative group h-full">
                {/* Image */}
                {merch.image_link ? (
                  <div className="relative h-48">
                    <Image
                      src={merch.image_link}
                      alt={merch.description}
                      layout="fill"
                      objectFit="cover" // Ensures the image fills the container
                      className="rounded-md cursor-pointer transition-transform duration-300 group-hover:blur-[0.5px]"
                    />
                  </div>
                ) : (
                  <p className="text-center text-gray-500">
                    Image not available
                  </p>
                )}

                {/* Photographer Name */}
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-medium">{merch.name}</h3>
                  <p className="text-sm text-gray-600">
                    {/* {formatPrice()} */}${merch.price}
                  </p>
                  {/* Mock price */}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
