

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DataTable from "src/component/DataTable";
import CustomPagination from "src/component/CustomPagination";
import SearchInput from "src/component/SearchInput";
import Modal from "src/component/Modal";
import Dropdown from "src/component/DrapDown";
import { FileDown } from "lucide-react";
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
import ClientAddForm from "./ClientAddForm";
import ClientEditForm from "./ClientEditForm";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Client = () => {
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
  const [selectedClient, setselectedClient] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [showFilters, setShowFilters] = useState(false);
  const accesstoken = useAuthStore((state) => state.accessToken);
  const [deleteType, setDeleteType] = useState("permanent");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
const [columnFilters, setColumnFilters] = useState<{ [key: string]: string }>({});


       const [hydrated, setHydrated] = useState(false);


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
       fetchBranches(token);
  }
}, [hydrated, token]);


  const getClient = async (
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
      let url = `${BASE_URL}/client/overview/read?page=${page}&limit=${limit}`;

      if (search) url += `&search=${search}`;
      if (status) url += `&status=${status}`;
      if (manager) url += `&manager_id=${manager}`;
      if (branchCode) url += `&branchcode=${branchCode}`;
      if (sort) url += `&dec=${sort}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("responseclient", response);
      setSheetData(response?.data?.data);
      setTotalItem(response?.data?.totalDocuments);
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
    getClient();
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
    toast.success("Client added successfully!");
    fetchBranches(token);
    getClient();
  };


    const handleSort = (key: string) => {
  setSortConfig((prev) => {
    if (!prev || prev.key !== key) {
      return { key, direction: "asc" };
    }
    if (prev.direction === "asc") return { key, direction: "desc" };
    return null; // reset sort
  });
};





const handleFilterChange = (key: string, value: string) => {
  setColumnFilters((prev) => ({ ...prev, [key]: value }));
};


const processedData = data
  .filter((row) =>
    Object.keys(columnFilters).every((key) => {
      if (!columnFilters[key]) return true;
      let cellValue = "";

      if (key === "designation") {
        cellValue = row.contacts.map((c) => c.designation).join(", ");
      } else if (key === "contacts_phone") {
        cellValue = row.contacts.map((c) => c.phone).join(", ");
      } else {
        cellValue = row[key]?.toString() ?? "";
      }

      return cellValue.toLowerCase().includes(columnFilters[key].toLowerCase());
    })
  )
  .sort((a, b) => {
    if (!sortConfig) return 0;
    let aVal: any, bVal: any;

    if (sortConfig.key === "designation") {
      aVal = a.contacts.map((c) => c.designation).join(", ");
      bVal = b.contacts.map((c) => c.designation).join(", ");
    } else if (sortConfig.key === "contacts_phone") {
      aVal = a.contacts.map((c) => c.phone).join(", ");
      bVal = b.contacts.map((c) => c.phone).join(", ");
    } else {
      aVal = a[sortConfig.key];
      bVal = b[sortConfig.key];
    }

    aVal = (aVal || "").toString().toLowerCase();
    bVal = (bVal || "").toString().toLowerCase();

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });








  const handleEditSuccess = () => {
    setShowEditModal(false);
    toast.success("Client Update Succesfully!");
    getClient();
  };
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleEditBranch = (client) => {
    setselectedClient(client);
    setShowEditModal(true);
  };

  const handleDeleteClient = (client) => {
    setShowDeleteModal(true);
    setselectedClient(client);
  };

  const handleDelete = async () => {
    setLoading(true);
    const deleteData = {
      data: {
        branchcode: selectedClient.branchcode,
        client_code: selectedClient.client_code,
        status: "inactive",
        delete_type: deleteType,
      },
    };
    try {
      const response = await axios.delete(
        `${BASE_URL}/client/overview/delete`,
        {
          data: deleteData,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowDeleteModal(false);
      toast.success("Client deleted successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      toast.error(error || "Error deleting client", {
        style: {
          border: "1px solid rgb(185 28 28)",
          padding: "14px",
          color: "rgb(185 28 28)",
        },
        iconTheme: {
          primary: "rgb(185 28 28)",
          secondary: "#FFFAEE",
        },
      });
    } finally {
      setLoading(false);
      setError(null);
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

  // const thead = () => [
  //   { data: "Client Code" },
  //   { data: "Branch Code" },
  //   { data: "Client Name" },
  //   { data: "Company Name" },
  //   { data: "Mobile" },
  //   { data: "Designation" },
  //   { data: "Mobile" },
  //   { data: "Status" },
  //   { data: "Actions", className: "text-center" },
  // ];
 const navigate = useNavigate();
  const columns = [
  { key: "client_code", label: "Client Code" },
  { key: "branchcode", label: "Branch Code" },
  { key: "client_name", label: "Client Name" },
  { key: "company_name", label: "Company Name" },
  { key: "mobile", label: "Mobile" },
  { key: "designation", label: "Designation" },
  { key: "alt_mobile", label: "Alternate Mobile" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", sortable: false, filterable: false, className: "text-center" },
];


const thead = () =>
  columns.map((col) => ({
    data: (
      <div className="flex flex-col">
        {/* Sorting */}
        <span
          className={`cursor-pointer ${col.className || ""}`}
          onClick={() => col.sortable !== false && handleSort(col.key)}
        >
          {col.label}
          {sortConfig?.key === col.key &&
            (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
        </span>

        {/* Filtering */}
        {col.filterable === false ? null : (
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

  // const tbody = () => {
  //   if (!data) return [];

  //   return data.map((client, index) => ({
  //     data: [
  //       { data: client.client_code },
  //       { data: client.branchcode },
  //       { data: client.client_name },
  //       { data: client.company_name },
  //       { data: client.primary_phone},
  //       { data: client.contacts.map(c => c.designation).join(', ') },
  //       { data: client.contacts.map(c => c.phone).join(', ') },
  //       {
  //         data: (
  //           <div
  //             className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${client.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
  //           >
  //             <span
  //               className={`w-2 h-2 rounded-full mr-2 ${client.status === "active" ? "bg-green-800" : "bg-red-700"}`}
  //             ></span>
  //             {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
  //           </div>
  //         ),
  //       },
  //       {
  //         data: (
  //           <div className="flex justify-center gap-2">
  //             <Link to={`/client_view?client_code=${client.client_code}`}>
                
  //               <button
  //                 className="p-1 text-blue-700 rounded hover:text-gray-500 dark:hover:text-gray-300"
  //                 title="View"
  //               >
  //                 <Eye size={18} />
  //               </button>
  //             </Link>
  //             <button
  //               className="p-1 text-[var(--color-primary)] rounded hover:text-gray-500 dark:hover:text-gray-300"
  //               onClick={() => handleEditBranch(client)}
  //               title="Edit"
  //             >
  //               <SquarePen size={18} />
  //             </button>
  //             <button
  //               className="p-1 text-red-600 rounded hover:text-gray-500 dark:hover:text-gray-300"
  //               onClick={() => handleDeleteClient(client)}
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


const tbody = () => {
    if (!processedData) return [];

    return processedData.map((client) => {
      const viewUrl = `/client_view?client_code=${client.client_code}`;

      return {
        data: [
          { data: client.client_code },
          { data: client.branchcode },
          { data: client.client_name },
          { data: client.company_name },
          { data: client.primary_phone },
          { data: client.contacts.map((c) => c.designation).join(", ") },
          { data: client.contacts.map((c) => c.phone).join(", ") },
          {
            data: (
              <div
                className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${
                  client.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    client.status === "active" ? "bg-green-800" : "bg-red-700"
                  }`}
                ></span>
                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
              </div>
            ),
          },
          {
            data: (
              <div className="flex justify-center gap-2">
                <Link to={viewUrl}>
                  <button className="p-1 text-blue-700" title="View">
                    <Eye size={18} />
                  </button>
                </Link>
                <button
                  className="p-1 text-[var(--color-primary)]"
                  onClick={() => handleEditBranch(client)}
                  title="Edit"
                >
                  <SquarePen size={18} />
                </button>
                <button
                  className="p-1 text-red-600"
                  onClick={() => handleDeleteClient(client)}
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
            idx === 8 ? (
              col.data
            ) : (
              <div
                onDoubleClick={() => navigate(viewUrl)} // ✅ SPA navigation
                className="w-full h-full cursor-pointer"
              >
                {col.data}
              </div>
            ),
        })),
      };
    });
  };


  const handleOnExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, "Branches");
    XLSX.writeFile(wb, "BranchList.xlsx");
  };
// Export Client List as PDF
const handleOnExportPDF = () => {
  const doc = new jsPDF("landscape");

  doc.setFontSize(14);
  doc.text("Client List (Summary)", 14, 10);

  if (sheetData.length > 0) {
    // Pick only important columns for PDF summary
    const importantCols = [
      "client_code",
      "client_name",
      "company_name",
      "primary_phone",
      "email",
      "overallcost",
      "balance",
      "project_count",
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
      body: sheetData, // <-- your client table data array
      startY: 20,
      styles: { fontSize: 8, cellPadding: 2, overflow: "linebreak" },
      headStyles: { fillColor: [22, 160, 133], fontSize: 9, halign: "center" },
      theme: "grid",
      tableWidth: "auto",
    });
  }

  doc.save("ClientList.pdf");
};

// Download Excel Template for Clients
const handleDownloadTemplate = () => {
  const headers = [
    "client_code",
    "branchcode",
    "campaign_code",
    "lead_id",
    "client_name",
    "company_name",
    "primary_phone",
    "email",
    "office_address",
    "website",
    "overallcost",
    "balance",
    "project_count",
    "contacts",      // JSON Array field
    "createdby",
    "updatedby",
    "industry_type",
    "comm_type",
    "status",
    "created_on",
    "updated_on",
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers]); // Only headers row
  XLSX.utils.book_append_sheet(wb, ws, "ClientTemplate");

  XLSX.writeFile(wb, "ClientTemplate.xlsx");
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
      const res = await axios.post(`${BASE_URL}/clientimport`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // if using auth
        },
      });
      console.log("Upload success:", res.data);
      alert ("clients imported successfully!")
      navigate("/client");
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
              Client Management
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
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center text-white bg-[var(--color-primary)] hover-effect dark:bg-red-800 focus:outline-non font-medium text-sm rounded-sm px-5 py-2.5"
              >
                {!isMobile && "New Client"} +

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

        <div className=" border-t border-gray-200 dark:border-gray-700 p-4">
          <CustomPagination
            total={totalItem}
            currentPage={currentPage}
            defaultPageSize={pageSize}
            onChange={handlePageChange}
            paginationLabel="Clients"
            isScroll={true}
          />
        </div>
      </div>

      <Modal
        isVisible={showCreateModal}
        className="w-full md:w-[800px]"
        onClose={() => setShowCreateModal(false)}
        title="Create New Client"
        closeOnOutsideClick={false}
      >
        <ClientAddForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
         
        />
      </Modal>

      <Modal
        isVisible={showDeleteModal}
        className="w-full md:w-[600px]"
        onClose={() => setShowDeleteModal(false)}
        title="Delete Client"
        closeOnOutsideClick={false}
      >
        {/* <div className="flex flex-col gap-6 justify-center items-center">
          <p className="text-gray-500 text-lg font-bold text-center">
            Are you sure you want to delete this branch?
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
              Are you sure you want to delete this client? This action cannot be
              undone.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Delete Type
            </p>
            <select
              value={deleteType}
              onChange={(e) => setDeleteType(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
            >
              <option value="permanent">Permanent Delete</option>
              <option value="temp">Soft Delete (Mark as Inactive)</option>
            </select>
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
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? <ButtonLoader /> : "Delete Client"}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isVisible={showEditModal}
        className="w-full md:w-[800px]"
        onClose={() => setShowEditModal(false)}
        title="Edit Client"
        closeOnOutsideClick={false}
      >
        <ClientEditForm
          client={selectedClient}
          onSuccess={handleEditSuccess}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </>
  );
};

export default Client;
