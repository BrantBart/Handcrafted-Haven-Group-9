"use server";

import { sessionOptions, SessionData, defaultSession } from "@/lib";
import { getIronSession } from "iron-session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { neon } from "@neondatabase/serverless";


// Initialize database connection
const sql = neon(`${process.env.DATABASE_URL}`);

// Fetch all users
async function getUsers() {
  try {
    return await sql("SELECT * FROM users");
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Fetch a user by email
async function getUserByEmail(email: string) {
  try {
    const [user] = await sql(
      "SELECT * FROM users WHERE email = $1 LIMIT 1",
      [email]
    );
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}

export const getSession = async () => {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }

  return session;
};

export const login = async (formData: FormData) => {
  const session = await getSession();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Fetch the user from the database
  const user = await getUserByEmail(email);

  if (!user) {
    return { error: "Invalid email or password." };
  }

  // Plain text password comparison (not secure)
  if (password !== user.password) {
    return { error: "Invalid email or password." };
  }

  // Update the session
  session.userId = user.user_id;
  session.username = user.username;
  session.email = user.email;
  session.isSeller = user.seller;
  session.isLoggedIn = true;

  await session.save();
  redirect("/");
};

export const logout = async () => {
  const session = await getSession();
  session.destroy();
  redirect("/");
};

export const changePremium = async () => {
  const session = await getSession();

  session.isSeller = !session.isSeller;
  await session.save();
  revalidatePath("/profile");
};

export const changeUsername = async (formData: FormData) => {
  const session = await getSession();

  const newUsername = formData.get("username") as string;

  try {
    await sql(
      "UPDATE users SET username = $1 WHERE user_id = $2",
      [newUsername, session.userId]
    );

    session.username = newUsername;
    await session.save();
    revalidatePath("/profile");
  } catch (error) {
    console.error("Error updating username:", error);
    throw new Error("Unable to update username.");
  }
};
