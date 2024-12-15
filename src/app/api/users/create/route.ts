import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

export async function POST(req: Request) {
  try {
    // Parse incoming JSON request body
    const { username, email, password, seller } = await req.json();

    // SQL query to insert the new user into the "users" table
    const query = `
      INSERT INTO users (username, email, password, seller)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [username, email, password, seller];

    const result = await sql(query, values);

    // Check if the result has rows and return the newly inserted user
    // const insertedUser = result.rows ? result.rows[0] : result[0];

    return NextResponse.json({
      message: "User created successfully",
    //   user: insertedUser, // Return inserted row
    });
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
