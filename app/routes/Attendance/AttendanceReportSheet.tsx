import React from "react";
import { useEffect, useState } from "react";
import DataTable from "src/component/DataTable";
import CustomPagination from "src/component/CustomPagination";
import Dropdown from "src/component/DrapDown";
import {
  CalendarFold,
  FileDown,
  UserCheck,
  Filter,
  X,
  Clock,
  Users,
  BookUser,
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

const AttendanceSheetReport = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [error, setError] = useState(null);
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [attendanceData, setAttendanceData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(null);
  const [staffOptions, setStaffOptions] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);

  const token = useAuthStore((state) => state.accessToken);
  const permission = useAuthStore((state) => state.permissions);
  const staff_id = useAuthStore((state) => state.staff_id);
  const userBranchCode = useAuthStore((state) => state.branchcode);
  const role = permission[0]?.role || "employee";

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

  const statusOptions = [
    { value: "present", label: "Present" },
    { value: "absent", label: "Absent" },
    { value: "leave", label: "Leave" },
    { value: "halfday", label: "Half Day" },
  ];

  const filteredBranchOptions = () => {
    if (role === "superadmin") {
      return branchCodeOptions;
    } else if (role === "team-lead") {
      return branchCodeOptions.filter(
        (branch) => branch.value === userBranchCode
      );
    }
    return [];
  };

  useEffect(() => {
    if (role === "superadmin" || role === "team-lead") {
      fetchBranches(token);
    }
  }, [token, role]);

  useEffect(() => {
    if (role === "team-lead") {
      setSelectedBranchCode(userBranchCode);
    }
  }, [role, userBranchCode]);

  useEffect(() => {
    if (role !== "team-lead" && role !== "superadmin") {
      setSelectedStaffId(staff_id);
    }
  }, [role, staff_id]);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!selectedBranchCode) {
        setTeamOptions([]);
        return;
      }

      try {
        const url = `${BASE_URL}/teams/read?branchcode=${selectedBranchCode}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.data) {
          const options = response.data.data.map((team) => ({
            value: team.team_id,
            label: team.team_name,
          }));
          setTeamOptions(options);
        }
      } catch (error) {
        console.error("Error fetching teams", error);
        toast.error("Failed to fetch teams");
      }
    };

    if (role === "superadmin" || role === "team-lead") {
      fetchTeams();
    }
  }, [selectedBranchCode, token, role]);

  useEffect(() => {
    const getStaffOptions = async () => {
      if (
        (role === "superadmin" && !selectedBranchCode) ||
        (role === "team-lead" && !userBranchCode)
      ) {
        setStaffOptions([]);
        return;
      }

      setLoading(true);
      try {
        const branchToUse =
          role === "team-lead" ? userBranchCode : selectedBranchCode;
        let url = `${BASE_URL}/users/read?branchcode=${branchToUse}`;

        if (selectedTeamId) {
          url += `&team_id=${selectedTeamId}`;
        }

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

    if (role === "superadmin" || role === "team-lead") {
      getStaffOptions();
    }
  }, [selectedBranchCode, selectedTeamId, token, role, userBranchCode]);

  const fetchAttendanceData = async () => {
    const staffIdToUse =
      role !== "team-lead" && role !== "superadmin"
        ? staff_id
        : selectedStaffId;

    if (
      (role === "superadmin" || role === "team-lead") &&
      !staffIdToUse &&
      !selectedTeamId
    ) {
      toast.error("Please select at least Staff or Team to filter");
      return;
    }

    setLoading(true);
    try {
      let url = `${BASE_URL}/users/attendance/read?page=${currentPage}&limit=${pageSize}`;

      if (staffIdToUse) url += `&staff_id=${encodeURIComponent(staffIdToUse)}`;
      if (selectedBranchCode)
        url += `&branchcode=${encodeURIComponent(selectedBranchCode)}`;
      if (selectedTeamId)
        url += `&team_id=${encodeURIComponent(selectedTeamId)}`;
      if (startDate) url += `&start_date=${formatDate(startDate)}`;
      if (endDate) url += `&end_date=${formatDate(endDate)}`;
      if (attendanceDate)
        url += `&attendance_date=${formatDate(attendanceDate)}`;
      if (selectedStatus.length > 0) {
        selectedStatus.forEach((status) => {
          url += `&status=${encodeURIComponent(status)}`;
        });
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setAttendanceData(response.data);
        setTotalItem(response.data.totalDocuments || 0);
      }
    } catch (error) {
      console.error("Error fetching attendance data", error);
      toast.error("Failed to fetch attendance data");
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
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
    fetchAttendanceData();
  };

  const handleBranchCodeChange = (value) => {
    setSelectedBranchCode(value);
    setSelectedTeamId("");
    setSelectedStaffId("");
    setCurrentPage(1);
  };

  const handleTeamChange = (value) => {
    setSelectedTeamId(value);
    setSelectedStaffId("");
    setCurrentPage(1);
  };

  const handleStaffChange = (value) => {
    setSelectedStaffId(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setAttendanceDate(null);
  };

  const handleSingleDateChange = (date) => {
    setAttendanceDate(date);
    setStartDate(null);
    setEndDate(null);
  };

  const clearDateRange = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const clearSingleDate = () => {
    setAttendanceDate(null);
  };

  const handleOnExport = () => {
    if (!attendanceData?.data || attendanceData.data.length === 0) {
      toast.error("No data to export");
      return;
    }

    const dataToExport = attendanceData.data.map((record) => ({
      "Staff ID": record.staff_id,
      "Staff Name": record.staff_name,
      Date: record.attendance_date,
      Status: record.status,
      "Total Hours": record.total_worked_hours,
      Branch: record.branch_name || "N/A",
      Team: record.team_id || "N/A",
      Designation: record.designation,
      Department: record.department,
      Remarks: record.remarks || "N/A",
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(wb, ws, "AttendanceReport");
    XLSX.writeFile(wb, "AttendanceReport.xlsx");
  };

  const generateReport = () => {
    fetchAttendanceData();
  };

  const getStatusBadge = (status) => {
    let bgColor = "";
    let textColor = "";

    switch (status.toLowerCase()) {
      case "present":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        break;
      case "absent":
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        break;
      case "leave":
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        break;
      case "halfday":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        break;
      default:
        bgColor = "bg-gray-100";
        textColor = "text-gray-800";
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs ${bgColor} ${textColor}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const attendanceThead = () => [
    { data: "Staff ID" },
    { data: "Staff Name" },
    { data: "Date" },
    { data: "Status" },
    { data: "Total Hours" },
    { data: "Branch" },
    { data: "Team" },
  ];

  const attendanceTbody = () => {
    if (!attendanceData?.data) return [];

    return attendanceData.data.map((record, index) => ({
      id: record.id || index,
      data: [
        { data: record.staff_id },
        { data: record.staff_name },
        { data: new Date(record.attendance_date).toLocaleDateString() },
        { data: getStatusBadge(record.status) },
        { data: record.total_worked_hours },
        { data: record.branch_name || "N/A" },
        { data: record.team_id || "N/A" },
      ],
    }));
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)] mb-5">
              Attendance Report
            </h2>
          </div>
          <Toaster position={toastposition} reverseOrder={false} />

          <div className="flex flex-col gap-4 mb-5">
            <div
              className={`grid grid-cols-1 ${role !== "superadmin" && role !== "team-lead" ? "md:grid-cols-2 lg:grid-cols-2 gap-3" : "md:grid-cols-4 lg:grid-cols-4 gap-20"}`}
            >
              {(role === "superadmin" || role === "team-lead") && (
                <Dropdown
                  options={filteredBranchOptions()}
                  selectedValue={selectedBranchCode}
                  onSelect={handleBranchCodeChange}
                  placeholder="Select Branch"
                  className="w-[245px]"
                  isLoading={isStoreLoading}
                  disabled={role === "team-lead"}
                />
              )}

              {(role === "superadmin" || role === "team-lead") && (
                <Dropdown
                  options={teamOptions}
                  selectedValue={selectedTeamId}
                  onSelect={handleTeamChange}
                  placeholder="Select Team"
                  className="w-[245px]"
                  disabled={
                    role === "team-lead" ? !userBranchCode : !selectedBranchCode
                  }
                  isLoading={loading}
                />
              )}

              {(role === "superadmin" || role === "team-lead") && (
                <Dropdown
                  options={staffOptions}
                  selectedValue={selectedStaffId}
                  onSelect={handleStaffChange}
                  placeholder="Select Staff"
                  className="w-[245px]"
                  disabled={
                    role === "team-lead" ? !userBranchCode : !selectedBranchCode
                  }
                  isLoading={loading}
                />
              )}

              <Dropdown
                options={statusOptions}
                selectedValue={selectedStatus}
                onSelect={handleStatusChange}
                placeholder="Select Status"
                className="w-[245px]"
                isMulti={true}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="w-[245px] relative">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleDateRangeChange}
                  placeholderText="Select date range"
                  className="w-full p-2 border rounded h-[40px]"
                  isClearable={true}
                />
                {(startDate || endDate) && (
                  <button
                    onClick={clearDateRange}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="w-[245px] relative">
                <DatePicker
                  selected={attendanceDate}
                  onChange={handleSingleDateChange}
                  placeholderText="Select specific date"
                  className="w-full p-2 border rounded h-[40px]"
                  isClearable={true}
                />
                {attendanceDate && (
                  <button
                    onClick={clearSingleDate}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <Dropdown
                options={pageSizeOptions}
                selectedValue={pageSize}
                onSelect={handlePageSizeChange}
                placeholder="Items per page"
                className="w-[245px]"
              />
            </div>

            <div className="flex flex-wrap justify-between items-center">
              <div
                className={`flex ${role !== "superadmin" && role !== "team-lead" ? "gap-91" : "gap-19"}`}
              >
                <button
                  onClick={handleOnExport}
                  className="flex items-center justify-center text-gray-400 bg-white focus:outline-non font-medium text-sm rounded-sm border border-dotted border-gray-400 hover:text-red-700/70 px-2 dark:bg-gray-800 dark:text-gray-300 py-2 w-[245px]"
                  disabled={!attendanceData?.data}
                >
                  <FileDown className="mr-1" />
                  {!isMobile && "Export Excel"}
                </button>
              </div>

              <button
                onClick={generateReport}
                className="flex items-center justify-center text-white bg-[var(--color-primary)] hover-effect dark:bg-red-800 focus:outline-non font-medium text-sm rounded-sm px-5 py-2.5"
                disabled={
                  (role !== "team-lead" && role !== "superadmin"
                    ? !attendanceDate && !startDate
                    : !selectedStaffId &&
                      !selectedTeamId &&
                      !attendanceDate &&
                      !startDate) || loading
                }
              >
                {loading ? "Loading..." : "Generate Report"}
              </button>
            </div>
          </div>

          {loading && <div className="text-center py-4">Loading...</div>}
          {error && (
            <div className="text-red-500 text-center py-4">{error}</div>
          )}

          {attendanceData?.data && (
            <>
              <div className="mb-6 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg text-[var(--color-primary)] font-semibold mb-2">
                  Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-3 flex items-center">
                      <BookUser className="mr-1" size={16} /> Total Records
                    </p>
                    <p className="font-medium">
                      {attendanceData.totalDocuments}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-3 flex items-center">
                      <Users className="mr-1" size={16} /> Unique Staff
                    </p>
                    <p className="font-medium">
                      {
                        new Set(
                          attendanceData.data.map((item) => item.staff_id)
                        ).size
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-3 flex items-center">
                      <Clock className="mr-1" size={16} /> Date Range
                    </p>
                    <p className="font-medium">
                      {attendanceData.data.length > 0
                        ? `${new Date(attendanceData.data[0].attendance_date).toLocaleDateString()} - 
                           ${new Date(attendanceData.data[attendanceData.data.length - 1].attendance_date).toLocaleDateString()}`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <UserCheck className="mr-2" size={20} /> Attendance Records
                </h3>
                <div className="overflow-x-auto">
                  <DataTable
                    thead={attendanceThead}
                    tbody={attendanceTbody}
                    responsive={true}
                    className="min-w-full"
                  />
                </div>
              </div>

              <div className="bottom-0 border-t border-gray-200 dark:border-gray-700 p-4">
                <CustomPagination
                  total={totalItem}
                  currentPage={currentPage}
                  defaultPageSize={pageSize}
                  onChange={handlePageChange}
                  paginationLabel="records"
                  isScroll={true}
                />
              </div>
            </>
          )}

          {!loading && !attendanceData && (
            <div className="text-center py-10 text-gray-500">
              {role !== "team-lead" && role !== "superadmin"
                ? !attendanceDate && !startDate
                  ? "Please select date to generate report"
                  : "Click 'Generate Report' to view your attendance"
                : role === "team-lead"
                  ? !userBranchCode
                    ? "Loading branch information..."
                    : !selectedStaffId && !selectedTeamId
                      ? "Please select Staff or Team and date"
                      : !attendanceDate && !startDate
                        ? "Please select date"
                        : "Click 'Generate Report' to view data"
                  : !selectedBranchCode
                    ? "Please select Branch to view available options"
                    : !selectedStaffId && !selectedTeamId
                      ? "Please select Staff or Team"
                      : !attendanceDate && !startDate
                        ? "Please select date"
                        : "Click 'Generate Report' to view data"}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AttendanceSheetReport;
