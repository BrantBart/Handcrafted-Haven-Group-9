import { neon } from "@neondatabase/serverless";



export default async function AboutPage() {
  "use client";

  // Function to fetch all users
  async function getUsers() {
    const sql = neon(`${process.env.DATABASE_URL}`);
    try {
      return await sql("SELECT * FROM users");
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }

  // Function to fetch all merch with user info and categories names
  async function getMerch() {
    const sql = neon(`${process.env.DATABASE_URL}`);
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

  // Fetch the data for rendering
  const users = await getUsers();
  const merch = await getMerch();

  return (
    <main className="flex-grow flex flex-col justify-center text-center">
      {/* Users Table */}
      <h2 className="text-black mb-4">Users</h2>
      {users.length > 0 ? (
        <table className="table-auto border-collapse border border-black text-black mb-8">
          <thead>
            <tr>
              <th className="border border-black px-4 py-2">User ID</th>
              <th className="border border-black px-4 py-2">Username</th>
              <th className="border border-black px-4 py-2">Email</th>
              <th className="border border-black px-4 py-2">Password</th>
              <th className="border border-black px-4 py-2">Seller</th>
              <th className="border border-black px-4 py-2">Created On</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td className="border border-black px-4 py-2">
                  {user.user_id}
                </td>
                <td className="border border-black px-4 py-2">
                  {user.username}
                </td>
                <td className="border border-black px-4 py-2">{user.email}</td>
                <td className="border border-black px-4 py-2">
                  {user.password}
                </td>
                <td className="border border-black px-4 py-2">
                  {user.seller ? "Yes" : "No"}
                </td>
                <td className="border border-black px-4 py-2">
                  {new Date(user.created_on).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-black">No users found.</p>
      )}

      {/* Merch Table */}
      <h2 className="text-black mb-4">Merch</h2>
      {merch.length > 0 ? (
        <table className="table-auto border-collapse border border-black text-black mb-8">
          <thead>
            <tr>
              <th className="border border-black px-4 py-2">Merch ID</th>
              <th className="border border-black px-4 py-2">Name</th>
              <th className="border border-black px-4 py-2">Created On</th>
              <th className="border border-black px-4 py-2">Price</th>
              <th className="border border-black px-4 py-2">Description</th>
              <th className="border border-black px-4 py-2">Img Link</th>
              <th className="border border-black px-4 py-2">Seller</th>
              <th className="border border-black px-4 py-2">Categories</th>
              <th className="border border-black px-4 py-2">Reviews</th>
            </tr>
          </thead>
          <tbody>
            {merch.map((merchItem) => (
              <tr key={merchItem.merch_id}>
                <td className="border border-black px-4 py-2">
                  {merchItem.merch_id}
                </td>
                <td className="border border-black px-4 py-2">
                  {merchItem.name}
                </td>
                <td className="border border-black px-4 py-2">
                  {new Date(merchItem.created_on).toLocaleDateString()}
                </td>
                <td className="border border-black px-4 py-2">
                  {merchItem.price}
                </td>
                <td className="border border-black px-4 py-2">
                  {merchItem.description}
                </td>
                <td className="border border-black px-4 py-2">
                  {merchItem.image_link}
                </td>
                <td className="border border-black px-4 py-2">
                  {merchItem.username}
                </td>
                <td className="border border-black px-4 py-2">
                  {merchItem.categories}
                </td>
                <td className="border border-black px-4 py-2">
                  {merchItem.reviews || "No reviews yet"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-black">No merchandise found.</p>
      )}
    </main>
  );
}
