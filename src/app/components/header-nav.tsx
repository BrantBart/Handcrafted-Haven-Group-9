import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="flex justify-between items-center p-6 px-8 nav mb-4 fixed top-0 left-0 right-0 w-full">
      <Link href="/">
        <div className="flex items-center gap-3 hover:bg-[#588157ff] p-3 rounded-xl">
          <Image src="/H_logo.png" alt="Company Logo" width={40} height={40} />
          <span className="text-xl font-semibold transition-colors">
            Handcrafted Haven
          </span>
        </div>
      </Link>
      <div className="flex gap-6">
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
        <Link
          href="/about"
          className="text-md font-medium hover:bg-[#588157ff] p-3 rounded-xl transition-colors"
        >
          About
        </Link>
      </div>
    </nav>
  );
}