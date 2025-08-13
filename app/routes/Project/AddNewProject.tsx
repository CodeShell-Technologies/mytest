
import axios from "axios";
import {
  CalendarCheck,
  User,
  BookUser,
  Tag,
  BookOpenText,
  Hash,
  IndianRupee,
  Map,
  Network,
  Briefcase,
  Tent,
  Building,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
import { useAuthStore } from "src/stores/authStore";
import { BASE_URL, toastposition } from "~/constants/api";
import { useStaffFilter } from "../../routes/hooks/UseStaffFilter";
import useBranchStore from "src/stores/useBranchStore";

const AddNewProject = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useAuthStore((state) => state.accessToken);
  
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [isFetchingCampaigns, setIsFetchingCampaigns] = useState(false);
  const [isFetchingClients, setIsFetchingClients] = useState(false);

 const permissions = useAuthStore((state) => state.permissions);
  const userRole = permissions[0].role;
  const branchCode = useBranchStore((state) => state.branchCodeOptions);
  const branchcodeForNor = useAuthStore((state) => state.branchcode);
  const branchCodeOptions =
    userRole === "superadmin"
      ? branchCode
      : [{ value: branchcodeForNor, label: branchcodeForNor }];
 
  const [formData, setFormData] = useState({
      branchcode: "",
    client_code: "",
    project_code:"",
    title: "",
    priority: "",
    type: "",
    loc: "",
    start_date: "",
    end_date: "",
    handler_by: "",
  
    notes: "",
    status: "draft",
  });
 const {
    departmentOptions,
    selectedDepartment,
    staffOptions,
    isFetchingStaff,
    handleDepartmentChange,
  } = useStaffFilter(formData.branchcode);

  // Fetch campaigns and clients when branchcode changes
  useEffect(() => {
    if (formData.branchcode) {
      fetchCampaignOptions(formData.branchcode);
      fetchClientOptions(formData.branchcode);
    
    } else {
      setCampaignOptions([]);
      setClientOptions([]);
      
    }
  }, [formData.branchcode]);

  const fetchCampaignOptions = async (branchcode) => {
    setIsFetchingCampaigns(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/campaign/overview/dropdown?branchcode=${branchcode}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && response.data.data) {
        const options = response.data.data.map((campaign) => ({
          value: campaign.campaign_code,
          label: campaign.campaignname,
        }));
        setCampaignOptions(options);
      } else {
        setCampaignOptions([]);
      }
    } catch (err) {
      toast.error("Failed to fetch campaign options");
      setCampaignOptions([]);
    } finally {
      setIsFetchingCampaigns(false);
    }
  };

  const fetchClientOptions = async (branchcode) => {
    setIsFetchingClients(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/client/overview/dropdown?branchcode=${branchcode}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && response.data.data) {
        const options = response.data.data.map((client) => ({
          value: client.client_code,
          label: client.client_name,
        }));
        setClientOptions(options);
      } else {
        setClientOptions([]);
      }
    } catch (err) {
      toast.error("Failed to fetch client options");
      setClientOptions([]);
    } finally {
      setIsFetchingClients(false);
    }
  };

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

    const ProjectData = {
      data: {
        branchcode: formData.branchcode,
        client_code: formData.client_code,
        project_code:formData.project_code,
        title: formData.title,
        priority: formData.priority,
        type: formData.type,
        loc: formData.loc,
        start_date: formData.start_date,
        end_date: formData.end_date,
        handler_by: formData.handler_by,
   
        notes: formData.notes,
        status: formData.status,
      },
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/project/overview/create`,
        ProjectData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        toast.success("Project created successfully!");
        onSuccess();
      } else {
        setError(response.data.message || "Failed to create project");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      toast.error(error || "Error creating project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
      <Toaster position={toastposition} />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <BookUser className="inline mr-2" /> Project Information
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
              {branchCodeOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Campaign Code - Dynamic */}
          {/* <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Tent className="inline mr-1" size={14} /> Campaign Code
            </p>
            {isFetchingCampaigns ? (
              <div className="text-sm text-gray-500 mt-1">Loading campaigns...</div>
            ) : (
              <select
                name="campaign_code"
                value={formData.campaign_code}
                onChange={handleChange}
                className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                required
                disabled={!formData.branchcode || campaignOptions.length === 0}
              >
                <option value="">Select Campaign</option>
                {campaignOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            {formData.branchcode && campaignOptions.length === 0 && !isFetchingCampaigns && (
              <div className="text-xs text-gray-500 mt-1">No campaigns found for this branch</div>
            )}
          </div> */}

          {/* Client Code - Dynamic */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Briefcase className="inline mr-1" size={14} /> Client Code
            </p>
            {isFetchingClients ? (
              <div className="text-sm text-gray-500 mt-1">Loading clients...</div>
            ) : (
              <select
                name="client_code"
                value={formData.client_code}
                onChange={handleChange}
                className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                required
                disabled={!formData.branchcode || clientOptions.length === 0}
              >
                <option value="">Select Client</option>
                {clientOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            {formData.branchcode && clientOptions.length === 0 && !isFetchingClients && (
              <div className="text-xs text-gray-500 mt-1">No clients found for this branch</div>
            )}
          </div>

     <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Network className="inline mr-1" size={14} /> Project Codes
            </p>
            <input
              name="project_code"
              value={formData.project_code}
              onChange={handleChange}
              type="text"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter Project Name"
              required
            />
          </div>
          {/* Project Name */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Network className="inline mr-1" size={14} /> Project Name
            </p>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              type="text"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter Project Name"
              required
            />
          </div>

          {/* Location */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Map className="inline mr-1" size={14} /> Location
            </p>
            <input
              name="loc"
              value={formData.loc}
              onChange={handleChange}
              type="text"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter Location"
              required
            />
          </div>

          {/* Start Date */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <CalendarCheck className="inline mr-1" size={14} /> Start Date
            </p>
            <input
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              type="date"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            />
          </div>

          {/* End Date */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <CalendarCheck className="inline mr-1" size={14} /> End Date
            </p>
            <input
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              type="date"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            />
          </div>

          {/* Department */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Building className="inline mr-1" size={14} /> Department
            </p>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                handleDepartmentChange(e.target.value);
                setFormData(prev => ({
                  ...prev,
                  handler_by: "",
                  handler_to: ""
                }));
              }}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            >
              <option value="">Select Department</option>
              {departmentOptions.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Handler By */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <User className="inline mr-1" size={14} /> Handler By
            </p>
            {isFetchingStaff ? (
              <div className="text-sm text-gray-500 mt-1">Loading staff...</div>
            ) : (
              <select
                name="handler_by"
                value={formData.handler_by}
                onChange={handleChange}
                className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                required
                disabled={!selectedDepartment || staffOptions.length === 0}
              >
                <option value="">Select Staff</option>
                {staffOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            {selectedDepartment && staffOptions.length === 0 && !isFetchingStaff && (
              <div className="text-xs text-gray-500 mt-1">No staff found in this department</div>
            )}
          </div>

          {/* Handler To */}
          {/* <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <User className="inline mr-1" size={14} /> Handler To
            </p>
            {isFetchingStaff ? (
              <div className="text-sm text-gray-500 mt-1">Loading staff...</div>
            ) : (
              <select
                name="handler_to"
                value={formData.handler_to}
                onChange={handleChange}
                className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                required
                disabled={!selectedDepartment || staffOptions.length === 0}
              >
                <option value="">Select Staff</option>
                {staffOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            {selectedDepartment && staffOptions.length === 0 && !isFetchingStaff && (
              <div className="text-xs text-gray-500 mt-1">No staff found in this department</div>
            )}
          </div> */}

          {/* Priority */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Tag className="inline mr-1" size={14} /> Priority
            </p>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            >
              <option value="">Select priority</option>
              <option value="minor">Minor</option>
              <option value="major">Major</option>
              <option value="critical">Critical</option>
              <option value="blocker">Blocker</option>
            </select>
          </div>
        </div>
      </div>
      {/* Payment Details Section */}
      {/* <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          Payment Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <IndianRupee className="inline mr-1" size={14} /> Budget
            </p>
            <input
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              type="number"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter Budget"
              
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <IndianRupee className="inline mr-1" size={14} /> Overall cost
            </p>
            <input
              name="overallcost"
              value={formData.overallcost}
              onChange={handleChange}
              type="number"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter Overallcost"
            />
          </div>
        </div>
      </div> */}

      {/* Project & Status Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          Project & Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Tag className="inline mr-1" size={14} /> Project Type
            </p>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            >
              <option value="">Select type</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="land">Land</option>
            </select>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Tag className="inline mr-1" size={14} /> Status
            </p>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            >
              <option value="draft">Draft</option>
              <option value="planning">Planning</option>
              <option value="inprocess">In Progress</option>
              <option value="active">Active</option>
              <option value="lead_review">Lead Review</option>
              <option value="completed">Completed</option>
              <option value="revised">Revised</option>
              <option value="client_review">Client_review</option>
              <option value="drop">Drop</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notes & Summary Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <BookOpenText className="inline mr-2" /> Notes & Summary
        </h3>
        <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none min-h-[100px]"
            placeholder="Enter project notes and summary..."
          />
        </div>
      </div>

      {/* Form Actions */}
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
          onClick={handleSubmit}
          className="px-5 py-2 bg-red-700 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-900 text-white rounded-md transition-colors duration-200 font-medium text-sm shadow-sm"
          disabled={loading}
        >
          {loading ? <ButtonLoader /> : "Create Project"}
        </button>
      </div>
    </div>
  );
};

export default AddNewProject;