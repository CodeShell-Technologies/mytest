import { useEffect, useState } from "react";
import DataTable from "src/component/DataTable";
import Dropdown from "src/component/DrapDown";
import { FileDown, Filter, Plus, CheckCircle, XCircle, Clock } from "lucide-react";
import axios from "axios";
import { BASE_URL, toastposition } from "~/constants/api";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "src/stores/authStore";
import useBranchStore from "src/stores/useBranchStore";
import { useMediaQuery } from "~/routes/hooks/use-click-outside";
import Modal from "src/component/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdGitBranch } from "react-icons/io";

const AttendanceSheet = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(new Date());
  const [status, setStatus] = useState("present");
  const [remarks, setRemarks] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const token = useAuthStore((state) => state.accessToken);
  const permission = useAuthStore((state) => state.permissions);
  const userBranchCode = useAuthStore((state) => state.branchcode);
  const role = permission[0]?.role || "employee";

  const { branchCodeOptions, fetchBranches, isLoading: isStoreLoading } = useBranchStore();

  useEffect(() => {
    if (role === "superadmin" || role === "hr") {
      fetchBranches(token);
    }
  }, [token, role]);

  useEffect(() => {
    if (role === "hr") {
      setSelectedBranchCode(userBranchCode);
      fetchStaffList(userBranchCode);
    }
  }, [role, userBranchCode]);

  const fetchStaffList = async (branchCode) => {
    setLoading(true);
    try {
      const url = `${BASE_URL}/users/read?branchcode=${branchCode}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setStaffList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching staff list", error);
      toast.error("Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  };

  const handleBranchChange = (value) => {
    setSelectedBranchCode(value);
    fetchStaffList(value);
  };

  const handleCreateAttendance = (staff) => {
    setSelectedStaff(staff);
    setShowCreateModal(true);
  };

  const handleSubmitAttendance = async () => {
    if (!selectedStaff) return;

    try {
      setLoading(true);
      const formattedDate = attendanceDate.toISOString().split("T")[0];

      const attendanceData = {
        staff_id: selectedStaff.staff_id,
        branchcode: selectedStaff.branchcode,
        attendance_date: formattedDate,
        status: status,
        remarks: remarks
      };

      await axios.post(`${BASE_URL}/users/attendance/create`, attendanceData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Attendance recorded successfully");
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating attendance", error);
      toast.error(error.response?.data?.message || "Failed to record attendance");
    } finally {
      setLoading(false);
    }
  };

  const thead = () => [
    { data: "Staff ID" },
    { data: "Name" },
    { data: "Department" },
    { data: "Designation" },
    { data: "Branch" },
    { data: "Actions" },
  ];

  const tbody = () => {
    return staffList.map((staff) => ({
      id: staff.staff_id,
      data: [
        { data: staff.staff_id },
        { data: `${staff.firstname} ${staff.lastname}` },
        { data: staff.department },
        { data: staff.designation },
        { data: staff.branchcode },
        {
          data: (
            <button
              onClick={() => handleCreateAttendance(staff)}
              className="flex items-center justify-center text-white bg-[var(--color-primary)] hover-effect text-sm rounded-sm px-3 py-1.5"
            >
              <Plus size={16} className="mr-1" />
              Add Attendance
            </button>
          ),
        },
      ],
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)]">
            Attendance Sheet
          </h2>
          <Toaster position={toastposition} reverseOrder={false} />

          {isMobile && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 bg-gray-200 rounded-md"
            >
              <Filter size={18} className="mr-1" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          )}
        </div>

        <div className={`${isMobile && !showFilters ? "hidden" : "block"} mb-4`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(role === "superadmin" || role === "hr") && (
              <div className="flex items-center gap-2">
               
                <Dropdown
                  options={branchCodeOptions}
                  selectedValue={selectedBranchCode}
                  onSelect={handleBranchChange}
                  placeholder="Select Branch"
                  className="w-[50%]"
                  isLoading={isStoreLoading}
                  disabled={role === "hr"}
                />
              </div>
            )}
          </div>
        </div>

        {loading && <div className="text-center py-4">Loading...</div>}

        {staffList.length > 0 ? (
          <div className="overflow-x-auto">
            <DataTable
              thead={thead}
              tbody={tbody}
              responsive={true}
              className="min-w-full"
            />
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            {selectedBranchCode 
              ? "No staff members found in this branch"
              : "Please select a branch to view staff members"}
          </div>
        )}
      </div>

      <Modal
        isVisible={showCreateModal}
        className="w-full md:w-[600px]"
        onClose={() => setShowCreateModal(false)}
        title="Record Attendance"
      >
        <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
          {selectedStaff && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Staff ID
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                    {selectedStaff.staff_id}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Staff Name
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                    {selectedStaff.firstname} {selectedStaff.lastname}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Attendance Date
                  </p>
                  <DatePicker
                    selected={attendanceDate}
                    onChange={(date) => setAttendanceDate(date)}
                    className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </p>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="halfday">Half Day</option>
                    <option value="leave">Leave</option>
                  </select>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg col-span-2 border border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Remarks
                  </p>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none border rounded p-2"
                    rows="3"
                    placeholder="Enter remarks (optional)"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors duration-200 font-medium text-sm"
              onClick={() => setShowCreateModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-5 py-2 bg-[var(--color-primary)] hover:bg-red-800 text-white rounded-md transition-colors duration-200 font-medium text-sm shadow-sm"
              onClick={handleSubmitAttendance}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AttendanceSheet;