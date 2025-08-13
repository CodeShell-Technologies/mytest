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
import { BASE_URL, toastStyle } from "~/constants/api";
import toast, { Toaster } from "react-hot-toast";
import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
import { useAuthStore } from "src/stores/authStore";
import useBranchStore from "src/stores/useBranchStore";

import { Edit2, Eye, SquarePen, Trash2 } from "lucide-react";
import CreateSoftwareForm from "../systemSetting/CreateSoftwareForm";
import EditSoftwareForm from "../systemSetting/EditSoftwareForm";
import { useMediaQuery } from "~/routes/hooks/use-click-outside";
import CreateLanguageForm from "./CreateLanguageForm";
import EditLanguageForm from "./EditLanguageForm";
const Language = () => {

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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
  const token = useAuthStore((state) => state.accessToken);
  const branchCode = useAuthStore((state) => state.branchcode);

  const {
    branches,
    managerOptions,
    branchCodeOptions,
    fetchBranches,
    isLoading: isStoreLoading,
  } = useBranchStore();



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

  const getSoftware = async (
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

      let url = `${BASE_URL}/master/language/read?branchcode=${branchCode}&page=${page}&limit=${limit}`;

      if (search) url += `&search=${search}`;
      if (status) url += `&status=${status}`;
      if (manager) url += `&manager_id=${manager}`;
      if (branchCode) url += `&branchcode=${branchCode}`;
      if (sort) url += `&dec=${sort}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("responseeee", response);
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
    getSoftware();
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
    toast.success("Language added successfully!", toastStyle);
    fetchBranches(token);
    getSoftware();
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleEditBranch = (software) => {
    setSelectedBranch(software);
    setShowEditModal(true);
  };

  const handleDeleteBranch = (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  const handleDeleteSubmit = async () => {
    const id = Number(deleteId);

    try {
      setLoading(true);
      const response = await axios.delete(
        `${BASE_URL}/master/language/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.status === 201) {
        setShowDeleteModal(false);
        toast.success("Language deleted successfully!", toastStyle);
        fetchBranches(token);
        getSoftware();
      }
    } catch (error) {
      console.error("Error deleting software", error);
      toast.error("Failed to delete software");
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
    { data: "Branch Code" },
    { data: "Software Name" },

    { data: "Actions" },
  ];

  const tbody = () => {
    if (!data) return [];

    return data.map((software) => ({
      id: software.id,
      data: [
        { data: software.id },
        { data: software.branchcode },
        { data: software.name },

        // {
        //   data: (
        //     <div
        //       className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${software.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        //     >
        //       <span
        //         className={`w-2 h-2 rounded-full mr-2 ${software.status === "active" ? "bg-green-800" : "bg-red-700"}`}
        //       ></span>
        //       {software.status.charAt(0).toUpperCase() + software.status.slice(1)}
        //     </div>
        //   ),
        // },
        {
          data: (
            <div className="flex flex-wrap justify-center gap-5 -ml-15">
              <Link to={`/branch/${software.id}`}>
                <button
                  className="p-1 text-blue-700 rounded hover:text-gray-500 dark:hover:text-gray-300"
                  title="View"
                >
                  <Eye size={18} />
                </button>
              </Link>
              <button
                className="p-1 text-[var(--color-primary)] rounded hover:text-gray-500 dark:hover:text-gray-300"
                onClick={() => handleEditBranch(software)}
                title="Edit"
              >
                <SquarePen size={18} />
              </button>
              <button
                className="p-1 text-red-600 rounded hover:text-gray-500 dark:hover:text-gray-300"
                onClick={() => handleDeleteBranch(software.id)}
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
    toast.success("Language updated successfully!", toastStyle);
    fetchBranches(token);
    getSoftware();
  };

  const handleOnExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, "Software");
    XLSX.writeFile(wb, "SoftWareList.xlsx");
  };

  return (
    <>
      <div className="flex flex-col min-h-screen w-[850px]">
              <div className="flex flex-col">
                <div className="p-4 flex-grow">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)]">
                      Global Language Management
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
                  <Toaster position="top-center" reverseOrder={false} />

                  <div
                    className={`flex ${isMobile ? "flex-col" : "items-end justify-end"} gap-4 mb-5`}
                  >
                    <div
                      className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-4`}
                    >
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
                        {!isMobile && "New Language"} +
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
                        options={branchCodeOptions}
                        selectedValue={selectedBranchCode}
                        onSelect={handleBranchCodeChange}
                        placeholder="Branch Code"
                        className="w-full md:w-[200px]"
                        isLoading={isStoreLoading}
                      />

                      <button
                        onClick={toggleSortOrder}
                        className={`${isMobile ? "w-full" : "w-[200px]"} h-[40px] text-white bg-[var(--color-primary)] hover-effect px-2 py-1 rounded-sm`}
                      >
                        Sort {sortOrder === "desc" ? "↑" : "↓"}
                      </button>

                      <div
                        className={`${isMobile ? "w-full" : "w-[180px] mt-3"}`}
                      >
                        <SearchInput
                          value={searchTerm}
                          onChange={handleSearch}
                          placeholder="Search branches..."
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {loading && (
                    <div className="text-center py-4">Loading...</div>
                  )}
                  {error && (
                    <div className="text-red-500 text-center py-4">{error}</div>
                  )}

                  <div className="overflow-x-auto">
                    <DataTable
                      thead={thead}
                      tbody={tbody}
                      responsive={true}
                      className="min-w-[50%]"
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
                title="CREATE NEW LANGUAGE"
              >
                <CreateLanguageForm
                  onSuccess={handleCreateSuccess}
                  onCancel={() => setShowCreateModal(false)}
                />
              </Modal>

              <Modal
                isVisible={showEditModal}
                className="w-full md:w-[800px]"
                onClose={() => setShowEditModal(false)}
                title="EDIT SOFTWARE"
              >
                <EditLanguageForm
                  branch={selectedBranch}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setShowEditModal(false)}
                />
              </Modal>

              <Modal
                isVisible={showDeleteModal}
                className="w-full md:w-[600px]"
                onClose={() => setShowDeleteModal(false)}
                title="DELETE LANGUAGE"
              >
                <div className="flex flex-col gap-6 justify-center items-center">
                  <p className="text-gray-500 text-lg font-bold text-center">
                    Are you sure you want to delete this Language?
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
                </div>
              </Modal>
       </div>

    </>
  );
};
export default Language;
