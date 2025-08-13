import { useEffect, useState } from "react";
import DataTable from "src/component/DataTable";
import CustomPagination from "src/component/CustomPagination";
import Dropdown from "src/component/DrapDown";
import {
  FileDown,
  Filter,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Clock1,
  SquarePen,
  Trash2,
} from "lucide-react";
import * as XLSX from "xlsx";
import axios from "axios";
import { BASE_URL, toastposition } from "~/constants/api";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "src/stores/authStore";
import useBranchStore from "src/stores/useBranchStore";
import { useMediaQuery } from "~/routes/hooks/use-click-outside";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate } from "../../../src/utils/dateUtils";
import Modal from "src/component/Modal";
import EditBranchForm from "../Branch/EditFormData";
import CreateAttendance from "./CreateAttendance";

const AttendanceLogList = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [error, setError] = useState(null);
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [staffOptions, setStaffOptions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [isCheckingIn, setIsCheckingIn] = useState(true);

  const token = useAuthStore((state) => state.accessToken);
  const permission = useAuthStore((state) => state.permissions);
  const staff_id = useAuthStore((state) => state.staff_id);
  const userBranchCode = useAuthStore((state) => state.branchcode);
  const [showEditModal, setShowEditModal] = useState(false);
  const role = permission[0]?.role || "employee";
  const [selectedLog, setSelectedLog] = useState(null);
  const {
    branchCodeOptions,
    fetchBranches,
    isLoading: isStoreLoading,
  } = useBranchStore();

  const pageSizeOptions = [
    { value: 10, label: "10 per page" },
    { value: 20, label: "20 per page" },
    { value: 50, label: "50 per page" },
    { value: 100, label: "100 per page" },
  ];

  const filteredBranchOptions = () => {
    if (role === "superadmin") {
      return branchCodeOptions;
    } else if (role === "hr") {
      return branchCodeOptions.filter(
        (branch) => branch.value === userBranchCode
      );
    }
    return [];
  };

  useEffect(() => {
    if (role === "superadmin" || role === "hr") {
      fetchBranches(token);
    }
  }, [token, role]);

  useEffect(() => {
    if (role === "hr") {
      setSelectedBranchCode(userBranchCode);
    }
  }, [role, userBranchCode]);

  useEffect(() => {
    if (role !== "hr" && role !== "superadmin") {
      setSelectedStaffId(staff_id);
    }
  }, [role, staff_id]);

  useEffect(() => {
    const getStaffOptions = async () => {
      if (
        (role === "superadmin" && !selectedBranchCode) ||
        (role === "hr" && !userBranchCode)
      ) {
        setStaffOptions([]);
        return;
      }

      setLoading(true);
      try {
        const branchToUse = role === "hr" ? userBranchCode : selectedBranchCode;
        const url = `${BASE_URL}/users/dropdown?branchcode=${branchToUse}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.data) {
          const options = response.data.data.map((staff) => ({
            value: staff.staff_id,
            label: `${staff.firstname} ${staff.lastname} (${staff.staff_id})`,
          }));
          setStaffOptions(options);
        }
      } catch (error) {
        console.error("Error fetching staff list", error);
        toast.error("Failed to fetch staff");
      } finally {
        setLoading(false);
      }
    };

    if (role === "superadmin" || role === "hr") {
      getStaffOptions();
    }
  }, [selectedBranchCode, token, role, userBranchCode]);

  const checkTodayAttendance = async () => {
    if (role === "superadmin" || role === "hr") return;

    try {
      const today = new Date().toISOString().split("T")[0];
      const url = `${BASE_URL}/users/attendance-log/read?staff_id=${staff_id}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("responseee", response);
      if (response.data && response.data.data) {
        setTodayAttendance(response.data.data);
        setHasCheckedInToday(
          response.data.data.check_in && !response.data.data.check_out
        );
      } else {
        setTodayAttendance(null);
        setHasCheckedInToday(false);
      }
    } catch (error) {
      console.error("Error checking today's attendance", error);
      toast.error("Failed to check today's attendance");
    }
  };

  const handleCheckIn = async () => {
    try {
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const timeString = now.toISOString();

      const checkInData = {
        staff_id: staff_id,
        attendance_date: today,
        check_in: timeString,
      };

      const checkinRes = await axios.post(
        `${BASE_URL}/users/attendance-log/create`,
        checkInData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("responseeee", checkinRes);

      setShowCheckModal(false);
      toast.success("Checked in successfully");
      await checkTodayAttendance();
      await fetchAttendanceLogs();
    } catch (error) {
      console.error("Error during check in", error);
      toast.error(error.response?.data?.message || "Failed to check in");
    }
  };

  const handleCheckOut = async () => {
    try {
      if (!todayAttendance) {
        toast.error("No check-in record found for today");
        return;
      }

      const now = new Date();
      const timeString = now.toISOString();

      const checkOutData = {
        id: todayAttendance._id,
        check_out: timeString,
      };

      const checkoutRes = await axios.post(
        `${BASE_URL}/users/attendance-log/create`,
        checkOutData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("checkoutdataaa", checkoutRes);
      toast.success("Checked out successfully");
      await checkTodayAttendance();
      await fetchAttendanceLogs();
      setShowCheckModal(false);
    } catch (error) {
      console.error("Error during check out", error);
      toast.error(error.response?.data?.message || "Failed to check out");
    }
  };

  const fetchAttendanceLogs = async () => {
    setLoading(true);
    try {
      let url = `${BASE_URL}/users/attendance-log/read`;
      const params = new URLSearchParams();

      if (role === "superadmin") {
        if (selectedStaffId) params.append("staff_id", selectedStaffId);
      } else if (role === "hr") {
        if (selectedStaffId) params.append("staff_id", selectedStaffId);
      } else {
        params.append("staff_id", staff_id);
      }

      if (startDate) params.append("start_date", formatDate(startDate));
      if (endDate) params.append("end_date", formatDate(endDate));
      params.append("page", currentPage);
      params.append("limit", pageSize);
      params.append("sort", "-date"); 

      url += `?${params.toString()}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setAttendanceLogs(response.data.data || []);
        setTotalItem(response.data.totalDocuments || 0);
      }
    } catch (error) {
      console.error("Error fetching attendance logs", error);
      toast.error("Failed to fetch attendance logs");
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };
  const handleEditSuccess = () => {
    setShowEditModal(false);
    toast.success("Branch updated successfully!");
  };
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBranchCodeChange = (value) => {
    setSelectedBranchCode(value);
    setSelectedStaffId("");
    setCurrentPage(1);
  };

  const handleStaffChange = (value) => {
    setSelectedStaffId(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleOnExport = () => {
    if (!attendanceLogs || attendanceLogs.length === 0) {
      toast.error("No data to export");
      return;
    }

    const dataToExport = attendanceLogs.map((log) => ({
      "Staff ID": log.staff_id,
      "Branch Code": log.branchcode,
      Date: log.date,
      "Check In": log.check_in,
      "Check Out": log.check_out || "N/A",
      "Total Hours": log.total_hours || "N/A",
      Status: log.status,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(wb, ws, "AttendanceLogs");
    XLSX.writeFile(wb, "AttendanceLogs.xlsx");
  };

  useEffect(() => {
    fetchAttendanceLogs();
    if (role !== "superadmin" && role !== "hr") {
      checkTodayAttendance();
    }
  }, [
    currentPage,
    pageSize,
    selectedStaffId,
    startDate,
    endDate,
    role,
    userBranchCode,
  ]);

  const handleEditAttendance = (log) => {
    setSelectedLog(log);
    setShowEditModal(true);
  };

  const formatDuration = (totalSeconds) => {
    if (!totalSeconds || isNaN(totalSeconds)) return "N/A";

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };
  const thead = () => [
    { data: "Staff ID" },
    { data: "Staff Name" },
    { data: "Date" },
    { data: "Check In" },
    { data: "Check Out" },
    { data: "Total Hours" },
    { data: "Status" },
    { data: "Action" },
  ];

  const tbody = () => {
    if (!attendanceLogs) return [];

    return attendanceLogs.map((log) => ({
      id: log._id,
      data: [
        { data: log.staff_id },
        { data: log.staff_name },
        { data: new Date(log.create_datetime).toLocaleDateString() },
        { data: formatDate(log.check_in) || "N/A" },
        { data: formatDate(log.check_out) || "N/A" },
        { data: formatDuration(log.duration) },

        {
          data: (
            <div
              className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${
                log.status === "checkin"
                  ? "bg-green-100 text-green-800"
                  : log.status === "checkout"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {log.status === "present" ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : log.status === "absent" ? (
                <XCircle className="w-3 h-3 mr-1" />
              ) : (
                <Clock className="w-3 h-3 mr-1" />
              )}
              {log.status}
            </div>
          ),
        },
        {
          data: (
            <div className="flex flex-wrap justify-center gap-2">
        
              <button
                className="p-1 text-[var(--color-primary)] rounded hover:text-gray-500 dark:hover:text-gray-300"
                onClick={() => handleEditAttendance(log)}
                title="Edit"
              >
                <SquarePen size={18} />
              </button>
             
            </div>
          ),
          className: "action-cell",
        },
      ],
    }));
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)]">
              Attendance Logs
            </h2>
            {isMobile && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 bg-gray-200 rounded-md"
              >
                <Filter size={18} className="mr-1" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            )}
            {role !== "superadmin" && role !== "hr" && (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setIsCheckingIn(true);
                    setShowCheckModal(true);
                  }}
                  className={`flex items-center justify-center text-white font-medium text-sm rounded-sm px-5 py-2.5 ${
                    hasCheckedInToday
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[var(--color-primary)] hover-effect"
                  }`}
                  disabled={hasCheckedInToday}
                >
                  {!isMobile && "Check In"}
                  <Clock1 className="ml-4" size={20} />
                </button>
                <button
                  onClick={() => {
                    setIsCheckingIn(false);
                    setShowCheckModal(true);
                  }}
                  className={`flex items-center justify-center text-white font-medium text-sm rounded-sm px-5 py-2.5 ${
                    !hasCheckedInToday
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[var(--color-primary)] hover-effect"
                  }`}
                >
                  {!isMobile && "Check Out"}
                  <Clock1 className="ml-4" size={20} />
                </button>
              </div>
            )}
          </div>
          <Toaster position={toastposition} reverseOrder={false} />

          <div
            className={`${isMobile && !showFilters ? "hidden" : "block"} mb-4`}
          >
            <div
              className={`grid grid-cols-1 ${role !== "superadmin" && role !== "hr" ? "md:grid-cols-1 lg:grid-cols-1 gap-3" : "md:grid-cols-3 lg:grid-cols-3 gap-20"}`}
            >
              {role === "superadmin" && (
                <Dropdown
                  options={filteredBranchOptions()}
                  selectedValue={selectedBranchCode}
                  onSelect={handleBranchCodeChange}
                  placeholder="Select Branch"
                  className="w-[245px]"
                  isLoading={isStoreLoading}
                />
              )}

              {(role === "superadmin" || role === "hr") && (
                <Dropdown
                  options={staffOptions}
                  selectedValue={selectedStaffId}
                  onSelect={handleStaffChange}
                  placeholder="Select Staff"
                  className="w-[245px]"
                  disabled={role === "hr" ? false : !selectedBranchCode}
                  isLoading={loading}
                />
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <Dropdown
              options={pageSizeOptions}
              selectedValue={pageSize}
              onSelect={handlePageSizeChange}
              placeholder="Items per page"
              className="w-[150px]"
            />

            <button
              onClick={handleOnExport}
              className="flex items-center justify-center text-gray-400 bg-white focus:outline-non font-medium text-sm rounded-sm border border-dotted border-gray-400 hover:text-red-700/70 px-3 dark:bg-gray-800 dark:text-gray-300 py-2"
              disabled={attendanceLogs.length === 0}
            >
              <FileDown className="mr-1" />
              {!isMobile && "Export Excel"}
            </button>
          </div>

          {loading && <div className="text-center py-4">Loading...</div>}
          {error && (
            <div className="text-red-500 text-center py-4">{error}</div>
          )}

          <div className="overflow-x-auto">
            <DataTable
              thead={thead}
              tbody={tbody}
              responsive={true}
              className="min-w-full"
            />
          </div>

          <div className="bottom-0 border-t border-gray-200 dark:border-gray-700 p-4">
            <CustomPagination
              total={totalItem}
              currentPage={currentPage}
              defaultPageSize={pageSize}
              onChange={handlePageChange}
              paginationLabel="attendance logs"
              isScroll={true}
            />
          </div>
        </div>
      </div>

      <Modal
        isVisible={showCheckModal}
        className="w-full md:w-[400px]"
        onClose={() => setShowCheckModal(false)}
        title={
          isCheckingIn ? "Check In Confirmation" : "Check Out Confirmation"
        }
      >
        <div className="p-4">
          <p className="mb-4">
            {isCheckingIn
              ? "Are you sure you want to check in?"
              : "Are you sure you want to check out?"}
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowCheckModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={isCheckingIn ? handleCheckIn : handleCheckOut}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-red-800"
            >
              {isCheckingIn ? "Check In" : "Check Out"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AttendanceLogList;
