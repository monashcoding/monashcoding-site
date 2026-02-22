import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Image
        src="/mascot/min-sad.svg"
        alt="Sad mascot"
        width={200}
        height={200}
      />
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg text-gray-500">
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-[#5757D2] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#4646b8]"
      >
        Go home
      </Link>
    </div>
  );
}
