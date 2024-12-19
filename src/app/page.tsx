import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Apiary Admin",
    description: "Manage your apiaries.",
  };


export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-[60vh] p-4 md:p-0 space-y-4">
      <h1 className="text-3xl md:text-5xl font-extrabold text-[#334155] text-center">
        Welcome to Apiary Admin
      </h1>
      <p className="text-base md:text-lg text-[#64748B] text-center max-w-md">
        Manage your hives and bees efficiently with a user-friendly dashboard.
      </p>
    </div>
  );
}
