import { useRouter } from "next/navigation";
import "../app/globals.css";

export default function BackButton({ fallbackPath }: { fallbackPath: string }) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push(fallbackPath);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
    >
      ← Back
    </button>
  );
}
