"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApiService } from "@/services/api";
import Link from "next/link";
import BackButton from "@/components/BackButton";

export default function HiveDetailsPage() {
  const { apiaryId, hiveId } = useParams();
  const router = useRouter();
  const [hive, setHive] = useState<any>(null);
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newInspection, setNewInspection] = useState({
    title: "",
    date: "",
    notes: "",
  });

  useEffect(() => {
    const fetchHiveAndInspections = async () => {
      const apiService = new ApiService();
      try {
        // Fetch Hive Details
        const hiveData = await apiService.get(`/apiaries/${apiaryId}/hives/${hiveId}`);
        setHive(hiveData);

        // Fetch Inspections
        const inspectionsData = await apiService.get(
          `/apiaries/${apiaryId}/hives/${hiveId}/inspections`
        );
        // @ts-ignore
        setInspections(inspectionsData);
      } catch (error) {
        console.error("Error fetching hive or inspections:", error);
        alert("Error fetching data. Redirecting to the apiary.");
        router.push(`/apiaries/${apiaryId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchHiveAndInspections();
  }, [apiaryId, hiveId, router]);

  if (loading) return <p>Loading...</p>;
  if (!hive) return <p>Hive not found.</p>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewInspection({ ...newInspection, [name]: value });
  };

  const handleCreateInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiService = new ApiService();
    try {
      const createdInspection = await apiService.post(
        `/apiaries/${apiaryId}/hives/${hiveId}/inspections`,
        newInspection
      );
      setInspections((prev) => [...prev, createdInspection]);
      setNewInspection({ title: "", date: "", notes: "" });
      alert("Inspection created successfully!");
    } catch (error) {
      console.error("Error creating inspection:", error);
      alert("Failed to create inspection.");
    }
  };

  const handleDeleteInspection = async (inspectionId: string) => {
    const confirmed = confirm("Are you sure you want to delete this inspection?");
    if (!confirmed) return;

    try {
      const apiService = new ApiService();
      await apiService.delete(
        `/apiaries/${apiaryId}/hives/${hiveId}/inspections/${inspectionId}`
      );
      setInspections((prev) => prev.filter((inspection) => inspection.inspectionId !== inspectionId));
      alert("Inspection deleted successfully!");
    } catch (error) {
      console.error("Error deleting inspection:", error);
      alert("Failed to delete inspection.");
    }
  };

  return (
    <div className="p-8">
      <BackButton fallbackPath={`/apiaries/${apiaryId}`} />
      <h1 className="text-3xl font-bold mb-6">Hive Details</h1>
      <h1 className="text-3xl font-bold mb-6">Hive: {hive.name}</h1>
      <p className="mb-4"><strong>Description:</strong> {hive.description}</p>

      {/* Create Inspection Form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Create New Inspection</h2>
        <form
          onSubmit={handleCreateInspection}
          className="bg-white p-4 rounded-lg shadow-md border border-gray-300 space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={newInspection.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Inspection title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={newInspection.date}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={newInspection.notes}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Inspection notes"
              rows={3}
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Create Inspection
          </button>
        </form>
      </div>

      {/* Inspection List */}
      <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Inspections</h2>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Notes</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inspections.map((inspection) => (
              <tr key={inspection.inspectionId} className="border-t border-gray-300">
                <td className="px-6 py-4 text-sm text-gray-700">{inspection.inspectionId}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{inspection.title}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(inspection.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{inspection.notes}</td>
                <td className="px-6 py-4 text-sm space-x-2">
  <Link
    href={`/apiaries/${apiaryId}/hives/${hive.hiveId}/inspections/${inspection.inspectionId}/edit`}
    className="text-green-500 hover:underline"
  >
    Edit
  </Link>
  <button
    className="text-red-500 hover:underline"
    onClick={() => handleDeleteInspection(inspection.inspectionId)}
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
