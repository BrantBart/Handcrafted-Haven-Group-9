import { neon } from "@neondatabase/serverless";

export default async function MerchPage({
  params,
}: {
  params: { id: string };
}) {
  // Function to fetch merch data for a specific item based on the 'id' in the URL
  async function getIndividualMerch(id: string) {
    const sql = neon(`${process.env.DATABASE_URL}`);
    try {
      // Query to fetch merch details, join with user and categories, and fetch reviews as separate entries
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

      // Execute the query and fetch the first result
      const result = await sql(query, [id]);
      return result[0] || null; // Returning the first result or null if not found
    } catch (error) {
      console.error("Error fetching individual merch:", error);
      return null; // Return null if an error occurs
    }
  }

  // Function to fetch reviews based on the merch id
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
      return []; // Return empty array if an error occurs
    }
  }

  // Fetch the specific merch data and reviews based on the 'id' from the URL
  const merch = await getIndividualMerch(params.id);
  const reviews = await getReviews(params.id);

  if (!merch) {
    return <p className="text-center text-red-500">Merch item not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Main Content Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Container */}
        <div className="w-full h-full">
          <img
            src={merch.image_link}
            alt={merch.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Information Container */}
        <div className="flex flex-col justify-between space-y-4">
          <h2 className="text-2xl font-semibold">{merch.name}</h2>
          <p className="text-gray-600">{merch.description}</p>
          <p className="text-lg font-bold">Price: ${merch.price}</p>
          <p className="text-lg">Categories: {merch.categories}</p>
          <p className="text-lg">Seller: {merch.username}</p>
          <p className="text-lg">Ratings: ★★★★☆ </p>{" "}
          {/* Placeholder for ratings */}
        </div>
      </div>

      {/* Reviews Section */}
      {reviews.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Reviews</h3>
          <div>
            {reviews.map((review: any, index: number) => (
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

      <a
        href="/merch"
        className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Back to Gallery
      </a>
    </div>
  );
}
