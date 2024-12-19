"use client";

import { useEffect, useState } from "react";
import { ApiService } from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getToken, getUserRole } from "@/utils/auth";

export default function DashboardPage() {
  const [apiaries, setApiaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newApiary, setNewApiary] = useState({ name: "", location: "", description: "" });
  const router = useRouter();

  useEffect(() => {
    // Check for authentication
    const token = getToken();
    if (!token || getUserRole() === "guest") {
      router.push("/login"); // Redirect unauthorized users
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchApiaries = async () => {
      const apiService = new ApiService();
      try {
        const data = await apiService.get("/apiaries");
        console.log("Fetched Apiaries:", data); // Debugging: Log fetched data
        setApiaries(data);
      } catch (error) {
        console.error("Error fetching apiaries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApiaries();
  }, [isAuthenticated]);

  if (!isAuthenticated || loading) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Create Apiary Form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Apiary</h2>
        <form
          onSubmit={handleCreate}
          className="bg-white p-4 rounded-lg shadow-md border border-gray-300 space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700">Name</label>
            <input
              type="text"
              value={newApiary.name}
              onChange={(e) => setNewApiary({ ...newApiary, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Apiary name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Location</label>
            <input
              type="text"
              value={newApiary.location}
              onChange={(e) => setNewApiary({ ...newApiary, location: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Location"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              value={newApiary.description}
              onChange={(e) => setNewApiary({ ...newApiary, description: e.target.value })}
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
            Create Apiary
          </button>
        </form>
      </div>

      {/* Table View */}
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
            {apiaries.map((apiary, index) => (
              <tr
                key={apiary.apiaryId || `fallback-key-${index}`} // Ensure unique key
                className="border-t border-gray-300"
              >
                <td className="px-6 py-4 text-sm text-gray-700">{apiary.apiaryId || "N/A"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{apiary.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{apiary.location}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{apiary.description}</td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <Link
                    href={`/apiaries/${apiary.apiaryId}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </Link>
                  <button
                    className="text-green-500 hover:underline"
                    onClick={() => handleEdit(apiary.apiaryId)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(apiary.apiaryId)}
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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const apiService = new ApiService();

    try {
      const response = await apiService.post("/apiaries", newApiary);
      setApiaries((prev) => [...prev, response]); // Add new apiary to the list
      setNewApiary({ name: "", location: "", description: "" }); // Clear form
    } catch (error) {
      console.error("Error creating apiary:", error);
    }
  }

  function handleEdit(id: string) {
    router.push(`/apiaries/${id}/edit`);
  }  

  async function handleDelete(id: string) {
    const confirmed = confirm("Are you sure you want to delete this apiary?");
    if (!confirmed) return;

    try {
      const apiService = new ApiService();
      await apiService.delete(`/apiaries/${id}`);
      setApiaries((prev) => prev.filter((apiary) => apiary.apiaryId !== id)); // Update the UI
    } catch (error) {
      console.error("Error deleting apiary:", error);
    }
  }
}
