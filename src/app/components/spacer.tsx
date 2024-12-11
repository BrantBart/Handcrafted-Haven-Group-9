import Image from "next/image";
import Link from "next/link";

export default function Spacer() {
  return (
    <nav className="flex justify-between items-center p-6 px-8 nav mb-20 w-full">
      <Link href="/">
        <div className="flex items-center gap-3">
          <Image src="/H_logo.png" alt="Company Logo" width={40} height={40} />
          <span className="text-xl font-semibold hover:text-[#F5A00E] transition-colors">
            Handcrafted Haven
          </span>
        </div>
      </Link>
    </nav>
  );
}
