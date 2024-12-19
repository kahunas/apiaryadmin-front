"use client";
import "../app/globals.css";
import { useRouter } from "next/navigation";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-8">
        {children}
      </main>
    </div>
  );
}
