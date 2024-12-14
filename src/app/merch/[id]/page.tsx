import { neon } from "@neondatabase/serverless";
import Image from "next/image";

const sql = neon(`${process.env.DATABASE_URL}`);

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MerchIndividualPage({ params }: PageProps) {
  // Fetch the specific merch item by id
  async function getMerchItem(id: string) {
    try {
      const result = await sql`SELECT * FROM merch WHERE merch_id = ${id}`;
      return result.length > 0 ? result[0] : null; // Return the item if found, otherwise null
    } catch (error) {
      console.error("Error fetching merch item:", error);
      return null;
    }
  }

  // Fetch the reviews for the specific merch item
  async function getReviews(id: string) {
    try {
      const result = await sql`SELECT * FROM reviews WHERE merch_id = ${id}`;
      return result.length > 0 ? result : []; // Return all reviews or an empty array if none
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return []; // Return empty array in case of error
    }
  }

  // Resolve the params Promise
  const { id } = await params;

  // Fetch the merch item and reviews
  const merch = await getMerchItem(id);
  const reviews = await getReviews(id);

  return (
    <main>
      <h2 className="text-black mb-4">Merch Item</h2>
      {merch ? (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="w-full h-full">
              {merch.image_link ? (
                <Image
                  src={merch.image_link}
                  alt={merch.description}
                  width={300}
                  height={300}
                  className="rounded-md cursor-pointer transition-transform duration-300 group-hover:blur-[0.5px]"
                />
              ) : (
                <p className="text-center text-gray-500">Image not available</p>
              )}
            </div>
            <div className="flex flex-col justify-between space-y-4">
              <h2 className="text-2xl font-semibold">{merch.name}</h2>
              <p className="text-gray-600">{merch.description}</p>
              <p className="text-lg font-bold">Price: ${merch.price}</p>
              <p className="text-lg">Categories: {merch.categories}</p>
              <p className="text-lg">Seller: {merch.username}</p>
            </div>
          </div>

          <div>
            {reviews.length ? (
              reviews.map((review, index) => (
                <div key={index} className="border-b py-2">
                  <p className="font-semibold">{review.username}</p>
                  <p className="text-yellow-500">
                    Rating: {review.review_score} / 5
                  </p>
                  <p className="text-gray-600">{review.comment}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(review.created_on).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No reviews yet</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-black">Merch item not found.</p>
      )}
    </main>
  );
}
