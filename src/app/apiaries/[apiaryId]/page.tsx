"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApiService } from "@/services/api";
import Link from "next/link";
import BackButton from "@/components/BackButton";

export default function ApiaryDetailsPage() {
  const { apiaryId } = useParams();
  const router = useRouter();
  const [apiary, setApiary] = useState<any>(null);
  const [hives, setHives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newHive, setNewHive] = useState({ name: "", description: "" });

  useEffect(() => {
    const fetchApiaryAndHives = async () => {
      const apiService = new ApiService();
      try {
        const apiaryData = await apiService.get(`/apiaries/${apiaryId}`);
        setApiary(apiaryData);

        const hivesData = await apiService.get(`/apiaries/${apiaryId}/hives`);
        setHives(hivesData);
      } catch (error) {
        console.error("Error fetching apiary or hives:", error);
        alert("Error fetching data. Redirecting to the dashboard.");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchApiaryAndHives();
  }, [apiaryId, router]);

  if (loading) return <p>Loading...</p>;
  if (!apiary) return <p>Apiary not found.</p>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewHive({ ...newHive, [name]: value });
  };

  const handleCreateHive = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiService = new ApiService();
    try {
      const createdHive = await apiService.post(`/apiaries/${apiaryId}/hives`, newHive);
      setHives((prev) => [...prev, createdHive]);
      setNewHive({ name: "", description: "" });
      alert("Hive created successfully!");
    } catch (error) {
      console.error("Error creating hive:", error);
      alert("Failed to create hive.");
    }
  };

  const handleDeleteHive = async (hiveId: string) => {
    const confirmed = confirm("Are you sure you want to delete this hive?");
    if (!confirmed) return;

    try {
      const apiService = new ApiService();
      await apiService.delete(`/apiaries/${apiaryId}/hives/${hiveId}`);
      setHives((prev) => prev.filter((hive) => hive.hiveId !== hiveId));
      alert("Hive deleted successfully!");
    } catch (error) {
      console.error("Error deleting hive:", error);
      alert("Failed to delete hive.");
    }
  };

  return (
    <div className="p-8">
      <BackButton fallbackPath="/dashboard" />
      <h1 className="text-3xl font-bold mb-6">Apiary Details</h1>
      <h1 className="text-3xl font-bold mb-6">Apiary: {apiary.name}</h1>
      <p className="mb-4">
        <strong>Location:</strong> {apiary.location}
      </p>
      <p className="mb-6">
        <strong>Description:</strong> {apiary.description}
      </p>

      {/* Create Hive Form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Hive</h2>
        <form
          onSubmit={handleCreateHive}
          className="bg-white p-4 rounded-lg shadow-md border border-gray-300 space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700">Hive Name</label>
            <input
              type="text"
              name="name"
              value={newHive.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Hive name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              value={newHive.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Description"
              rows={3}
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Create Hive
          </button>
        </form>
      </div>

      {/* Hive List */}
      <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Hives</h2>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Description
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hives.map((hive) => (
              <tr key={hive.hiveId} className="border-t border-gray-300">
                <td className="px-6 py-4 text-sm text-gray-700">{hive.hiveId}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{hive.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{hive.description}</td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <Link
                    href={`/apiaries/${apiaryId}/hives/${hive.hiveId}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </Link>
                  <Link
                    href={`/apiaries/${apiaryId}/hives/${hive.hiveId}/edit`}
                    className="text-green-500 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDeleteHive(hive.hiveId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
