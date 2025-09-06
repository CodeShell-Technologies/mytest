import axios from "axios";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
import { useAuthStore } from "src/stores/authStore";
import { BASE_URL, toastposition } from "~/constants/api";
import { BookOpenText, Hash } from "lucide-react";

const EditProjectReasonForm = ({ project_code, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useAuthStore((state) => state.accessToken);

  const [formData, setFormData] = useState({
    project_code: project_code || "",
    reason: "",
  });

  useEffect(() => {
    if (project_code) {
      setFormData((prev) => ({
        ...prev,
        project_code,
      }));
    }
  }, [project_code]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const response = await axios.put(
  //       `${BASE_URL}/edit_project_reason`,
  //       { data: formData },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     if (response.status === 201) {
  //       toast.success("Reason updated successfully!");
  //       onSuccess?.();
  //     } else {
  //       setError(response.data.message || "Failed to update reason");
  //       toast.error(response.data.message || "Failed to update reason");
  //     }
  //   } catch (err) {
  //     const errMsg = err.response?.data?.message || "An error occurred";
  //     setError(errMsg);
  //     toast.error(errMsg);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await axios.put(
      `${BASE_URL}/edit_project_reason/${formData.project_code}`, // ✅ Pass project_code in URL
      { reason: formData.reason }, // ✅ Only send reason (backend expects this)
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 200) { // ✅ backend returns 200, not 201
      toast.success("Reason updated successfully!");
      onSuccess?.();
    } else {
      setError(response.data.message || "Failed to update reason");
      toast.error(response.data.message || "Failed to update reason");
    }
  } catch (err) {
    const errMsg = err.response?.data?.error || "An error occurred";
    setError(errMsg);
    toast.error(errMsg);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
      <Toaster position={toastposition} />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <BookOpenText className="inline mr-2" /> Edit Project Reason
        </h3>

        {/* Project Code - read-only */}
        <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <Hash className="inline mr-1" size={14} /> Project Code
          </p>
          <input
            name="project_code"
            value={formData.project_code}
            readOnly
            className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
          />
        </div>

        {/* Reason textarea */}
        <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <BookOpenText className="inline mr-1" size={14} /> Reason
          </p>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none min-h-[100px]"
            placeholder="Enter reason for this project update..."
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors duration-200 font-medium text-sm"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-5 py-2 bg-red-700 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-900 text-white rounded-md transition-colors duration-200 font-medium text-sm shadow-sm"
        >
          {loading ? <ButtonLoader /> : "Save Reason"}
        </button>
      </div>
    </div>
  );
};

export default EditProjectReasonForm;
