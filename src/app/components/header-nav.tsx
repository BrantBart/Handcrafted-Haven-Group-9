import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/actions";
import LogoutForm from "../ui/logout-form";

const Header = async () => {
  const session = await getSession();
  console.log(session);

  return (
    <nav className="flex justify-between items-center p-6 px-8 nav mb-4 fixed top-0 left-0 right-0 w-full z-50">
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

        {/* Conditional Rendering for Logged In User */}
        {session.isLoggedIn && (
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
