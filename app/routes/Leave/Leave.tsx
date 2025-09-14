import { useEffect, useState } from "react";
import DataTable from "src/component/DataTable";
import CustomPagination from "src/component/CustomPagination";
import SearchInput from "src/component/SearchInput";
import Modal from "src/component/Modal";
import Dropdown from "src/component/DrapDown";
import { FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import { Link } from "react-router";
import axios from "axios";
import { BASE_URL } from "~/constants/api";
import toast, { Toaster } from "react-hot-toast";
import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
import { useAuthStore } from "src/stores/authStore";
import useBranchStore from "../../../src/stores/useBranchStore";
import { CgExport } from "react-icons/cg";
import { Edit2, Eye, SquarePen, Trash2 } from "lucide-react";
import { useMediaQuery } from "../hooks/use-click-outside";
import LeaveRequest from "./LeaveRequestList";
import LeaveTypes from "./LeaveTypes";
import AddNewLeaveType from "./CreateLeaveRequestForm";
import UpdateLeaveReq from "./EditLeaveRequestForm";
import LeaveTy from "../settings/leave/LeaveTy";
import LeaveRequestList from "./LeaveRequestList";

const Leave = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [sheetData, setSheetData] = useState([]);
  const [selectStatus, setSelectStatus] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [pageSize, setPageSize] = useState(8);
  const [showFilters, setShowFilters] = useState(false);
  const accesstoken = useAuthStore((state) => state.accessToken);
  const [activeTab, setActiveTab] = useState("leavereq");
 
  ;

  const [roleAccess, setRoleAccess] = useState(null); // ✅ define here

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


const permissions = useAuthStore((state) => state.permissions);
const userRole = permissions?.[0]?.role || null;

const token = accesstoken;  


    useEffect(() => {
      if (hydrated && token &&userRole) {
  fetch(`${BASE_URL}/get-roleaccessdetail/${userRole}`)
    .then(res => res.json())
    .then(data => {
      if (data.status) {
        setRoleAccess(data.access);
      }
    });
  }
}, [hydrated,token,userRole]);

console.log("RoleAccess:", roleAccess);

roleAccess?.leaveapproved?.all
  // Tab configuration
  // const tabs = [
  //   { id: "leavereq", label: "Leave Request" },
  //   { id: "leavetype", label: "Leave Types" },
  // ];

  const tabs = roleAccess?.leaveapproved?.all
  ? [
      { id: "leavereq", label: "Leave Request" },
      { id: "leavetype", label: "Leave Types" },
    ]
  : [
      { id: "leavereq", label: "Leave Request" }
    ];





  return (
    <div className="flex flex-col min-h-screen">
      <div className="  dark:border-gray-700  ">
        <nav className="flex justify-evenly -mb-px">
          {tabs.map((tab, index) => (
            <>
              {index > 0 && (
                <span className="bg-gray-300 dark:bg-red-700 w-[50px] h-[2px] mt-5 items-center"></span>
              )}
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={` font-medium text-sm  ${
                  activeTab === tab.id
                    ? " text-gray-200 dark:bg-gray-800 dark:text-red-800 hover:border-gray-300 bg-red-700 w-[120px] h-[40px] rounded-sm "
                    : "border-transparent text-gray-700 hover:text-red-700 dark:bg-gray-600 dark:text-gray-100 hover:border-gray-300 bg-gray-200 w-[120px] h-[40px] rounded-sm "
                }`}
              >
                {tab.label}
              </button>
            </>
          ))}
        </nav>
      </div>
      {/* <div className="relative">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex justify-center relative">
            <div className="flex border-b border-gray-200 w-full">
              {tabs.map((tab, index) => (
                <div key={tab.id} className="relative flex">
                  {index > 0 && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-6 w-px bg-red-800"></div>
                  )}
                  
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'text-red-600 border-b-2 border-red-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div> */}

      <div className="p-4 flex-grow">
        {activeTab === "leavereq" && (
       <LeaveRequestList/>
        )}

        {activeTab === "leavetype" && (
          <div>
            <LeaveTypes />
          </div>
        )}

        {activeTab === "report" && <div>termination Content Goes Here</div>}
      </div>
        <Modal
        isVisible={showEditModal}
        className="w-full md:w-[800px]"
        onClose={() => setShowEditModal(false)}
        title="Update Leave Request"
      >
        <UpdateLeaveReq
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
      
      <Modal
        isVisible={showDeleteModal}
        className="w-full md:w-[600px]"
        onClose={() => setShowDeleteModal(false)}
        title="Delete Branch"
      >
        <div className="flex flex-col gap-6 justify-center items-center">
          <p className="text-gray-500 text-lg font-bold text-center">
            Are you sure you want to delete this Leave Details?
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              type="button"
              className="px-4 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-hover-secondary)] text-gray-800 hover-effect dark:text-gray-700 rounded dark:hover:bg-gray-500 transition"
              disabled={loading}
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-hover)] hover-effect transition"
              disabled={loading}
              // onClick={handleDeleteSubmit}
            >
              {loading ? <ButtonLoader /> : "Confirm"}
            </button>
          </div>
        </div>
      </Modal>
    </div>

  );
};

export default Leave;
