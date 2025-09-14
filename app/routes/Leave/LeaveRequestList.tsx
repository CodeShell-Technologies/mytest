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
import CreateBranchForm from "../Branch/CreateBranchForm";
import CreateLeaveRequestForm from "./CreateLeaveRequestForm";
import EditBranchForm from "../Branch/EditFormData";
import EditLeaveRequestForm from "./EditLeaveRequestForm";
import HRLeaveApprovalForm from "./HRLeaveApprovalForm";

const LeaveRequestList = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [error, setError] = useState(null);
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [staffOptions, setStaffOptions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  // Auth store data
  const accesstoken = useAuthStore((state) => state.accessToken);
  
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
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const [hydrated, setHydrated] = useState(false);



             // wait for Zustand persist to hydrate
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (useAuthStore.persist.hasHydrated()) {
        setHydrated(true);
      } else {
        const unsub = useAuthStore.persist.onHydrate(() => setHydrated(true));
        return () => unsub();
      }
    }
  }, []);




// const permission = useAuthStore((state) => state.permissions);
  const staff_id = useAuthStore((state) => state.staff_id);
  const userBranchCode = useAuthStore((state) => state.branchcode);
  // const role = permission[0]?.role || "employee";


const token = accesstoken;

const permissions = useAuthStore((state) => state.permissions);
const userRole = permissions?.[0]?.role || null;
const role = userRole;

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
    if (hydrated && token) {
    if (role === "superadmin" || role === "hr") {
      fetchBranches(token);
    }
  }
  }, [hydrated,token, role]);

  // Set initial branch code for HR
  useEffect(() => {
    if (hydrated && token) {
    if (role === "hr") {
      setSelectedBranchCode(userBranchCode);
    }
  }
  }, [hydrated,token,role, userBranchCode]);
  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    toast.success("Leave create Request successfully!");
    fetchLeaveRequests();
  };

  // Set staff ID for employees (non-HR, non-superadmin)
  useEffect(() => {
    if (hydrated && token) {
    if (role !== "hr" && role !== "superadmin") {
      setSelectedStaffId(staff_id);
    }
  }
  }, [hydrated,token,role, staff_id]);

  // Fetch staff options when branch code changes (for superadmin and HR)
  useEffect(() => {
    if (hydrated && token) {
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
  }
}, [hydrated,selectedBranchCode, token, role, userBranchCode]);

  // Fetch leave requests
  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      let url = `${BASE_URL}/users/leavereq/read`;
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
        setLeaveRequests(response.data.data || []);
        setTotalItem(response.data.totalDocuments || 0);
      }
    } catch (error) {
      console.error("Error fetching leave requests", error);
      toast.error("Failed to fetch leave requests");
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
  const handleEditSuccess = () => {
    setShowEditModal(false);
    toast.success("Leave Data updated successfully!");
    fetchBranches(token);
    fetchLeaveRequests();
  };
  const handleApprovedSuccess = () => {
    setShowApprovedModal(false);
    toast.success("Leave Request Approved successfully!");
    fetchBranches(token);
    fetchLeaveRequests();
  };
  const handleOnExport = () => {
    if (!leaveRequests || leaveRequests.length === 0) {
      toast.error("No data to export");
      return;
    }

    const dataToExport = leaveRequests.map((request) => ({
      "Staff ID": request.staff_id,
      "Branch Code": request.branchcode,
      "Leave Type": request.leave_type,
      "Start Date": request.start_date,
      "End Date": request.end_date,
      Reason: request.reason,
      Status: request.status,
      "Applied On": request.requested_on,
      "Approved/Rejected On": request.updated_on,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(wb, ws, "LeaveRequests");
    XLSX.writeFile(wb, "LeaveRequests.xlsx");
  };

  useEffect(() => {
    if (hydrated && token) {

    fetchLeaveRequests();
  }
  }, [
    hydrated,
    token,
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
  const handleEditLeave = (request) => {
    setSelectedLeave(request);
    setShowEditModal(true);
  };
  const handleApprovedLeave = (request) => {
    setSelectedLeave(request);
    setShowApprovedModal(true);
  };
  const thead = () => [
    { data: "Staff ID" },
    { data: "Branch Code" },
    { data: "Leave Type" },
    { data: "Start Date" },
    { data: "End Date" },
    { data: "Reason" },
    { data: "Status" },
    { data: "Applied On" },
    { data: "Approved By" },
    { data: "Approved Date" },
    { data: "Action" },
  ];

  const tbody = () => {
    if (!leaveRequests) return [];

    return leaveRequests.map((request) => ({
      id: request.req_id,
      data: [
        { data: request.staff_id },
        { data: request.branchcode },
        { data: request.leave_type },
        { data: new Date(request.start_date).toLocaleDateString() },
        { data: new Date(request.end_date).toLocaleDateString() },
        { data: request.reason },
        {
          data: (
            <div
              className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${
                request.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : request.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {request.status === "approved" ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : request.status === "rejected" ? (
                <XCircle className="w-3 h-3 mr-1" />
              ) : (
                <Clock className="w-3 h-3 mr-1" />
              )}
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </div>
          ),
        },
        { data: new Date(request.requested_on).toLocaleDateString() },
        { data: request.approved_by_name },

        { data: new Date(request.approval_date).toLocaleDateString() },
        {
          data: (
            <div className="flex flex-nowrap justify-center gap-2">
              {/* Show Edit button only for employee role (not HR or superadmin) */}
              {role !== "hr" && role !== "superadmin" && (
                <button
                  className="p-1 text-[var(--color-primary)] rounded hover:text-gray-500 dark:hover:text-gray-300"
                  onClick={() => handleEditLeave(request)}
                  title="Edit"
                >
                  <SquarePen size={18} />
                </button>
              )}

              {/* Show Delete button only for employee role (not HR or superadmin) */}
              {role !== "hr" && role !== "superadmin" && (
                <button
                  className="p-1 text-red-600 rounded hover:text-gray-500 dark:hover:text-gray-300"
                  onClick={() => handleDeleteBranch(branch.id)}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              )}

              {/* Show Approve button only for HR and superadmin roles */}
              {(role === "hr" || role === "superadmin") && (
                <button
                  className="p-1 text-amber-600 rounded hover:text-gray-500 dark:hover:text-gray-300"
                  onClick={() => handleApprovedLeave(request)}
                  title="Approve"
                >
                  <CircleCheckBig size={18} />
                </button>
              )}
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
              Leave Requests
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center text-white bg-[var(--color-primary)] hover-effect dark:bg-red-800 focus:outline-non font-medium text-sm rounded-sm px-5 py-2.5"
            >
              {!isMobile && "New Leave Req"} +
            </button>
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
              disabled={leaveRequests.length === 0}
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
              enableFilters={true}
  enableSorting={true}
// paginationLabel="leave requests"
            />
          </div>

          <div className="bottom-0 border-t border-gray-200 dark:border-gray-700 p-4">
            <CustomPagination
              total={totalItem}
              currentPage={currentPage}
              defaultPageSize={pageSize}
              onChange={handlePageChange}
              paginationLabel="leave requests"
              // isScroll={true}
            />
          </div>
        </div>
      </div>
      <Modal
        isVisible={showCreateModal}
        className="w-full md:w-[800px]"
        onClose={() => setShowCreateModal(false)}
        title="Create New Branch"
      >
        <CreateLeaveRequestForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
      <Modal
        isVisible={showEditModal}
        className="w-full md:w-[800px]"
        onClose={() => setShowEditModal(false)}
        title="Edit Branch"
      >
        <EditLeaveRequestForm
          leaveRequest={selectedLeave}
          onSuccess={handleEditSuccess}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
      <Modal
        isVisible={showApprovedModal}
        className="w-full md:w-[800px]"
        onClose={() => setShowApprovedModal(false)}
        title="Approved Leave Request"
      >
        <HRLeaveApprovalForm
          leaveRequest={selectedLeave}
          onSuccess={handleApprovedSuccess}
          onCancel={() => setShowApprovedModal(false)}
        />
      </Modal>
    </>
  );
};

export default LeaveRequestList;
