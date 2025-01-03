import LoginForm from "@/app/ui/login-form";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center text-center pt-20">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-center rounded-lg p-3 md:h-36 logo-box">
          <div className="w-32 md:w-36 text-black flex flex-col flex-auto items-center text-center">
            <Image
              src="/H_logo.png"
              alt="Company Logo"
              width={70}
              height={70}
            />
            <span className="text-xl font-semibold">Handcrafted Haven</span>
          </div>
        </div>
        <LoginForm />
      </div>
      <Link href="/create-account">Don&apos;t have an account?</Link>
    </main>
  );
}
