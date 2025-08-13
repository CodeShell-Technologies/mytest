import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "~/constants/api";
import toast, { Toaster } from "react-hot-toast";
import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
import { useAuthStore } from "src/stores/authStore";
import { ClipboardCheck, UserCheck, FileText } from "lucide-react";

function EditTerminationForm({ termination, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    resign_id: "",
    status: "pending",
    approved_by: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useAuthStore((state) => state.accessToken);
  const permissions = useAuthStore((state) => state.permissions);
  const userRole = permissions[0].role;

  useEffect(() => {
    if (termination) {
      setFormData({
        resign_id: termination.resign_id || "",
        status: termination.status || "pending",
        
        approved_by: termination.approved_by,
      });
    }
  }, [termination]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.put(
        `${BASE_URL}/user_resign_form/edit`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (response.status === 200) {
        toast.success("Termination status updated successfully");
        onSuccess();
      } else {
        setError(response.data.message || "Failed to update termination status");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      toast.error(err.response?.data?.message || "Failed to update termination status", {
        style: {
          border: "1px solid rgb(185 28 28)",
          padding: "14px",
          width: "900px",
          color: "rgb(185 28 28)",
        },
        iconTheme: {
          primary: "rgb(185 28 28)",
          secondary: "#FFFAEE",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
      <Toaster />
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
            Update Termination Status
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Resignation ID (readonly) */}
            <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <FileText className="inline mr-1" size={14} /> Resignation ID
              </p>
              <input
                name="resign_id"
                value={formData.resign_id}
                readOnly
                className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none cursor-not-allowed"
              />
            </div>

            {/* Status */}
            <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <ClipboardCheck className="inline mr-1" size={14} /> Status
              </p>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                required
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Approved By (readonly) */}
            <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <UserCheck className="inline mr-1" size={14} /> Approved By
              </p>
              <input
                name="approved_by"
                type="text"
                value={formData.approved_by}
              
                className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none "
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors duration-200 font-medium text-sm"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-red-700 hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-md transition-colors duration-200 font-medium text-sm shadow-sm"
            disabled={loading}
          >
            {loading ? <ButtonLoader /> : "Update Status"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTerminationForm;