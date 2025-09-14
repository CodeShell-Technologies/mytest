import { useEffect, useState } from "react";
import DataTable from "src/component/DataTable";
import CustomPagination from "src/component/CustomPagination";
import SearchInput from "src/component/SearchInput";
import Modal from "src/component/Modal";
import Dropdown from "src/component/DrapDown";
import { FileDown, Eye } from "lucide-react";
import * as XLSX from "xlsx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, toastposition } from "~/constants/api";
import toast, { Toaster } from "react-hot-toast";
import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
import { useAuthStore } from "src/stores/authStore";
import useBranchStore from "src/stores/useBranchStore";
import AddNewLeadForm from "./AddNewLead";
import EditLeadForm from "./EditLeadsForm";
import LeadClientForm from "../Clients/LeadClientForm";

const LeadConvertion = () => {
  const navigate = useNavigate();
  const accesstoken = useAuthStore((state) => state.accessToken);
  const branchcode = useAuthStore((state) => state.branchcode);
  const branchCodeOptions = useBranchStore((state) => state.branchCodeOptions);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [selectBranchCode, setSelectBranchCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


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


const token = accesstoken;

  const [data, setData] = useState({
    overall: { total_leads: 0, converted_leads: 0, conversion_rate: "0.00%" },
    branches: [],
    convertedList: [],
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConvertClientModal, setShowConvertClientModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const pageSizeOptions = [
    { value: 8, label: "8 per page" },
    { value: 20, label: "20 per page" },
    { value: 50, label: "50 per page" },
    { value: 100, label: "100 per page" },
  ];

  const statusOptions = [
    { value: "", label: "All Branches" },
    { value: "active", label: "Active Branches" },
    { value: "inactive", label: "Inactive Branches" },
  ];

  // ===============================
  //  Fetch Lead Conversion Stats
  // ===============================
  const getLeadConversion = async (branchCode?: string) => {
    setLoading(true);
    try {
      let url = `${BASE_URL}/getleadconvet`;
      const params = new URLSearchParams();
      if (branchCode) params.append("branchcode", branchCode);
      if ([...params].length > 0) url += `?${params.toString()}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData({
        overall: response.data.overall,
        branches: response.data.branches,
        convertedList: response.data.converted_list,
      });
    } catch (error) {
      console.error("Error fetching lead conversion stats", error);
      setError("Failed to fetch lead conversion stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hydrated && token) {
    getLeadConversion(selectBranchCode);
  }
  }, [token, hydrated,branchcode, selectBranchCode]);

  // ===============================
  //  Table Header and Body
  // ===============================
  const thead = () => [
    { data: "ID", filterKey: "id" },
    { data: "Branch Code", filterKey: "branchcode" },
    { data: "Lead Name", filterKey: "lead_name" },
    { data: "Phone", filterKey: "phone" },
    { data: "Email", filterKey: "email" },
    { data: "Campaign Code", filterKey: "campaign_code" },
    { data: "Client Code", filterKey: "client_code" },
    { data: "Client Name", filterKey: "client_name" },
    { data: "Company", filterKey: "company_name" },
    { data: "Industry", filterKey: "industry_type" },
    { data: "Comm Type", filterKey: "comm_type" },
    { data: "Lead Status", filterKey: "lead_status" },
    { data: "Client Status", filterKey: "client_status" },
    { data: "Actions", className: "text-center" },
  ];

  const tbody = () => {
    if (!data?.convertedList) return [];
    return data.convertedList.map((lead) => ({
      id: lead.id,
      data: [
        { data: lead.id },
        { data: lead.branchcode },
        { data: lead.lead_name },
        { data: lead.phone },
        { data: lead.email },
        { data: lead.campaign_code },
        { data: lead.client_code },
        { data: lead.client_name },
        { data: lead.company_name },
        { data: lead.industry_type },
        { data: lead.comm_type },
        {
          data: (
            <span
              className={`px-2 py-1 rounded text-xs ${
                lead.lead_status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {lead.lead_status}
            </span>
          ),
        },
        {
          data: (
            <span
              className={`px-2 py-1 rounded text-xs ${
                lead.client_status === "converted"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {lead.client_status}
            </span>
          ),
        },
        {
          data: (
            <div className="flex justify-center gap-2">
              <Link to={`/leadsview/${lead.id}`}>
                <button
                  className="p-1 text-blue-700 rounded hover:text-gray-500 dark:hover:text-gray-300"
                  title="View"
                >
                  <Eye size={18} />
                </button>
              </Link>
            </div>
          ),
        },
      ],
    }));
  };

  // ===============================
  //  Export to Excel
  // ===============================
  const handleOnExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data.convertedList);
    XLSX.utils.book_append_sheet(wb, ws, "Converted Leads");
    XLSX.writeFile(wb, "ConvertedLeads.xlsx");
  };

  return (
    <>
      <div className="flex flex-col min-h-screen p-4">
        <Toaster position={toastposition} reverseOrder={false} />

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)]">
            Lead Conversion Management
          </h2>
          <button
            onClick={handleOnExport}
            className="flex items-center px-3 py-2 bg-white border rounded text-gray-700 hover:text-red-700"
          >
            <FileDown className="mr-1" /> Export Excel
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <Dropdown
            options={branchCodeOptions}
            selectedValue={selectBranchCode}
            onSelect={setSelectBranchCode}
            placeholder="Filter by Branch"
            className="w-[200px]"
          />
        </div>

        {/* Conversion Rate Summary */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <p className="text-sm font-medium">Total Leads</p>
            <p className="text-lg font-bold">{data.overall.total_leads}</p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <p className="text-sm font-medium">Converted Leads</p>
            <p className="text-lg font-bold">{data.overall.converted_leads}</p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <p className="text-sm font-medium">Conversion Rate</p>
            <p className="text-lg font-bold">{data.overall.conversion_rate}</p>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <DataTable
            thead={thead}
            tbody={tbody}
            className="min-w-full"
            enableFilters={true}
            enableSorting={true}
            onRowDoubleClick={(row) => navigate(`/leadsview/${row.id}`)}
          />
        )}

        {/* Pagination */}
        <div className="mt-4">
          <CustomPagination
            total={data.convertedList?.length || 0}
            currentPage={currentPage}
            defaultPageSize={pageSize}
            onChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Modals */}
      <Modal
        isVisible={showCreateModal}
        className="w-full md:w-[800px]"
        onClose={() => setShowCreateModal(false)}
        title="Create New Lead"
      >
        <AddNewLeadForm
          onSuccess={() => {
            setShowCreateModal(false);
            getLeadConversion();
            toast.success("Lead created successfully!");
          }}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      <Modal
        isVisible={showEditModal}
        className="w-full md:w-[800px]"
        onClose={() => setShowEditModal(false)}
        title="Edit Lead"
      >
        <EditLeadForm
          lead={selectedLead}
          onSuccess={() => {
            setShowEditModal(false);
            getLeadConversion();
            toast.success("Lead updated successfully!");
          }}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      <Modal
        isVisible={showConvertClientModal}
        className="w-full md:w-[800px]"
        onClose={() => setShowConvertClientModal(false)}
        title="Convert Lead to Client"
      >
        <LeadClientForm
          lead={selectedLead}
          onSuccess={() => {
            setShowConvertClientModal(false);
            getLeadConversion();
            toast.success("Lead converted successfully!");
          }}
          onCancel={() => setShowConvertClientModal(false)}
        />
      </Modal>
    </>
  );
};

export default LeadConvertion;
