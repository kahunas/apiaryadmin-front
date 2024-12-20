"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApiService } from "@/services/api";
import BackButton from "@/components/BackButton";

export default function EditHivePage() {
  const { apiaryId, hiveId } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHiveDetails = async () => {
      const apiService = new ApiService();
      try {
        console.log(`Fetching hive: /apiaries/${apiaryId}/hives/${hiveId}`);
        const hiveData = await apiService.get(`/apiaries/${apiaryId}/hives/${hiveId}`);
        setFormData({ name: hiveData.name, description: hiveData.description }); // Pre-fill form
      } catch (error) {
        console.error("Error fetching hive:", error);
        alert("Failed to fetch hive details. Redirecting to the apiary page.");
        router.push(`/apiaries/${apiaryId}`); // Redirect to the apiary page
      } finally {
        setLoading(false);
      }
    };

    fetchHiveDetails();
  }, [apiaryId, hiveId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiService = new ApiService();
    try {
      console.log(`Updating hive: /apiaries/${apiaryId}/hives/${hiveId}`, formData);
      await apiService.put(`/apiaries/${apiaryId}/hives/${hiveId}`, formData);
      alert("Hive updated successfully!");
      router.push(`/apiaries/${apiaryId}`); // Redirect back to the apiary page
    } catch (error) {
      console.error("Error updating hive:", error);
      alert("Failed to update hive. Please try again.");
    }
  };
  

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <BackButton fallbackPath={`/apiaries/${apiaryId}`} />
      <h1 className="text-3xl font-bold mb-6">Edit Hive</h1>
      <form
        onSubmit={handleSaveChanges}
        className="bg-white p-4 rounded-lg shadow-md border border-gray-300 space-y-4"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700">Hive Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
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
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Description"
            rows={3}
            required
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push(`/apiaries/${apiaryId}`)}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
