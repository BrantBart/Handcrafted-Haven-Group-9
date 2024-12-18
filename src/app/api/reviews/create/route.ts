import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

export async function POST(req: Request) {
  try {
    // Parse incoming JSON request body
    const { user_id, merch_id, comment, review_score } = await req.json();

    // Validate the input data
    if (!user_id || !merch_id || !comment || review_score === null) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    if (review_score < 1 || review_score > 5) {
      return NextResponse.json(
        { message: "Review score must be between 1 and 5." },
        { status: 400 }
      );
    }

    // SQL query to insert the new review into the "reviews" table
    const query = `
      INSERT INTO reviews (user_id, merch_id, comment, review_score)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [user_id, merch_id, comment, review_score];

    const result = await sql(query, values);

    // Access the first record directly since result is an array
    const insertedReview = result[0];

    return NextResponse.json({
      message: "Review created successfully",
      review: insertedReview, // Return inserted row
    });
  } catch (error: unknown) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
