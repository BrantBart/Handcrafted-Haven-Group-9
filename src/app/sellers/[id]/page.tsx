import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MerchIndividualPage({ params }: PageProps) {
  async function getMerchItem(id: string) {
    try {
      // Fetch only the specific merchandise item by id
      const result =
        await sql`SELECT merch_id FROM merch WHERE merch_id = ${id}`;
      return result.length > 0 ? result[0] : null; // Return the item if found, otherwise null
    } catch (error) {
      console.error("Error fetching merch item:", error);
      return null;
    }
  }

  // Resolve the params Promise
  const { id } = await params;

  const merch = await getMerchItem(id);

  return (
    <main>
      <h2 className="text-black mb-4">Merch Item</h2>
      {merch ? (
        <p className="text-black">
          Item ID: <strong>{merch.merch_id}</strong>
        </p>
      ) : (
        <p className="text-black">Merch item not found.</p>
      )}
    </main>
  );
}
