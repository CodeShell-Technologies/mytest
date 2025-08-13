import axios from "axios";
import {
  CalendarCheck,
  Flag,
  Hash,
  Megaphone,
  Tag,
  Type,
  BookOpenText,
  Medal,
} from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AiFillProject } from "react-icons/ai";
import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
import { useAuthStore } from "src/stores/authStore";
import useBranchStore from "src/stores/useBranchStore";
import { BASE_URL, toastposition } from "~/constants/api";

const AddNewCampaignForm = ({ onCancel, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const permissions = useAuthStore((state) => state.permissions);
  console.log("permisssing accesss", permissions[0].role);
  const userRole = permissions[0].role;
  const token = useAuthStore((state) => state.accessToken);
  const branchCode = useBranchStore((state) => state.branchCodeOptions);
const branchcodeForNor=useAuthStore((state)=>state.branchcode)
const branchCodeOption = userRole === "superadmin" ? branchCode : [{ value: branchcodeForNor, label: branchcodeForNor }]; 
 const [formData, setFormData] = useState({
    branchcode: "",
    campaignname: "",
    campaigntype: "",
    startdate: "",
    enddate: "",
    status: "active",
    goallead: "",
    summary: "",
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
    const campaignData = {
      data: [formData],
    };
    console.log("formdataa", campaignData);
    try {
      const response = await axios.post(
        `${BASE_URL}/campaign/overview/create`,
        campaignData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 201) {
        onSuccess();
      } else {
        setError(response.data.message || "Failed to create Campaign");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      toast.error(`${error}, Error in create Camapign`, {
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
      <Toaster position={toastposition} />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <Megaphone className="inline mr-2" /> Campaign Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Hash className="inline mr-1" size={14} /> Branch Code
            </p>
            <select
              name="branchcode"
              value={formData.branchcode}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            >
              <option value="">Select Branch</option>
              {branchCodeOption?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Type className="inline mr-1" size={14} /> Campaign Name
            </p>
            <input
              name="campaignname"
              value={formData.campaignname}
              onChange={handleChange}
              type="text"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter campaign name"
              required
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Tag className="inline mr-1" size={14} /> Campaign Type
            </p>
            <select
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              name="campaigntype"
              value={formData.campaigntype}
              onChange={handleChange}
            >
              <option value="">Select campaign type</option>
              <option value="digital">Digital Marketing</option>
              <option value="print">Print Media</option>
              <option value="tv">TV/Radio</option>
              <option value="event">Event</option>
              <option value="social">Social Media</option>
            </select>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Medal className="inline mr-1" size={14} /> Goal Lead
            </p>
            <input
              name="goallead"
              value={formData.goallead}
              onChange={handleChange}
              type="number"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter campaign code"
              required
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <CalendarCheck className="inline mr-1" size={14} /> Start Date
            </p>
            <input
              name="startdate"
              value={formData.startdate}
              onChange={handleChange}
              type="date"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <CalendarCheck className="inline mr-1" size={14} /> End Date
            </p>
            <input
              name="enddate"
              value={formData.enddate}
              onChange={handleChange}
              type="date"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
            />
          </div>
         
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <BookOpenText className="inline mr-2" /> Description
        </h3>
        <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none min-h-[100px]"
            placeholder="Enter campaign description, goals, and key messages..."
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
          {loading ? <ButtonLoader /> : " Create Campaign "}
        </button>
      </div>
    </div>
  );
};

export default AddNewCampaignForm;
