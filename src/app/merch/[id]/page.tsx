import { neon } from "@neondatabase/serverless";
import Image from "next/image";

const sql = neon(`${process.env.DATABASE_URL}`);
// let reviewScore = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MerchIndividualPage({ params }: PageProps) {
  // Fetch the specific merch item by id
  async function getMerchItem(id: string) {
    try {
      const merchQuery = `
        SELECT merch.*, users.username, STRING_AGG(categories.name, ', ') AS Categories
        FROM merch
        JOIN users ON merch.user_id = users.user_id
        LEFT JOIN merch_categories ON merch.merch_id = merch_categories.merch_id
        LEFT JOIN categories ON merch_categories.category_id = categories.category_id
        WHERE merch.merch_id = ${id}
        GROUP BY merch.merch_id, users.username, merch.name, merch.created_on, merch.price, merch.description, merch.image_link
      `;
      const result = await sql(merchQuery);
      return result.length > 0 ? result[0] : null; // Return the item if found, otherwise null
    } catch (error) {
      console.error("Error fetching merch item:", error);
      return null;
    }
  }

  // Fetch the reviews for the specific merch item
  async function getReviews(id: string) {
    try {
      const reviewsQuery = `
        SELECT reviews.review_score, reviews.comment, reviews.created_on, users.username
        FROM reviews
        JOIN users ON reviews.user_id = users.user_id
        WHERE reviews.merch_id = ${id}
        ORDER BY reviews.created_on DESC
      `;
      const result = await sql(reviewsQuery);
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

  const averageRating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.review_score, 0) /
      reviews.length
    : 0;

  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    // Create the star rating HTML
    const stars = [
      ...Array(fullStars).fill("★"),
      ...Array(halfStar).fill("⯨"),
      ...Array(emptyStars).fill("☆"),
    ];

    return stars.join("");
  };

  return (
    <main>
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
                <p className="text-center text-black font-bold">Image not available</p>
              )}
            </div>
            <div className="flex flex-col justify-between space-y-4">
              <h2 className="text-2xl font-semibold">{merch.name}</h2>
              <p className="text-lg font-bold">Price: ${merch.price}</p>
              <p className="text-lg text-yellow-500">
                {renderStarRating(averageRating)} ({averageRating.toFixed(1)} /
                5)
              </p>
              <p className="text-black">{merch.description}</p>
              
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
                  <p className="text-black">{review.comment}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(review.created_on).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-black font-bold">No reviews yet</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-black">Merch item not found.</p>
      )}
    </main>
  );
}
