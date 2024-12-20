"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApiService } from "@/services/api";
import BackButton from "@/components/BackButton";

export default function EditInspectionPage() {
  const { apiaryId, hiveId, inspectionId } = useParams();
  const router = useRouter();
  const [inspection, setInspection] = useState({
    title: "",
    date: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInspection = async () => {
      const apiService = new ApiService();
      try {
        console.log(`Fetching inspection: /apiaries/${apiaryId}/hives/${hiveId}/inspections/${inspectionId}`);
        const inspectionData = await apiService.get(
          `/apiaries/${apiaryId}/hives/${hiveId}/inspections/${inspectionId}`
        );
        // @ts-ignore
        setInspection({title: inspectionData.title,date: inspectionData.date.split("T")[0],notes: inspectionData.notes,});
      } catch (error) {
        console.error("Error fetching inspection:", error);
        alert("Failed to fetch inspection details. Redirecting to hive.");
        router.push(`/apiaries/${apiaryId}/hives/${hiveId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInspection();
  }, [apiaryId, hiveId, inspectionId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInspection({ ...inspection, [name]: value });
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiService = new ApiService();
  
    try {
      console.log("Submitting data:", inspection);
      console.log(`Editing inspection at: /apiaries/${apiaryId}/hives/${hiveId}/inspections/${inspectionId}`);
  
      const updatedInspection = await apiService.put(
        `/apiaries/${apiaryId}/hives/${hiveId}/inspections/${inspectionId}`,
        inspection
      );
  
      console.log("Inspection updated successfully:", updatedInspection);
      alert("Inspection updated successfully!");
      router.push(`/apiaries/${apiaryId}/hives/${hiveId}`);
    } catch (error: any) {
      console.error("Error saving changes:", error);
  
      if (error.message.includes("403")) {
        alert("You are not authorized to edit this inspection.");
      } else {
        alert("Failed to save inspection changes. Check the logs for more details.");
      }
    }
  };
  

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-8">
        <BackButton fallbackPath={`/apiaries/${apiaryId}/hives/${hiveId}`} />
      <h1 className="text-3xl font-bold mb-6">Edit Inspection</h1>
      <form
        onSubmit={handleSaveChanges}
        className="bg-white p-4 rounded-lg shadow-md border border-gray-300 space-y-4"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={inspection.title}
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
            value={inspection.date}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Notes</label>
          <textarea
            name="notes"
            value={inspection.notes}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Inspection notes"
            rows={5}
            required
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push(`/apiaries/${apiaryId}/hives/${hiveId}`)}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
