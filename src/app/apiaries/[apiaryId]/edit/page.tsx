"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ApiService } from "@/services/api";
import BackButton from "@/components/BackButton";

export default function EditApiaryPage() {
  const router = useRouter();
  const { apiaryId } = useParams(); // Get the dynamic id from the URL
  const [apiary, setApiary] = useState({ name: "", location: "", description: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApiary = async () => {
      const apiService = new ApiService();
      try {
        const data = await apiService.get(`/apiaries/${apiaryId}`);
        // @ts-ignore
        setApiary(data); // Set the data to the form
      } catch (error) {
        console.error("Error fetching apiary:", error);
        router.push("/dashboard"); // Redirect if error
      } finally {
        setLoading(false);
      }
    };

    fetchApiary();
  }, [apiaryId, router]);

  if (loading) return <p>Loading...</p>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApiary({ ...apiary, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiService = new ApiService();

    try {
      await apiService.put(`/apiaries/${apiaryId}`, apiary);
      alert("Apiary updated successfully!");
      router.push("/dashboard"); // Redirect to dashboard after update
    } catch (error) {
      console.error("Error updating apiary:", error);
      alert("Failed to update the apiary. Please try again.");
    }
  };

  return (
    <div className="p-8">
      <BackButton fallbackPath="/dashboard" />
      <h1 className="text-3xl font-bold mb-6">Edit Apiary</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg shadow-md border border-gray-300 space-y-4"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={apiary.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Apiary name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={apiary.location}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Location"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Description</label>
          <textarea
            name="description"
            value={apiary.description}
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
          Update Apiary
        </button>
      </form>
    </div>
  );
}
