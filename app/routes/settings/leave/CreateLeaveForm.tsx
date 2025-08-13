import axios from "axios";
import { useState } from "react";
import { BASE_URL, toastStyle } from "~/constants/api";
import toast, { Toaster } from "react-hot-toast";
import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
import { useAuthStore } from "src/stores/authStore";
import { Calendar, CalendarDays, ClipboardList, Hash, Notebook } from "lucide-react";

const CreateLeaveForm = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useAuthStore((state) => state.accessToken);
  const branchcode = useAuthStore((state) => state.branchcode);
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    description: "",
    total_days: "",
    status: "",
  });
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
    const softData = {
      userDatas: [
        {
          branchcode: branchcode,
          name: formData.name,
              year: formData.year,
    description: formData.description,
    total_days: formData.total_days,
    status: formData.status,
        },
      ],
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/master/leavetypes/create`,
        softData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 201) {
        onSuccess();
      } else {
        setError(response.data.message || "Failed to create LeaveTypes");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      toast.error(`${error}, Error in create LeaveTypes`, toastStyle);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="text-medium dark:bg-gray-800 dark:text-gray-200">
      <Toaster />
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Hash className="inline mr-1" size={14} /> Leave Type
            </p>
            <input
              type="text"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter LeaveType"
              required
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Calendar className="inline mr-1" size={14} /> Year
            </p>
            <input
              type="text"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="Enter Year"
              required
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Notebook className="inline mr-1" size={14} /> Description
            </p>
            <input
              type="text"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter Description"
              required
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <CalendarDays className="inline mr-1" size={14} /> Total Days
            </p>
            <input
              type="text"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              name="total_days"
              value={formData.total_days}
              onChange={handleChange}
              placeholder=" Enter Total Days"
              required
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <ClipboardList className="inline mr-1" size={14} />
              Type Status
            </p>
            <select
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="">Select Type Status</option>
              <option value="open">Open</option>
              <option value="close">Close</option>
            </select>
          </div>
          {/* <div className="flex flex-col py-2 text-left">
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">
              Branch Code
            </label>
            <input
              name="branchcode"
              value={formData.branchcode}
              onChange={handleChange}
              className="w-full bg-blue-200/25 dark:bg-gray-700 text-sm px-3 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
              type="text"
              placeholder="Branch Code"
              required
            />
          </div>
      */}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-[var(--color-secondary)] hover:[var(--color-hover-secondary)] hover-effect text-gray-800 dark:text-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-hover)]  text-white rounded hover:bg-gradient-to-b hover-effect transition"
            disabled={loading}
          >
            {loading ? <ButtonLoader /> : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreateLeaveForm;
