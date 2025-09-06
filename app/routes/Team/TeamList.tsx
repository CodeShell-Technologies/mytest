import { useEffect, useState, useMemo } from "react";
import DataTable from "src/component/DataTable";
import CustomPagination from "src/component/CustomPagination";
import SearchInput from "src/component/SearchInput";
import Modal from "src/component/Modal";
import Dropdown from "src/component/DrapDown";
import { FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { BASE_URL, toastposition } from "~/constants/api";
import CreateBranchForm from "../Branch/CreateBranchForm";
import toast, { Toaster } from "react-hot-toast";
import EditBranchForm from "../Branch/EditFormData";
import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
import { useAuthStore } from "src/stores/authStore";
import useBranchStore from "../../../src/stores/useBranchStore";
import { CgExport } from "react-icons/cg";
import { Edit2, Eye, SquarePen, Trash2 } from "lucide-react";
import { useMediaQuery } from "../hooks/use-click-outside";
import CreateTeamForm from "./CreateTeamForm";
import EditTeamForm from "./EditTeamForm";

const TeamList = () => {
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
  const [deleteTeamId, setDeleteTeamId] = useState("");
  const [deleteBranchcode,setDeleteBranchcode]=useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [pageSize, setPageSize] = useState(8);
  const [showFilters, setShowFilters] = useState(false);
  const navigate=useNavigate()
  const token = useAuthStore((state) => state.accessToken);
  const {
    branches,
    managerOptions,
    branchCodeOptions,
    fetchBranches,
    isLoading: isStoreLoading,
  } = useBranchStore();

  const statusOptions = [
    { value: "", label: "All Branches" },
    { value: "active", label: "Active Branches" },
    { value: "inactive", label: "Inactive Branches" },
  ];

  const pageSizeOptions = [
    { value: 20, label: "20 per page" },
    { value: 40, label: "30 per page" },
    { value: 50, label: "40 per page" },
    { value: 80, label: "50 per page" },
    { value: 100, label: "100 per page" },
    { value: 200, label: "100 per page" },
  ];

  useEffect(() => {
    fetchBranches(token);
  }, [token]);

  const getBranch = async (
    page = currentPage,
    limit = pageSize,
    search = searchTerm,
    status = selectStatus,
    manager = selectedManager,
    branchCode = selectedBranchCode,
    sort = sortOrder
  ) => {
    setLoading(true);
    try {
      let url = `${BASE_URL}/teams/read?page=${page}&limit=${limit}`;

      if (search) url += `&search=${search}`;
      if (status) url += `&status=${status}`;
      if (manager) url += `&manager_id=${manager}`;
      if (branchCode) url += `&branchcode=${branchCode}`;
      if (sort) url += `&dec=${sort}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("responseeeforteam>>>>>>", response);
      setSheetData(response?.data?.data);
      setTotalItem(response?.data?.data?.totalDocuments || 0);
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching branch list", error);
      setError("Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBranch();
  }, [
    currentPage,
    searchTerm,
    selectStatus,
    selectedManager,
    selectedBranchCode,
    sortOrder,
    pageSize,
  ]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    toast.success("Team added successfully!");
    fetchBranches(token);
    getBranch();
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleEditBranch = (team) => {
    setSelectedBranch(team);
    setShowEditModal(true);
  };

  const handleDeleteBranch = (team) => {
    setShowDeleteModal(true);
    setDeleteTeamId(team.team_id);
    setDeleteBranchcode(team.branchcode)
  };

  const handleDeleteSubmit = async () => {
  
const deleteTeamData={
  userData:{
    team_id:deleteTeamId,
    branchcode:deleteBranchcode
  }
}
console.log("deletedcodeformdata",deleteTeamData)
    try {
      setLoading(true);
      const response = await axios.delete(`${BASE_URL}/teams/delete`, {
       data: deleteTeamData,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response?.status === 201) {
        setShowDeleteModal(false);
        toast.success("Team deleted successfully!");
        fetchBranches(token);
        getBranch();
      }
    } catch (error) {
      console.error("Error deleting team", error);
      toast.error("Failed to delete team");
    } finally {
      setLoading(false);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "" : "desc"));
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setSelectStatus(value);
    setCurrentPage(1);
  };

  const handleManagerChange = (value) => {
    setSelectedManager(value);
    setCurrentPage(1);
  };

  const handleBranchCodeChange = (value) => {
    setSelectedBranchCode(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };
  const handleView=(id)=>{
    console.log("editprofileidd",id)
    alert("navigateactive")
    navigate(`/teamview/${encodeURIComponent(id)}`)
  }



// const navigate = useNavigate();

  // --- Sorting & Filtering State ---
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [columnFilters, setColumnFilters] = useState({});

  // --- Columns ---
  const columns = [
    { key: "team_id", label: "Team Id" },
    { key: "team_name", label: "Team Name" },
    { key: "team_lead", label: "Team Lead Id" },
    { key: "branchcode", label: "Branch Code" },
    { key: "created_on", label: "Created Date" },
    { key: "actions", label: "Actions", sortable: false, filterable: false, className: "text-center" },
  ];

  // --- Sorting handler ---
  const handleSort = (key) => {
    if (sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  // --- Filter handler ---
  const handleFilterChange = (key, value) => {
    setColumnFilters((prev) => ({ ...prev, [key]: value }));
  };

  // --- Filtered & Sorted Data ---
  const processedData = useMemo(() => {
    if (!data) return [];

    let filtered = data.filter((team) =>
      columns.every((col) => {
        if (col.filterable === false || !columnFilters[col.key]) return true;

        let value = team[col.key] ?? "";
        return value.toString().toLowerCase().includes(columnFilters[col.key].toLowerCase());
      })
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let valA = a[sortConfig.key] ?? "";
        let valB = b[sortConfig.key] ?? "";

        if (sortConfig.key === "created_on") {
          valA = new Date(valA);
          valB = new Date(valB);
        }

        if (typeof valA === "number" && typeof valB === "number") {
          return sortConfig.direction === "asc" ? valA - valB : valB - valA;
        } else {
          return sortConfig.direction === "asc"
            ? valA.toString().localeCompare(valB.toString())
            : valB.toString().localeCompare(valA.toString());
        }
      });
    }

    return filtered;
  }, [data, columnFilters, sortConfig]);

  // --- Render Table Head ---
  const thead = () =>
    columns.map((col) => ({
      data: (
        <div className="flex flex-col">
          <span
            className={`cursor-pointer ${col.className || ""}`}
            onClick={() => col.sortable !== false && handleSort(col.key)}
          >
            {col.label}
            {sortConfig.key === col.key &&
              (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
          </span>
          {col.filterable !== false && (
            <input
              type="text"
              placeholder={`Search ${col.label}`}
              value={columnFilters[col.key] || ""}
              onChange={(e) => handleFilterChange(col.key, e.target.value)}
              className="w-full text-xs border rounded px-1 py-0.5 mt-1"
            />
          )}
        </div>
      ),
      className: col.className,
    }));

  // --- Render Table Body ---
  const tbody = () => {
    if (!processedData) return [];

    return processedData.map((team) => ({
      data: [
        { data: team.team_id },
        { data: team.team_name },
        { data: team.team_lead },
        { data: team.branchcode },
        { data: new Date(team.created_on).toISOString().split("T")[0] },
        {
          data: (
            <div className="flex flex-wrap justify-center gap-2">
              <button
                className="p-1 text-blue-700"
                title="View"
                onClick={() => handleView(team.team_id)}
              >
                <Eye size={18} />
              </button>
              <button
                className="p-1 text-blue-700"
                onClick={() => handleEditBranch(team)}
                title="Edit"
              >
                <SquarePen size={18} />
              </button>
              <button
                className="p-1 text-red-600"
                onClick={() => handleDeleteBranch(team)}
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ),
          className: "action-cell",
        },
      ].map((col, idx) => ({
        ...col,
        data:
          idx === 5 ? (
            col.data
          ) : (
            <div
              onDoubleClick={() => navigate(`/teamview/${encodeURIComponent(team.team_id)}`)}
              className="w-full h-full cursor-pointer"
            >
              {col.data}
            </div>
          ),
      })),
    }));
  };




  // const thead = () => [
  //   { data: "Team Id" },
  //   { data: "Team Name" },
  //   { data: "Team Lead Id" },
  //   { data: "Branch Code" },
  //   { data: "Created Date" },
  //   { data: "Actions", className: "text-center" },
  // ];

  // const tbody = () => {
  //   if (!data) return [];

  //   return data.map((team) => ({
  //     id: team.id,
  //     data: [
  //       { data: team.team_id },
  //       { data: team.team_name },
  //       { data: team.team_lead },
  //       { data: team.branchcode },
  //       {data:new Date(team.created_on).toISOString().split('T')[0]},
  
  //       // {
  //       //   data: (
  //       //     <div
  //       //       className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${team.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
  //       //     >
  //       //       <span
  //       //         className={`w-2 h-2 rounded-full mr-2 ${team.status === "active" ? "bg-green-800" : "bg-red-700"}`}
  //       //       ></span>
  //       //       {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
  //       //     </div>
  //       //   ),employee
  //       // },
  //       {
  //         data: (
  //           <div className="flex flex-wrap justify-center gap-2">
            
  //               <button
  //                 className="p-1 text-blue-700 rounded hover:text-gray-500 dark:hover:text-gray-300"
  //                 title="View"
  //                 onClick={()=>handleView(team.team_id)}
  //               >
  //                 <Eye size={18} />
  //               </button>
   
            
  //             <button
  //               className="p-1 text-[var(--color-primary)] rounded hover:text-gray-500 dark:hover:text-gray-300"
  //               onClick={() => handleEditBranch(team)}
  //               title="Edit"
  //             >
  //               <SquarePen size={18} />
  //             </button>
  //             <button
  //               className="p-1 text-red-600 rounded hover:text-gray-500 dark:hover:text-gray-300"
  //               onClick={() => handleDeleteBranch(team)}
  //               title="Delete"
  //             >
  //               <Trash2 size={18} />
  //             </button>
  //           </div>
  //         ),
  //         className: "action-cell",
  //       },
  //     ],
  //   }));
  // };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    toast.success("Team updated successfully!");
    fetchBranches(token);
    getBranch();
  };

  const handleOnExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, "Branches");
    XLSX.writeFile(wb, "BranchList.xlsx");
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)]">
              Team Management
            </h2>
            {isMobile && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 bg-gray-200 rounded-md"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            )}
          </div>
          <Toaster position={toastposition} reverseOrder={false} />

          <div
            className={`flex ${isMobile ? "flex-col" : "items-end justify-end"} gap-4 mb-5`}
          >
            <div className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-4`}>
              <Dropdown
                options={pageSizeOptions}
                selectedValue={pageSize}
                onSelect={handlePageSizeChange}
                placeholder="Items per page"
                className="w-full md:w-[150px]"
              />
              <button
                onClick={handleOnExport}
                className="flex items-center justify-center text-gray-400 bg-white focus:outline-non font-medium text-sm rounded-sm border border-dotted border-gray-400 hover:text-red-700/70 px-3 dark:bg-gray-800 dark:text-gray-300 py-2.5"
              >
                <FileDown className="mr-1" />
                {!isMobile && "Export Excel"}
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center text-white bg-[var(--color-primary)] hover-effect dark:bg-red-800 focus:outline-non font-medium text-sm rounded-sm px-5 py-2.5"
              >
                {!isMobile && "New Team"} +
              </button>
            </div>
          </div>

          <div
            className={`${isMobile && !showFilters ? "hidden" : "block"} mb-4`}
          >
            <div
              className={`${isMobile ? "grid grid-cols-1 gap-3" : "flex flex-wrap justify-between items-center gap-3"}`}
            >
              <Dropdown
                options={statusOptions}
                selectedValue={selectStatus}
                onSelect={handleStatusChange}
                placeholder="Branch Status"
                className="w-full md:w-[200px]"
              />

              <Dropdown
                options={branchCodeOptions}
                selectedValue={selectedBranchCode}
                onSelect={handleBranchCodeChange}
                placeholder="Branch Code"
                className="w-full md:w-[200px]"
                isLoading={isStoreLoading}
              />

              <Dropdown
                options={managerOptions}
                selectedValue={selectedManager}
                onSelect={handleManagerChange}
                placeholder="Manager"
                className="w-full md:w-[200px]"
                isLoading={isStoreLoading}
              />

              <button
                onClick={toggleSortOrder}
                className={`${isMobile ? "w-full" : "w-[200px]"} h-[40px] text-white bg-[var(--color-primary)] hover-effect px-2 py-1 rounded-sm`}
              >
                Sort {sortOrder === "desc" ? "↑" : "↓"}
              </button>

              <div className={`${isMobile ? "w-full" : "w-[200px] mt-3"}`}>
                <SearchInput
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search branches..."
                  className="w-full"
                />
              </div>
            </div>
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
        </div>

        <div className="bottom-0 border-t border-gray-200 dark:border-gray-700 p-4">
          <CustomPagination
            total={totalItem}
            currentPage={currentPage}
            defaultPageSize={pageSize}
            onChange={handlePageChange}
            paginationLabel="branches"
            isScroll={true}
          />
        </div>
      </div>

      <Modal
        isVisible={showCreateModal}
        className="w-full md:w-[800px]"
        onClose={() => setShowCreateModal(false)}
        title="Create New Team"
      >
        <CreateTeamForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      <Modal
        isVisible={showEditModal}
        className="w-full md:w-[800px]"
        onClose={() => setShowEditModal(false)}
        title="Edit Team"
      >
        <EditTeamForm
          branch={selectedBranch}
          onSuccess={handleEditSuccess}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      <Modal
        isVisible={showDeleteModal}
        className="w-full md:w-[600px]"
        onClose={() => setShowDeleteModal(false)}
        title="Delete Team"
      >
        {/* <div className="flex flex-col gap-6 justify-center items-center">
          <p className="text-gray-500 text-lg font-bold text-center">
            Are you sure you want to delete this team?
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
              onClick={handleDeleteSubmit}
            >
              {loading ? <ButtonLoader /> : "Confirm"}
            </button>
          </div>
        </div> */}
        <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
  <div className="text-center">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
      Confirm Deletion
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mt-2">
      Are you sure you want to delete this team? This action cannot be undone.
    </p>
  </div>

  <div className="flex justify-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
    <button
      type="button"
      className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors duration-200 font-medium text-sm"
      onClick={() => setShowDeleteModal(false)}
      disabled={loading}
    >
      Cancel
    </button>
    <button
      type="button"
      className="px-5 py-2 bg-red-700 hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-md transition-colors duration-200 font-medium text-sm shadow-sm"
      onClick={handleDeleteSubmit}
      disabled={loading}
    >
      {loading ? <ButtonLoader /> : "Delete Team"}
    </button>
  </div>
</div>
      </Modal>
    </>
  );
};

export default TeamList;
