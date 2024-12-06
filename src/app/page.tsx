import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-6 -mx-8 -my-8 nav">
        <div className="flex items-center gap-3">
          <Image src="/H_logo.png" alt="Company Logo" width={40} height={40} />
          <span className="text-xl font-semibold">Handcrafted Haven</span>
        </div>
        <div className="flex gap-6">
          <Link
            href="/login"
            className="text-sm font-medium hover:text-[#F5A00E] transition-colors"
          >
            Login
          </Link>
          <Link
            href="/create-account"
            className="text-sm font-medium hover:text-[#F5A00E] transition-colors"
          >
            Create Account
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-[#F5A00E] transition-colors"
          >
            About
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center">
        <div className="about flex flex-col p-5 rounded-xl">
          <h1 className="text-3xl font-semibold mb-6">
            Unleash Your Creativity
          </h1>
          <p className="text-lg mb-6 max-w-2xl">
            Handcrafted Haven aims to revolutionize the way handcrafted items
            are discovered, appreciated, and acquired. By providing a digital
            platform for artisans to showcase their creativity and connect with
            a broader audience, the web application fosters a thriving community
            of passionate creators and conscious consumers. With its
            user-friendly features, secure e-commerce capabilities, and emphasis
            on customization and community engagement, Handcrafted Haven is set
            to become the go-to destination for those seeking unique,
            handcrafted treasures.{" "}
          </p>
          <Link
            href="/login"
            className="grid self-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors"
          >
            Get Started
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center -mx-8 -my-8">
        <p className="text-sm">
          © 2024 Company Name. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
