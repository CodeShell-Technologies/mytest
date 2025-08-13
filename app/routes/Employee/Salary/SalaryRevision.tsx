

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
  Trash2,
  SquarePen,
  CircleCheckBig,
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
import Modal from "src/component/Modal";
import HRSalaryApprovalForm from "./HRSalaryApprovalForm";
// import HRSalaryApprovalForm

const SalaryRevision = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [error, setError] = useState(null);
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [salaryRequests, setSalaryRequests] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [staffOptions, setStaffOptions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  
  // Auth store data
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
    { value: "", label: "All Status" },
    { value: "submitted", label: "Submitted" },
    { value: "teamlead_reviewed", label: "Team Lead Reviewed" },
    { value: "hr_reviewed", label: "HR Reviewed" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const [selectedStatus, setSelectedStatus] = useState("");

  // Filter branch options based on user role
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

  // Set initial branch code for HR
  useEffect(() => {
    if (role === "hr") {
      setSelectedBranchCode(userBranchCode);
    }
  }, [role, userBranchCode]);

  // Set staff ID for employees (non-HR, non-superadmin)
  useEffect(() => {
    if (role !== "hr" && role !== "superadmin") {
      setSelectedStaffId(staff_id);
    }
  }, [role, staff_id]);

  // Fetch staff options when branch code changes (for superadmin and HR)
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

  // Fetch salary requests
  const fetchSalaryRequests = async () => {
    setLoading(true);
    try {
      let url = `${BASE_URL}/users/self_rating/read`;
      const params = new URLSearchParams();
      
      if (role === "superadmin") {
        if (selectedBranchCode) params.append("branchcode", selectedBranchCode);
        if (selectedStaffId) params.append("staff_id", selectedStaffId);
      } else if (role === "hr") {
        params.append("branchcode", userBranchCode);
        if (selectedStaffId) params.append("staff_id", selectedStaffId);
      } else {
        params.append("staff_id", staff_id);
      }

      // Common parameters
      if (selectedStatus) params.append("status", selectedStatus);
      if (startDate) params.append("start_date", formatDate(startDate));
      if (endDate) params.append("end_date", formatDate(endDate));
      params.append("page", currentPage);
      params.append("limit", pageSize);

      url += `?${params.toString()}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setSalaryRequests(response.data.data || []);
        setTotalItem(response.data.totalDocuments || 0);
      }
    } catch (error) {
      console.error("Error fetching salary requests", error);
      toast.error("Failed to fetch salary requests");
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
  };

  const handleEditBranch = (branch) => {
    setSelectedBranch(branch);
    setShowEditModal(true);
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

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  const handleApprovalSuccess = () => {
    setShowApprovalModal(false);
    toast.success("Salary request processed successfully!");
    fetchSalaryRequests();
  };

  const handleOnExport = () => {
    if (!salaryRequests || salaryRequests.length === 0) {
      toast.error("No data to export");
      return;
    }

    const dataToExport = salaryRequests.map((request) => ({
      "Performance ID": request.performance_id,
      "Staff ID": request.staff_id,
      "Name": request.name,
      "Branch Code": request.branchcode,
      "Designation": request.designation,
      "Department": request.department,
      "Review Year": request.review_year,
      "Self Rating": request.self_rating_overall,
      "Lead Rating": request.lead_technical_rating,
      "Status": request.status,
      "Increment Percentage": request.increment_percentage,
      "Increment Effective Date": request.increment_effective_date,
      "Created On": request.created_on,
      "Updated On": request.updated_on,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(wb, ws, "SalaryRequests");
    XLSX.writeFile(wb, "SalaryRequests.xlsx");
  };

  useEffect(() => {
    fetchSalaryRequests();
  }, [
    currentPage,
    pageSize,
    selectedBranchCode,
    selectedStaffId,
    selectedStatus,
    startDate,
    endDate,
    role,
    userBranchCode,
  ]);

  const handleApproveRequest = (request) => {
    setSelectedRequest(request);
    setShowApprovalModal(true);
  };

  const thead = () => [
    { data: "Performance ID" },
    { data: "Staff ID" },
    { data: "Name" },
    { data: "Branch Code" },
    { data: "Designation" },
    { data: "Department" },
    { data: "Review Year" },
    { data: "Self Rating" },
    { data: "Lead Rating" },
    { data: "Status" },
    { data: "Increment %" },
    { data: "Effective Date" },
    { data: "Created On" },
    { data: "Action" },
  ];

  const tbody = () => {
    if (!salaryRequests) return [];

    return salaryRequests.map((request) => {
      return ({
        id: request.performance_id,
        data: [
          { data: request.performance_id },
          { data: request.staff_id },
          { data: request.name },
          { data: request.branchcode },
          { data: request.designation },
          { data: request.department },
          { data: request.review_year },
          { data: request.self_rating_overall || "-" },
          { data: request.lead_technical_rating || "-" },
          {
            data: (
              <div
                className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${request.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : request.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : request.status === "hr_reviewed" || request.status === "teamlead_reviewed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"}`}
              >
                {request.status === "approved" ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : request.status === "rejected" ? (
                  <XCircle className="w-3 h-3 mr-1" />
                ) : (
                  <Clock className="w-3 h-3 mr-1" />
                )}
                {request.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </div>
            ),
          },
          { data: request.increment_percentage ? `${request.increment_percentage}%` : "-" },
          {
            data: request.increment_effective_date
              ? new Date(request.increment_effective_date).toLocaleDateString()
              : "-"
          },
          { data: new Date(request.created_on).toLocaleDateString() },
          {
            data: (
              <div className="flex flex-nowrap justify-center gap-2">
                {/* Show Approve button only for HR and superadmin roles */}
                {(role === "hr" || role === "superadmin") && (
                  <button
                    className="p-1 text-amber-600 rounded hover:text-gray-500 dark:hover:text-gray-300"
                    onClick={() => handleApproveRequest(request)}
                    title="Process"
                    disabled={request.status === "approved" || request.status === "rejected"}
                  >
                    <CircleCheckBig size={18} />
                  </button>
                )}
              </div>
            ),
            className: "action-cell",
          },
   
        ],
      });
    });
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)]">
              Salary Increment Requests
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
          </div>
          <Toaster position={toastposition} reverseOrder={false} />

          <div
            className={`${isMobile && !showFilters ? "hidden" : "block"} mb-4`}
          >
            <div
              className={`grid grid-cols-1 ${role !== "superadmin" && role !== "hr" ? "md:grid-cols-2 lg:grid-cols-2 gap-3" : "md:grid-cols-4 lg:grid-cols-4 gap-20"}`}
            >
              {/* Branch dropdown - only for superadmin */}
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

              {/* Staff dropdown - for superadmin and HR */}
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

              {/* Status dropdown */}
              <Dropdown
                options={statusOptions}
                selectedValue={selectedStatus}
                onSelect={handleStatusChange}
                placeholder="Select Status"
                className="w-[245px]"
              />

              {/* Date range picker */}
              <div className="w-[245px]">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleDateChange}
                  placeholderText="Select date range"
                  className="w-full p-2 border rounded h-[40px]"
                  isClearable={true}
                />
              </div>
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
              disabled={salaryRequests.length === 0}
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
              paginationLabel="salary requests"
              isScroll={true}
            />
          </div>
        </div>
      </div>

      <Modal
        isVisible={showApprovalModal}
        className="w-full md:w-[800px]"
        onClose={() => setShowApprovalModal(false)}
        title="Process Salary Request"
      >
        <HRSalaryApprovalForm
          salaryRequest={selectedRequest}
          onSuccess={handleApprovalSuccess}
          onCancel={() => setShowApprovalModal(false)}
        />
      </Modal>
    </>
  );
};

export default SalaryRevision;