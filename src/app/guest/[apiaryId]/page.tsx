"use client";

import { useEffect, useState } from "react";
import { ApiService } from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function GuestApiaryDetailsPage() {
  const { apiaryId } = useParams(); // Extract the apiaryId from the URL
  const router = useRouter();
  const [apiary, setApiary] = useState<any>(null);
  const [hives, setHives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApiaryAndHives = async () => {
      const apiService = new ApiService();
      try {
        // Fetch Apiary Details
        const apiaryData = await apiService.get(`/apiaries/${apiaryId}`, false);
        setApiary(apiaryData);

        // Fetch Hives
        const hivesData = await apiService.get(`/apiaries/${apiaryId}/hives`, false);
        setHives(hivesData);
      } catch (error) {
        console.error("Error fetching apiary or hives:", error);
        alert("Failed to load apiary details. Redirecting back.");
        router.back(); // Navigate back on failure
      } finally {
        setLoading(false);
      }
    };

    fetchApiaryAndHives();
  }, [apiaryId, router]);

  if (loading) return <p>Loading...</p>;

  if (!apiary) return <p>Apiary not found.</p>;

  return (
    <div className="p-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
      >
        Back
      </button>

      {/* Apiary Information */}
      <h1 className="text-3xl font-bold mb-4">Apiary Details</h1>
      <p className="mb-2">
        <strong>ID:</strong> {apiary.apiaryId}
      </p>
      <p className="mb-2">
        <strong>Name:</strong> {apiary.name}
      </p>
      <p className="mb-2">
        <strong>Location:</strong> {apiary.location}
      </p>
      <p className="mb-4">
        <strong>Description:</strong> {apiary.description}
      </p>

      {/* Hives List */}
      <h2 className="text-2xl font-semibold mb-4">Hives</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hives.map((hive) => (
              <tr key={hive.hiveId} className="border-t border-gray-300">
                <td className="px-6 py-4 text-sm text-gray-700">{hive.hiveId}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{hive.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{hive.description}</td>
                <td className="px-6 py-4 text-sm">
                  <Link
                    href={`/guest/${apiaryId}/hives/${hive.hiveId}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Details
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
