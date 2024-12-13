import { neon } from "@neondatabase/serverless";

export default async function AboutPage() {
  "use server";

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

  // Function to fetch all goods with user info and type names
  async function getGoods() {
    const sql = neon(`${process.env.DATABASE_URL}`);
    try {
      // Query to fetch goods and join with users and types
      const query = `
        SELECT goods.*, users.username, 
               STRING_AGG(types.name, ', ') as type_names
        FROM goods
        JOIN users ON goods.user_id = users.user_id
        LEFT JOIN goods_types ON goods.goods_id = goods_types.goods_id
        LEFT JOIN types ON goods_types.type_id = types.type_id
        GROUP BY goods.goods_id, users.username
      `;
      return await sql(query);
    } catch (error) {
      console.error("Error fetching goods:", error);
      return [];
    }
  }

  // Fetch the data for rendering
  const users = await getUsers();
  const goods = await getGoods();

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
                <td className="border border-black px-4 py-2">
                  {user.email}
                </td>
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

      {/* Goods Table */}
      <h2 className="text-black mb-4">Goods</h2>
      {goods.length > 0 ? (
        <table className="table-auto border-collapse border border-black text-black">
          <thead>
            <tr>
              <th className="border border-black px-4 py-2">Goods ID</th>
              <th className="border border-black px-4 py-2">Name</th>
              <th className="border border-black px-4 py-2">Username</th>
              <th className="border border-black px-4 py-2">Image Link</th>
              <th className="border border-black px-4 py-2">Types</th>
              <th className="border border-black px-4 py-2">Created On</th>
            </tr>
          </thead>
          <tbody>
            {goods.map((good) => (
              <tr key={good.goods_id}>
                <td className="border border-black px-4 py-2">
                  {good.goods_id}
                </td>
                <td className="border border-black px-4 py-2">
                  {good.name}
                </td>
                <td className="border border-black px-4 py-2">
                  {good.username}
                </td>
                <td className="border border-black px-4 py-2">
                  {good.image_link ? (
                    <a
                      href={good.image_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Image
                    </a>
                  ) : (
                    "No image available"
                  )}
                </td>
                <td className="border border-black px-4 py-2">
                  {good.type_names ? good.type_names : "No types"}
                </td>
                <td className="border border-black px-4 py-2">
                  {new Date(good.created_on).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-black">No goods found.</p>
      )}
    </main>
  );
}
