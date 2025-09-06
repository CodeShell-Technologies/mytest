
import { useEffect, useState } from "react";
import DataTable from "src/component/DataTable";
import CustomPagination from "src/component/CustomPagination";
import SearchInput from "src/component/SearchInput";
import Modal from "src/component/Modal";
import Dropdown from "src/component/DrapDown";
import { AlertTriangle, Calendar, FileDown, Hash, UserX } from "lucide-react";
import * as XLSX from "xlsx";
import { Link } from "react-router";
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
import AddNewCampaignForm from "./AddNewCampaignForm";
import EditCampaignForm from "./EditCampaignForm";

const Campaign = () => {
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
  const [deleteData, setDeleteData] = useState();
  const [sortOrder, setSortOrder] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [pageSize, setPageSize] = useState(8);
  const [showFilters, setShowFilters] = useState(false);
  const token = useAuthStore((state) => state.accessToken);
  const [formData, setFormData] = useState({ status: "active" });

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

  const getCampaign = async (
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
      let url = `${BASE_URL}/campaign/overview/read?page=${page}&limit=${limit}`;

      if (search) url += `&search=${search}`;
      if (status) url += `&status=${status}`;
      if (manager) url += `&manager_id=${manager}`;
      if (branchCode) url += `&branchcode=${branchCode}`;
      if (sort) url += `&dec=${sort}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("campaigndataaa", response);
      setSheetData(response?.data?.data);
      setTotalItem(response?.data?.length || 0);
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching branch list", error);
      setError("Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCampaign();
  }, [
    currentPage,
    searchTerm,
    selectStatus,
    selectedManager,
    selectedBranchCode,
    sortOrder,
    pageSize,
  ]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    toast.success("Camapign added successfully!");
    fetchBranches(token);
    getCampaign();
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleEditBranch = (campaign) => {
    setSelectedBranch(campaign);
    setShowEditModal(true);
  };

  const handleDeleteBranch = (branch) => {
    setShowDeleteModal(true);
    setDeleteData(branch);
  };

const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };


  // Upload Excel handler
const handleUpload = async () => {
    if (!file) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("file", file); // 👈 Must match multer.single("file")

    try {
      const res = await axios.post("http://localhost:5000/api/campaignimport", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // if using auth
        },
      });
      console.log("Upload success:", res.data);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };





  const handleDeleteSubmit = async () => {
    const deleteDatas = {
      data: {
        branchcode: deleteData.branchcode,
        campaign_code: deleteData.campaign_code,
        status: formData.status,
      },
    };
    console.log("delteddataforcvampaign", deleteDatas);
    try {
      setLoading(true);
      const response = await axios.delete(
        `${BASE_URL}/campaign/overview/delete`,
        {
          data: deleteDatas,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("responsefordeelte", response);
      if (response?.status === 201) {
        setShowDeleteModal(false);
        toast.success("Campaign deleted successfully!");
        fetchBranches(token);
        getCampaign();
      }
    } catch (error) {
      console.error("Error deleting branch", error);
      toast.error("Failed to delete branch");
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

  const thead = () => [
    { data: "id" },
    { data: "Campaign Code" },
    { data: "Branch Code" },
    { data: "Campaign Name" },
    { data: "Camapign Type" },
    { data: "Started Date" },
    { data: "End Date" },
    { data: "Lead" },
    { data: "Goal Lead" },
    { data: "Conversion Rate" },
    { data: "Status" },
    { data: "Actions", className: "text-center" },
  ];

  const tbody = () => {
    if (!data) return [];

    return data.map((branch, index) => ({
      id: branch.id,
      data: [
        { data: index + 1 },
        { data: branch.campaign_code },
        { data: branch.branchcode },
        { data: branch.campaignname },
        { data: branch.campaigntype },
        { data: branch.startdate },
        { data: branch.enddate },
        { data: branch.lead },
        { data: branch.goallead },
        { data: branch.conversationrate },


        {
          data: (
            <div
              className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${branch.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${branch.status === "active" ? "bg-green-800" : "bg-red-700"}`}
              ></span>
              {branch.status.charAt(0).toUpperCase() + branch.status.slice(1)}
            </div>
          ),
        },
        {
          data: (
            <div className="flex justify-center gap-2">
              <Link to={`/campaignview/${encodeURIComponent(branch.campaign_code)}`}>
                <button
                  className="p-1 text-blue-700 rounded hover:text-gray-500 dark:hover:text-gray-300"
                  title="View"
                >
                  <Eye size={18} />
                </button>
              </Link>
              <button
                className="p-1 text-[var(--color-primary)] rounded hover:text-gray-500 dark:hover:text-gray-300"
                onClick={() => handleEditBranch(branch)}
                title="Edit"
              >
                <SquarePen size={18} />
              </button>
              <button
                className="p-1 text-red-600 rounded hover:text-gray-500 dark:hover:text-gray-300"
                onClick={() => handleDeleteBranch(branch)}
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ),
          className: "action-cell",
        },
      ],
    }));
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    toast.success("Branch updated successfully!");
    fetchBranches(token);
    getCampaign();
  };

  const handleOnExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, "Branches");
    XLSX.writeFile(wb, "CampaignList.xlsx");
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)]">
             Campaign Management
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
              <label className="flex items-center justify-center text-gray-400 bg-white font-medium text-sm rounded-sm border border-dotted border-gray-400 hover:text-green-700/70 px-3 py-2.5 cursor-pointer">
  <input
    type="file"
    accept=".xlsx, .xls"
    onChange={handleFileChange}   // ✅ use handleFileChange
    className="hidden"
  />
  <CgExport className="mr-1" />
  {!isMobile && "Upload Excel"}
</label>

<button
  onClick={handleUpload}  // ✅ trigger upload separately
  className="flex items-center justify-center text-gray-400 bg-white focus:outline-non font-medium text-sm rounded-sm border border-dotted border-gray-400 hover:text-green-700/70 px-3 dark:bg-gray-800 dark:text-gray-300 py-2.5"
>
  Upload
</button>


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
                {!isMobile && "New Camapign"} +
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
                placeholder="Select Campaign Status"
                className="w-full md:w-[200px]"
              />

              <Dropdown
                options={branchCodeOptions}
                selectedValue={selectedBranchCode}
                onSelect={handleBranchCodeChange}
                placeholder="Select Branch Code"
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
        title="Create New Campaign"
          closeOnOutsideClick={false}

      >
        <AddNewCampaignForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      <Modal
        isVisible={showEditModal}
        className="w-full md:w-[800px]"
        onClose={() => setShowEditModal(false)}
        title="Edit Campaign"
          closeOnOutsideClick={false}

      >
        <EditCampaignForm
          campaign={selectedBranch}
          onSuccess={handleEditSuccess}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      <Modal
        isVisible={showDeleteModal}
        className="w-full md:w-[600px]"
        onClose={() => setShowDeleteModal(false)}
        title="Delete Campaign"
          closeOnOutsideClick={false}

      >
        <Modal
          isVisible={showDeleteModal}
          className="w-full md:w-[600px]"
          onClose={() => setShowDeleteModal(false)}
          title="Inactive Campaign"
        >
       
          <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
                <AlertTriangle className="inline mr-2" /> Inactive Campaign
              </h3>

              <p className="text-gray-500 text-sm font-medium text-center">
                Are you sure you want to inactivate this{" "}
             Campaign?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              
                <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <UserX className="inline mr-1" size={14} /> Status
                  </p>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </Modal>
      </Modal>
    </>
  );
};

export default Campaign;
