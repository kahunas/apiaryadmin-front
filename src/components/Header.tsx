"use client";

import "../app/globals.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserRole, removeToken, getToken } from "@/utils/auth";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        setUsername(
          payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
        ); // Extract username correctly
      } catch {
        setUsername(null);
      }
    }
    setRole(getUserRole());
    setIsLoaded(true); // Mark as loaded
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    removeToken();
    setRole("guest");
    setUsername(null);
    router.push("/");
  };

  if (!isLoaded) return null; // Prevent server-client mismatch during hydration

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-[#334155]">
          <Link href="/">Apiary Manager</Link>
        </h1>

        {/* User Info and Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {username && (
            <p className="text-[#334155] font-medium">
              Welcome, <span className="font-bold">{username}</span>
            </p>
          )}

          {role === "guest" && (
            <Link href="/" className="hover:text-blue-500">
              Home
            </Link>
          )}

          {role !== "guest" && (
            <>
              <Link href="/dashboard" className="hover:text-blue-500">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="hover:text-red-500">
                Logout
              </button>
            </>
          )}

          {role === "guest" && (
            <>
              <Link href="/login" className="hover:text-blue-500">
                Login
              </Link>
              <Link href="/register" className="hover:text-blue-500">
                Register
              </Link>
              <Link href="/guest" className="hover:text-blue-500">
                Continue as Guest
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden">
          {isOpen ? (
            <XMarkIcon className="w-8 h-8 text-[#334155]" />
          ) : (
            <Bars3Icon className="w-8 h-8 text-[#334155]" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="bg-white shadow-md p-4 space-y-4 md:hidden">
          {username && (
            <p className="text-[#334155] font-medium">
              Welcome, <span className="font-bold">{username}</span>
            </p>
          )}

          {role === "guest" && (
            <Link href="/" className="block hover:text-blue-500">
              Home
            </Link>
          )}

          {role !== "guest" && (
            <>
              <Link href="/dashboard" className="block hover:text-blue-500">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block hover:text-red-500"
              >
                Logout
              </button>
            </>
          )}

          {role === "guest" && (
            <>
              <Link href="/login" className="hover:text-blue-500">
                Login
              </Link>
              <Link href="/register" className="hover:text-blue-500">
                Register
              </Link>
              <Link href="/guest" className="hover:text-blue-500">
                Continue as Guest
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
