import axios from "axios";
import {
  CalendarCheck,
  ClipboardList,
  Flag,
  Hash,
  ListChecks,
  Milestone,
  Network,
  Tag,
  Target,
  User,
  User2Icon,
} from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
import { useAuthStore } from "src/stores/authStore";
import useClientStore from "src/stores/ClientStore";
import useProjectStore from "src/stores/ProjectStore";
import useBranchStore from "src/stores/useBranchStore";
import useEmployeeStore from "src/stores/useEmployeeStore";
import { BASE_URL } from "~/constants/api";

const EditTaskForm = ({ taskData, onSuccess, onCancel }) => {
  console.log("taskkidin tssk", taskData?.task_id);
  console.log("taskkidin tssk details", taskData);
  const branchCodeOption = useBranchStore((state) => state.branchCodeOptions);
  const [loading, setLoading] = useState(false);
  const taskId = taskData.task_id;
  const [fetching, setFetching] = useState(true);
  const clientcodeOptions = useClientStore((state) => state.clientscodeOptions);
  const [error, setError] = useState(null);
  const allProjectcodeOptions = useProjectStore(
    (state) => state.allProjectcodeOptions
  );
  const employeeOption = useEmployeeStore(
    (state) => state.branchEmployeeOptions
  );
  const milestonecodeOption = useProjectStore(
    (state) => state.allMilestonecodeOptions
  );
  const token = useAuthStore((state) => state.accessToken);

  const [formData, setFormData] = useState({
    branchcode: "",
    client_code: "",
    project_code: "",
    milestone_code: "",
    task_title: "",
    task_priority: "",
    start_date: "",
    end_date: "",
    handler_by: "",
    notes: "",
    collaborate: [],
    status: "draft",
  });

  useEffect(() => {
    if (taskData) {
      // Format dates for the input fields (YYYY-MM-DD)
      const formattedStartDate = taskData.start_date
        ? taskData.start_date.split("T")[0]
        : "";
      const formattedEndDate = taskData.end_date
        ? taskData.end_date.split("T")[0]
        : "";

      setFormData({
        branchcode: taskData.branchcode || "",
        client_code: taskData.client_code || "",
        project_code: taskData.project_code || "",
        milestone_code: taskData.milestone_code || "",
        task_title: taskData.task_title || "",
        task_priority: taskData.task_priority || "",
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        handler_by: taskData.handler_by || "",
        notes: taskData.notes || "",
        collaborate: taskData.collaborate || [],
        status: taskData.status || "draft",
      });
    }
  }, [taskData]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //   const validateForm = () => {
  //     if (!formData.branchcode) {
  //       setError("Branch code is required");
  //       return false;
  //     }
  //     if (!formData.project_code) {
  //       setError("Project code is required");
  //       return false;
  //     }
  //     if (!formData.milestone_code) {
  //       setError("Milestone code is required");
  //       return false;
  //     }
  //     if (!formData.task_title) {
  //       setError("Task title is required");
  //       return false;
  //     }
  //     if (!formData.start_date || !formData.end_date) {
  //       setError("Both start and end dates are required");
  //       return false;
  //     }
  //     if (new Date(formData.start_date) > new Date(formData.end_date)) {
  //       setError("End date must be after start date");
  //       return false;
  //     }
  //     if (!formData.handler_by) {
  //       setError("Handler is required");
  //       return false;
  //     }

  //     return true;
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // if (!validateForm()) {
    //   setLoading(false);
    //   return;
    // }

    const taskData = {
      data: {
        branchcode: formData.branchcode,
        client_code: formData.client_code,
        project_code: formData.project_code,
        milestone_code: formData.milestone_code,
        task_title: formData.task_title,
        task_priority: formData.task_priority,
        start_date: formData.start_date,
        end_date: formData.end_date,
        handler_by: formData.handler_by,
        notes: formData.notes,
        status: formData.status,
      },
    };

    try {
      console.log("taskdataaaa", taskData, taskId);
      const response = await axios.put(
        `${BASE_URL}/project/task/edit/${taskId}`,
        taskData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        onSuccess();
      } else {
        setError(response.data.message || "Failed to update task");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      toast.error(err.response?.data?.message || "Error updating task");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <Flag className="inline mr-2" /> Task Information
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
              <Network className="inline mr-1" size={14} /> Related Project
            </p>
            <select
              name="project_code"
              value={formData.project_code}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            >
              <option value="">Select Project</option>
              {allProjectcodeOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Milestone className="inline mr-1" size={14} /> Select Milestone
            </p>
            <select
              name="milestone_code"
              value={formData.milestone_code}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            >
              <option value="">Select Milestone</option>
              {milestonecodeOption?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <ClipboardList className="inline mr-1" size={14} /> Task Title
            </p>
            <input
              name="task_title"
              value={formData.task_title}
              onChange={handleChange}
              type="text"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter task name"
              required
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <User2Icon className="inline mr-1" size={14} /> Select Client
            </p>
            <select
              name="client_code"
              value={formData.client_code}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
            >
              <option value="">Select Client</option>
              {clientcodeOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Tag className="inline mr-1" size={14} /> Task Priority
            </p>
            <select
              name="task_priority"
              value={formData.task_priority}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            >
              <option value="">Select Priority</option>
              <option value="minor">Minor</option>
              <option value="major">Major</option>
              <option value="critical">Critical</option>
              <option value="blocker">Blocker</option>
            </select>
          </div>

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

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <CalendarCheck className="inline mr-1" size={14} /> Due Date
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
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <User className="inline mr-1" size={14} /> Handle By
          </p>
          <select
            name="handler_by"
            value={formData.handler_by}
            onChange={handleChange}
            className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
            required
          >
            {/*<option value="">Select Handler</option>*/}
            <option value={formData.handler_by}>{formData.handler_by}</option>
            {employeeOption?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
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
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {formData.collaborate.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
            Collaborators (Read Only)
          </h3>
          {formData.collaborate.map((collaborate, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <User className="inline mr-1" size={14} /> Staff Member
                </p>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                  {employeeOption?.find(
                    (opt) => opt.value === collaborate.staff_id
                  )?.label || collaborate.staff_id}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <Tag className="inline mr-1" size={14} /> Collaboration Status
                </p>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 capitalize">
                  {collaborate.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <ListChecks className="inline mr-2" /> Notes
        </h3>
        <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            <Target className="inline mr-1" size={14} /> Task Notes
          </p>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none min-h-[100px]"
            placeholder="Enter the Task Notes"
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
          disabled={loading}
          className="px-5 py-2 bg-red-700 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-900 text-white rounded-md transition-colors duration-200 font-medium text-sm shadow-sm disabled:opacity-70"
        >
          {loading ? <ButtonLoader /> : "Update Task"}
        </button>
      </div>
    </div>
  );
};

export default EditTaskForm;
