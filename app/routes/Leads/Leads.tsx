import { useEffect, useState } from "react";
import DataTable from "src/component/DataTable";
import CustomPagination from "src/component/CustomPagination";
import SearchInput from "src/component/SearchInput";
import Modal from "src/component/Modal";
import Dropdown from "src/component/DrapDown";
import { FileDown, GitBranchIcon, GitBranchPlus } from "lucide-react";
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
import useLeadsStore from "src/stores/LeadsStore";
import AddNewLeadForm from "./AddNewLead";
import EditLeadForm from "./EditLeadsForm";
import LeadClientForm from "../Clients/LeadClientForm";
import { useNavigate } from "react-router-dom";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Leads = () => {
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
  const [showConvertClientModal, setShowConvertClientModal] = useState(false);
  const [deleteLead, setDeleteLead] = useState();
  const [sortOrder, setSortOrder] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [pageSize, setPageSize] = useState(8);
  const [showFilters, setShowFilters] = useState(false);
  const accesstoken = useAuthStore((state) => state.accessToken);
  const { fetchLeads, isStoreLoading } = useLeadsStore();
  const branchCodeOptions = useBranchStore((state) => state.branchCodeOptions);
  const branchcode = useAuthStore((state) => state.branchcode);
  const [filters, setFilters] = useState({});
const [sortConfig, setSortConfig] = useState(null);

       const [hydrated, setHydrated] = useState(false);

 const navigate = useNavigate();

  const statusOptions = [
    { value: "", label: "All Branches" },
    { value: "active", label: "Active Branches" },
    { value: "inactive", label: "Inactive Branches" },
  ];




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


const token = accesstoken;



useEffect(() => {
  if (hydrated && token) {
    fetchLeads(token, branchcode);
  }
}, [hydrated, token,branchcode]);


  // useEffect(() => {
  //   fetchLeads(token, branchcode);
  // }, [token, branchcode]);



  const pageSizeOptions = [
    { value: 20, label: "20 per page" },
    { value: 40, label: "30 per page" },
    { value: 50, label: "40 per page" },
    { value: 80, label: "50 per page" },
    { value: 100, label: "100 per page" },
    { value: 200, label: "100 per page" },
  ];

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
      let url = `${BASE_URL}/campaign/leads/read?page=${page}&limit=${limit}`;

      if (search) url += `&search=${search}`;
      if (status) url += `&status=${status}`;
      if (manager) url += `&manager_id=${manager}`;
      if (branchCode) url += `&branchcode=${branchCode}`;
      if (sort) url += `&dec=${sort}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("responselead", response);
      setSheetData(response?.data?.data);
      setTotalItem(response?.data?.data?.length || 0);
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching branch list", error);
      setError("Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
       if (hydrated && token) {
    getBranch();
  }
  }, [
     hydrated,
    token,
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
    toast.success("Lead created successfully!");
    fetchLeads(token);
    getBranch();
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleEditBranch = (branch) => {
    console.log("branchleaddetailsfor edit", branch);
    setSelectedBranch(branch);
    setShowEditModal(true);
  };
const handleConvertLead=(branch)=>{
    setSelectedBranch(branch);
    setShowConvertClientModal(true);
}
  const handleDeleteBranch = (lead) => {
    setShowDeleteModal(true);
    setDeleteLead(lead);
  };

  const handleDeleteSubmit = async () => {
    console.log("de;etedleadin submit", deleteLead);
    const id = Number(deleteLead.id);
    const payload = {
      data: {
        branchcode: deleteLead.branchcode,
        campaign_code: deleteLead.campaign_code,
      },
    };

    try {
      setLoading(true);
      const response = await axios.delete(
        `${BASE_URL}/campaign/leads/delete/${id}`,
        {
          data: payload,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.status === 201) {
        setShowDeleteModal(false);
        toast.success("Lead deleted successfully!");
        fetchLeads(token);
        getBranch();
      }
    } catch (error) {
      console.error("Error deleting Lead", error);
      toast.error("Failed to delete Lead");
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
    { data: "Lead Code" },
    { data: "Lead Name" },
    { data: "Phone" },
    { data: "Email" },
    { data: "assignee_id" },
    { data: "comm_type" },
    { data: "proj_type" },
    { data: "summary" },
    { data: "Status" },
    { data: "Actions", className: "text-center" },
  ];

  const tbody = () => {
    if (!data) return [];

    return data.map((branch) => ({
      id: branch.id,
      data: [
        { data: branch.id },
        { data: branch.branchcode },

        { data: branch.lead_date },
        { data: branch.lead_name },
        { data: branch.phone },
        { data: branch.email },
        { data: branch.assignee_id },
        { data: branch.comm_type },
        { data: branch.proj_type },
        { data: branch.summary },

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
              <button
                className="p-1 text-amber-600 rounded hover:text-gray-500 dark:hover:text-gray-300"
                onClick={() => handleConvertLead(branch)}
                title="Convert"
              >
                <GitBranchPlus size={18} />
              </button>
              <Link to={`/leadsview/${branch.id}`}>
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
    toast.success("Lead updated successfully!");
    fetchLeads(token);
    getBranch();
  };
const handleConvertSuccess=()=>{
      setShowEditModal(false);
    toast.success("Lead to Client converted successfully!");
    fetchLeads(token);
    getBranch();
}
  const handleOnExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, "Branches");
    XLSX.writeFile(wb, "LeadList.xlsx");
  };

    // ✅ Export Leads List as Excel
const handleOnExportLeads = () => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(sheetData); // <-- your leads data array
  XLSX.utils.book_append_sheet(wb, ws, "Leads");
  XLSX.writeFile(wb, "LeadList.xlsx");
};

// ✅ Export Leads List as PDF
const handleOnExportPDF = () => {
  const doc = new jsPDF("landscape");

  doc.setFontSize(14);
  doc.text("Leads List (Summary)", 14, 10);

  if (sheetData.length > 0) {
    // Pick only important columns for PDF summary
    const importantCols = [
      "id",
      "branchcode",
      "campaign_code",
      "lead_date",
      "lead_name",
      "phone",
      "email",
      "assignee_id",
      "comm_type",
      "proj_type",
      "status",
      "created_on",
      "updated_on",
    ];

    const columns = importantCols.map((key) => ({
      header: key,
      dataKey: key,
    }));

    autoTable(doc, {
      columns,
      body: sheetData, // <-- your leads table data
      startY: 20,
      styles: { fontSize: 8, cellPadding: 2, overflow: "linebreak" },
      headStyles: { fillColor: [22, 160, 133], fontSize: 9, halign: "center" },
      theme: "grid",
      tableWidth: "auto",
    });
  }

  doc.save("LeadList.pdf");
};

// ✅ Download Excel Template for Leads
const handleDownloadTemplate = () => {
  const headers = [
    "id",
    "branchcode",
    "campaign_code",
    "lead_date",
    "lead_name",
    "phone",
    "email",
    "assignee_id",
    "comm_type",
    "proj_type",
    "status",
    "summary",
    "created_on",
    "updated_on",
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers]); // Only headers row
  XLSX.utils.book_append_sheet(wb, ws, "LeadTemplate");

  XLSX.writeFile(wb, "LeadTemplate.xlsx");
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
      const res = await axios.post(`${BASE_URL}/leadimport`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // if using auth
        },
      });
      console.log("Upload success:", res.data);
      alert ("Leads list imported successfully!")
      navigate("/leads");
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };






  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)]">
              Lead Management
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
                onClick={handleDownloadTemplate }
                className="flex items-center justify-center text-gray-400 bg-white focus:outline-non font-medium text-sm rounded-sm border border-dotted border-gray-400 hover:text-red-700/70 px-3 dark:bg-gray-800 dark:text-gray-300 py-2.5"
              >
                <FileDown className="mr-1" />
                {!isMobile && "Download Template"}
              </button>





<div className="flex flex-col items-start">  {/* 👈 changed to items-start */}
    <label className="flex items-center justify-center text-gray-400 bg-white font-medium text-sm rounded-sm border border-dotted border-gray-400 hover:text-green-700/70 px-3 py-2.5 cursor-pointer">
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="hidden"
      />
      <CgExport className="mr-1" />
      Upload Excel
    </label>


  </div>

    {/* ✅ left-aligned filename */}
    {file && (
      <span
        className="text-xs text-green-500 mt-1 max-w-[140px] truncate"
        title={file.name}
      >
        {file.name}
      </span>
    )}
  {/* Upload button */}


  <button
    onClick={handleUpload}
    className="flex items-center justify-center text-gray-400 bg-white font-medium text-sm rounded-sm border border-dotted border-gray-400 hover:text-green-700/70 px-3 py-2.5"
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
                onClick={handleOnExportPDF}
                className="flex items-center justify-center text-gray-400 bg-white focus:outline-non font-medium text-sm rounded-sm border border-dotted border-gray-400 hover:text-red-700/70 px-3 dark:bg-gray-800 dark:text-gray-300 py-2.5"
              >
                <FileDown className="mr-1" />
                {!isMobile && "Export PDF"}
              </button>

                <button
                onClick={() => navigate("/leadscovert")}
                className="flex items-center justify-center text-white bg-[var(--color-primary)] hover-effect dark:bg-red-800 focus:outline-non font-medium text-sm rounded-sm px-5 py-2.5"
              >
                {!isMobile && "Lead Convertion"} 
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center text-white bg-[var(--color-primary)] hover-effect dark:bg-red-800 focus:outline-non font-medium text-sm rounded-sm px-5 py-2.5"
              >
                {!isMobile && "New Lead"} +
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
          {/*  <DataTable
              thead={thead}
              tbody={tbody}
              responsive={true}
              className="min-w-full"
              enableFilters={true}
  enableSorting={true}
  onRowDoubleClick={(row) => {

    navigate(`/leadsview/${row.id}`);
  }}
            />*/}

    <DataTable
  thead={thead}
  tbody={tbody}
  className="min-w-full"
  enableFilters={true}
  enableSorting={true}
  onRowDoubleClick={(row) => navigate(`/leadsview/${row.id}`)}
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
        title="Create New Lead"
          closeOnOutsideClick={false}

      >
        <AddNewLeadForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
      <Modal
        isVisible={showEditModal}
        className="w-full md:w-[800px]"
        onClose={() => setShowEditModal(false)}
        title="Edit Branch"
          closeOnOutsideClick={false}

      >
        <EditLeadForm
          lead={selectedBranch}
          onSuccess={handleEditSuccess}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
      <Modal
        isVisible={showConvertClientModal}
        className="w-full md:w-[800px]"
        onClose={() => setShowConvertClientModal(false)}
        title="Client Convert Form "
          closeOnOutsideClick={false}

      >
        <LeadClientForm
          lead={selectedBranch}
          onSuccess={handleConvertSuccess}
          onCancel={() => setShowConvertClientModal(false)}
        />
      </Modal>

      <Modal
        isVisible={showDeleteModal}
        className="w-full md:w-[600px]"
        onClose={() => setShowDeleteModal(false)}
        title="Delete Branch"
          closeOnOutsideClick={false}

      >
        <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Are you sure you want to delete this branch? This action cannot be
              undone.
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
              {loading ? <ButtonLoader /> : "Delete Branhch"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Leads;
