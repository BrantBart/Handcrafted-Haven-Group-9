import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="flex justify-between items-center p-6 -mx-8 -my-8 nav">
      <Link href="/">
        <div className="flex items-center gap-3">
          <Image src="/H_logo.png" alt="Company Logo" width={40} height={40} />
          <span className="text-xl font-semibold hover:text-[#F5A00E] transition-colors">
            Handcrafted Haven
          </span>
        </div>
      </Link>
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
  );
}
