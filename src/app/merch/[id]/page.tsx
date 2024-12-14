import { neon } from "@neondatabase/serverless";
import Image from "next/image";
import Link from "next/link";

// Query to fetch merch details and reviews
async function getMerchData(id: string) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const query = `
    SELECT 
      merch.*, 
      users.username,
      STRING_AGG(categories.name, ', ') AS Categories,
      STRING_AGG(reviews.review_score::text, ', ') AS review_scores,  -- Aggregate the review scores
      STRING_AGG(reviews.comment, ', ') AS review_comments,            -- Aggregate the comments
      STRING_AGG(reviews.created_on::text, ', ') AS review_dates,      -- Aggregate the created_on
      STRING_AGG(users.username, ', ') AS reviewer_names               -- Aggregate reviewer names
    FROM merch
    JOIN users ON merch.user_id = users.user_id
    LEFT JOIN merch_categories ON merch.merch_id = merch_categories.merch_id
    LEFT JOIN categories ON merch_categories.category_id = categories.category_id
    LEFT JOIN reviews ON merch.merch_id = reviews.merch_id
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
  return result[0] || null; // Return the first result if available
}

export default async function MerchPage({
  params,
}: {
  params: { id: string };
}) {
  const merch = await getMerchData(params.id);

  if (!merch) {
    return <p>Item not found</p>;
  }

  // Split the aggregated data into arrays
  const reviewScores = merch.review_scores?.split(", ") || [];
  const reviewComments = merch.review_comments?.split(", ") || [];
  const reviewDates = merch.review_dates?.split(", ") || [];
  const reviewerNames = merch.reviewer_names?.split(", ") || [];

  // Handle case where the number of reviews might not match the number of reviewer names
  const reviews = reviewScores.map((score, index) => ({
    score,
    comment: reviewComments[index] || "No comment",
    date: new Date(reviewDates[index]),
    reviewer: reviewerNames[index] || "Anonymous",
  }));

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
                className="rounded-md"
              />
            </div>
          ) : (
            <p>Image not available</p>
          )}
        </div>
        <div className="flex flex-col justify-between space-y-4">
          <h2 className="text-2xl font-semibold">{merch.name}</h2>
          <p>{merch.description}</p>
          <p className="font-bold">Price: ${merch.price}</p>
          <p>Categories: {merch.categories}</p>
          <p>Seller: {merch.username}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Reviews</h3>
        <div>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="border-b py-2">
                <p>{review.reviewer}</p>
                <p>Rating: {review.score} / 5</p>
                <p>{review.comment}</p>
                <p>{review.date.toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet</p>
          )}
        </div>
      </div>

      <Link
        href="/merch"
        className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Back to Gallery
      </Link>
    </div>
  );
}
