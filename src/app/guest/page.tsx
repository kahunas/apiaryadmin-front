"use client";

import { useEffect, useState } from "react";
import { ApiService } from "@/services/api";
import Link from "next/link";

export default function GuestApiariesPage() {
  const [apiaries, setApiaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApiaries = async () => {
      const apiService = new ApiService();
      try {
        const data = await apiService.get("/apiaries", false);
        console.log("Fetched Apiaries:", data); // Debugging: Log fetched data
        setApiaries(data);
      } catch (error) {
        console.error("Error fetching apiaries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApiaries();
  }, []);

  if (loading) return <p>Loading apiaries...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Apiaries</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiaries.map((apiary) => (
              <tr key={apiary.apiaryId} className="border-t border-gray-300">
                <td className="px-6 py-4 text-sm text-gray-700">{apiary.apiaryId}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{apiary.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{apiary.location}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{apiary.description}</td>
                <td className="px-6 py-4 text-sm">
                  <Link
                    href={`/guest/${apiary.apiaryId}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Hives
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
