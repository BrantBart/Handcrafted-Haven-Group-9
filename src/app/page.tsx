import Link from "next/link";

export default function Home() {
  return (
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
            handcrafted treasures.
          </p>
          <div className="flex flex-col gap-4">
            <Link
              href="/login"
              className="grid self-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors"
            >
              Get Started
            </Link>
            {/* New Link to Gallery Page */}
            <Link
              href="/gallery"
              className="grid self-center gap-2 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600"
            >
              Explore the Gallery
            </Link>
          </div>
        </div>
      </main>
  );
}
