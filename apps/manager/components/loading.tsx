import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center animate-pulse">
          <Image
            src="/images/logo.webp"
            alt="Logo"
            width={80}
            height={80}
            className="rounded-full object-cover"
            priority
          />
        </div>
        <div className="mt-6 text-lg text-white font-semibold tracking-wide animate-pulse">
          Loading...
        </div>
      </div>
    </div>
  );
}
