"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApiService } from "@/services/api";
import Link from "next/link";

export default function GuestHiveDetailsPage() {
  const router = useRouter();
  const params = useParams(); // Extract parameters
  const apiaryId = params?.apiaryId;
  const hiveId = params?.hiveId;

  const [hive, setHive] = useState<any>(null);
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Debugging: Check the extracted params
  useEffect(() => {
    console.log("Params extracted:", { apiaryId, hiveId });
  }, [apiaryId, hiveId]);

  useEffect(() => {
    if (!apiaryId || !hiveId) {
      console.error("Missing apiaryId or hiveId");
      alert("Invalid parameters. Redirecting back.");
      return router.push("/guest");
    }

    const fetchHiveAndInspections = async () => {
      const apiService = new ApiService();
      try {
        console.log(`Fetching hive: /apiaries/${apiaryId}/hives/${hiveId}`);
        const hiveData = await apiService.get(`/apiaries/${apiaryId}/hives/${hiveId}`, false);
        setHive(hiveData);

        console.log(`Fetching inspections: /apiaries/${apiaryId}/hives/${hiveId}/inspections`);
        const inspectionsData = await apiService.get(
          `/apiaries/${apiaryId}/hives/${hiveId}/inspections`,
          false
        );
        // @ts-ignore
        setInspections(inspectionsData);
      } catch (error) {
        console.error("Error fetching hive or inspections:", error);
        alert("Failed to fetch hive details or inspections. Redirecting to /guest.");
        router.push("/guest");
      } finally {
        setLoading(false);
      }
    };

    fetchHiveAndInspections();
  }, [apiaryId, hiveId, router]);

  if (loading) return <p>Loading...</p>;

  if (!hive) return <p>Hive not found.</p>;

  return (
    <div className="p-8">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/guest/${apiaryId}`)}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
      >
        Back
      </button>

      {/* Hive Information */}
      <h1 className="text-3xl font-bold mb-4">Hive Details</h1>
      <p className="mb-2">
        <strong>ID:</strong> {hive.hiveId}
      </p>
      <p className="mb-2">
        <strong>Name:</strong> {hive.name}
      </p>
      <p className="mb-4">
        <strong>Description:</strong> {hive.description}
      </p>

      {/* Inspections Table */}
      <h2 className="text-2xl font-semibold mb-4">Inspections</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Notes</th>
            </tr>
          </thead>
          <tbody>
            {inspections.map((inspection, index) => (
              <tr
                key={inspection.inspectionId || `fallback-key-${index}`}
                className="border-t border-gray-300"
              >
                <td className="px-6 py-4 text-sm text-gray-700">{inspection.inspectionId}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{inspection.title}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(inspection.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{inspection.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
