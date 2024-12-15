// src/app/api/merch/create/route.ts
import { NextResponse } from "next/server";
// import { neon } from "@neondatabase/serverless";

// const sql = neon(`${process.env.DATABASE_URL}`);

export async function POST() {
  try {
    // Sample data to insert
    const placeholderData = {
      name: "Test",
      price: 1.99,
      description: "This is a sample description for a new merch item.",
      image_link: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRKOdU8ifR94YO3Zm9uMP_sN5_h2dqYjqToSxJvwlx3JV-dTGp9LIv2arzmBh-EGrOKXcXwoBvnHvejBOc83auemNLSaLAOPdkZkywChUyd8cB0PhCof6m5_35D9um26MueCU_CGVip2g&usqp=CAc",
      user_id: 2,
    };

    // SQL query to insert data
    // const query = `
    //   INSERT INTO merch (name, price, description, image_link, user_id)
    //   VALUES ($1, $2, $3, $4, $5)
    //   RETURNING *;
    // `;
    // const values = [
    //   placeholderData.name,
    //   placeholderData.price,
    //   placeholderData.description,
    //   placeholderData.image_link,
    //   placeholderData.user_id,
    // ];

    // Execute the query
    // const result = await sql(query, values);

    return NextResponse.json({
      message: "Merch item created successfully",
    //   merch: result.rows[0], // Return inserted row
    });
  } catch (error: unknown) {
    console.error("Error inserting merch:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
