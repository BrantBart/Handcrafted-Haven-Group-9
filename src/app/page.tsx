import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div 
    // className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
    >
      <main 
      // className="flex flex-col gap-8 row-start-2 items-center sm:items-start"
      >
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span> 
            {/* <ArrowRightIcon className="w-5 md:w-6" /> */}
          </Link>
      </main>
      <footer 
      // className="row-start-3 flex gap-6 flex-wrap items-center justify-center"
      >
      <p>hello world!</p>
      </footer>
    </div>
  );
}
