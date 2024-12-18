"use client";
import Image from "next/image";
import Link from "next/link";
import LogoutForm from "../ui/logout-form";
import { useState, useEffect } from "react";
import { isSellerSession } from "@/utils/merch";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
      const fetchSession = async () => {
        const result = await isSellerSession();
        setLoggedIn(result ?? false);
      };
      fetchSession();
    }, []);

  return (
    <nav className={`flex lg:flex-row sm:flex-col sm:items-center justify-between items-center p-6 px-8 nav mb-20 relative -mx-8 z-50 transition-all duration-300`}>
      <Link href="/">
        <div className="flex items-center gap-3 hover:bg-[#588157ff] p-3 rounded-xl">
          <Image src="/H_logo.png" alt="Company Logo" width={40} height={40} />
          <span className="text-xl font-semibold transition-colors">
            Handcrafted Haven
          </span>
        </div>
      </Link>
      {/* Hamburger Menu for Mobile */}
      <button
          className="lg:hidden p-3 rounded-md hover:bg-[#588157ff] transition"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
        <div className={`flex sm:flex-col lg:flex-row lg:flex sm:items-center items-start lg:static left-0 top-full w-full lg:w-auto bg-[#a3b18aff] lg:bg-transparent p-6 lg:p-0 transition-all duration-300 ease-in-out ${
            isMenuOpen ? "flex" : "hidden"
          }`}>
        <Link
          href="/login"
          className="text-md font-medium hover:bg-[#588157ff] p-3 rounded-xl transition-colors"
        >
          Login
        </Link>
        <Link
          href="/create-account"
          className="text-md font-medium hover:bg-[#588157ff] p-3 rounded-xl transition-colors"
        >
          Create Account
        </Link>

        {/* Conditional Rendering for Logged In User */}
        {loggedIn && (
          <>
            <Link
              href="/datapage"
              className="text-md font-medium hover:bg-[#588157ff] p-3 rounded-xl transition-colors"
            >
              Data
            </Link>
            <Link
              href="/merch"
              className="text-md font-medium hover:bg-[#588157ff] p-3 rounded-xl transition-colors"
            >
              Merchandise
            </Link>
            <Link href="/sellers" className="text-md font-medium hover:bg-[#588157ff] p-3 rounded-xl transition-colors">
              Sellers
            </Link>
            <LogoutForm />
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
