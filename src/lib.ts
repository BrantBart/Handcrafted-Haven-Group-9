import { SessionOptions } from "iron-session";

export interface SessionData {
  userId?: string;
  username?: string;
  email?: string;
  img?: string;
  isSeller?: boolean;
  isBlocked?: boolean;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_KEY!,
  cookieName: "hh-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};