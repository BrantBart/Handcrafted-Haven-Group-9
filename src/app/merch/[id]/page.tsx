import type { NextPage } from "next";
import { neon } from "@neondatabase/serverless";
import Link from "next/link";
import Image from "next/image";

// Define your PageProps type explicitly if not already defined
type MerchPageProps = {
  params: { id: string };
};

const sql = neon(`${process.env.DATABASE_URL}`);

const MerchPage: NextPage<MerchPageProps> = async ({ params }) => {
  // Function to fetch merch data for a specific item based on the 'id' in the URL
  async function getIndividualMerch(id: string) {
    try {
      const query = `
        SELECT 
          merch.*, 
          users.username,
          STRING_AGG(categories.name, ', ') AS Categories
        FROM merch
        JOIN users ON merch.user_id = users.user_id
        LEFT JOIN merch_categories ON merch.merch_id = merch_categories.merch_id
        LEFT JOIN categories ON merch_categories.category_id = categories.category_id
        WHERE merch.merch_id = $1
        GROUP BY 
          merch.merch_id, 
          users.username,
          merch.name,
          merch.created_on,
          merch.price,
          merch.description,
          merch.image_link
      `;
      const result = await sql(query, [id]);
      return result[0] || null;
    } catch (error) {
      console.error("Error fetching individual merch:", error);
      return null;
    }
  }

  async function getReviews(id: string) {
    const sql = neon(`${process.env.DATABASE_URL}`);
    try {
      const query = `
        SELECT 
          reviews.review_score, 
          reviews.comment, 
          reviews.created_on, 
          users.username
        FROM reviews
        JOIN users ON reviews.user_id = users.user_id
        WHERE reviews.merch_id = $1
        ORDER BY reviews.created_on DESC
      `;
      return await sql(query, [id]);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  }

  const merch = await getIndividualMerch(params.id);
  const reviews = await getReviews(params.id);

  if (!merch) {
    return <p className="text-center text-red-500">Merch item not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full h-full">
          {merch.image_link ? (
            <div className="relative h-48">
              <Image
                src={merch.image_link}
                alt={merch.description}
                layout="fill"
                objectFit="cover"
                className="rounded-md cursor-pointer transition-transform duration-300 group-hover:blur-[0.5px]"
              />
            </div>
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
          <p className="text-lg">Ratings: ★★★★☆</p>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Reviews</h3>
          <div>
            {reviews.map((review, index) => (
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
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">No reviews yet</p>
      )}

      <Link
        href="/merch"
        className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Back to Gallery
      </Link>
    </div>
  );
};

export default MerchPage;
