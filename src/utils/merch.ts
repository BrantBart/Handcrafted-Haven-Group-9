"use server";

import { neon } from "@neondatabase/serverless";
const sql = neon(`${process.env.NEXT_PUBLIC_DATABASE_URL}`) || neon(`${process.env.DATABASE_URL}`);
import { getSession } from "@/actions";

export async function isSellerSession(){
  const session = await getSession();
  return session.isSeller
}

export async function sessions(){
    const session = await getSession();
    return session
}

export async function getUserId(){
  const session = await getSession();
  return session.userId
}

export async function getMerch(searchQuery = "", categoryFilter: string[] = []) {
  interface Merch {
    merch_id: number;
    name: string;
    created_on: string;
    price: number;
    description: string;
    image_link: string;
  }
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

export async function getCategories(): Promise<{ value: string; label: string }[]> {
    try {
      const query = `SELECT DISTINCT name FROM categories`;
      const result = await sql(query);
      return result.map((cat) => ({ value: cat.name, label: cat.name }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }