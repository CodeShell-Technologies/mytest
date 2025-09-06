import { useEffect, useState } from "react";
import DataTable from "src/component/DataTable";
import CustomPagination from "src/component/CustomPagination";
import SearchInput from "src/component/SearchInput";
import Dropdown from "src/component/DrapDown";
import { FileDown, Eye, DollarSign } from "lucide-react";
import * as XLSX from "xlsx";
import axios from "axios";
import { BASE_URL, toastposition } from "~/constants/api";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "src/stores/authStore";
import { useMediaQuery } from "../hooks/use-click-outside";
import Modal from "src/component/Modal";
import { useNavigate } from "react-router";

const InvoiceList = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectStatus, setSelectStatus] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [error, setError] = useState(null);
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [pageSize, setPageSize] = useState(8);
  const [showFilters, setShowFilters] = useState(false);
  const [sheetData, setSheetData] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPayList, setShowPayList] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    invoice_id: "",
    paid_amount: "",
    payment_mode: "upi",
    notes: "",
  });

  const token = useAuthStore((state) => state.accessToken);
  const userRole = useAuthStore((state) => state.role);
  const staticBranchCode = "BRANCH-03";
  const navigate = useNavigate();
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "raised", label: "Raised" },
    { value: "partially_paid", label: "Partially Paid" },
    { value: "paid", label: "Paid" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const paymentModeOptions = [
    { value: "upi", label: "UPI" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "cash", label: "Cash" },
    { value: "cheque", label: "Cheque" },
  ];

  const pageSizeOptions = [
    { value: 20, label: "20 per page" },
    { value: 40, label: "30 per page" },
    { value: 50, label: "40 per page" },
    { value: 80, label: "50 per page" },
    { value: 100, label: "100 per page" },
    { value: 200, label: "100 per page" },
  ];

  const getPayments = async (
    page = currentPage,
    limit = pageSize,
    search = searchTerm,
    status = selectStatus,
    branchcode = selectedBranchCode
  ) => {
    setLoading(true);
    try {
      let url = `${BASE_URL}/project/invoice/read?page=${page}&limit=${limit}`;

      if (search) url += `&search=${search}`;
      if (status) url += `&status=${status}`;

      const branchFilter =
        userRole === "superadmin" ? branchcode : staticBranchCode;
      if (branchFilter) url += `&branchcode=${branchFilter}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSheetData(response?.data?.data || []);
      setTotalItem(response?.data?.totalDocuments || 0);
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching payments", error);
      setError("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentUpdate = (invoice) => {
    setSelectedInvoice(invoice);
    console.log("invoiceehabndleee", invoice);
    const id = invoice.invoice.invoice_id;

    navigate(`/payreq_view/${encodeURIComponent(id)}`);
  };
  const handleViewNavigate = (invoice) => {
    console.log("invoiceehabndleee", invoice);
    const id = invoice.invoice.invoice_id;

    navigate(`/invoice_view/${encodeURIComponent(id)}`);
  };
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}/project/invoice/payment`,
        paymentForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        toast.success("Payment recorded successfully!");
        setShowPaymentModal(false);
        getPayments(); 
      }
    } catch (error) {
      console.error("Error recording payment", error);
      toast.error(error.response?.data?.message || "Failed to record payment");
    }
  };

  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    getPayments();
  }, [
    currentPage,
    searchTerm,
    selectStatus,
    selectedBranchCode,
    pageSize,
    userRole,
  ]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setSelectStatus(value);
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

  const handleOnExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, "PaymentList.xlsx");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(parseFloat(amount || "0"));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const thead = () => [
    { data: "Invoice No" },
    { data: "Client" },
    { data: "Project" },
    { data: "Total Amount" },
    { data: "Paid Amount" },
    { data: "Balance" },
    { data: "Status" },
    { data: "Due Date" },
    { data: "Actions" },
  ];

  const tbody = () => {
    if (!data) return [];

    return data.map((item) => {
      const invoice = item.invoice;
      const milestone = item.milestone_requests[0]; 
      return {
        id: invoice.invoice_id,
        data: [
          { data: invoice.invoice_no },
          { data: invoice.client_name },
          { data: invoice.project_title },
          { data: formatCurrency(invoice.total_amount) },
          { data: formatCurrency(invoice.paid_amount) },
          { data: formatCurrency(invoice.balance_amount) },
          {
            data: (
              <div
                className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${
                  invoice.status === "paid"
                    ? "bg-green-100 text-green-800 dark:bg-green-800/25 dark:text-green-400"
                    : invoice.status === "cancelled"
                      ? "bg-red-100 text-red-800 dark:bg-red-800/25 dark:text-red-300"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-800/25 dark:text-blue-300"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    invoice.status === "paid"
                      ? "bg-green-800 dark:bg-green-400"
                      : invoice.status === "cancelled"
                        ? "bg-red-800 dark:bg-red-400"
                        : "bg-blue-800 dark:bg-blue-400"
                  }`}
                ></span>
                {invoice.status.charAt(0).toUpperCase() +
                  invoice.status.slice(1)}
              </div>
            ),
          },
          { data: formatDate(invoice.due_date) },
          {
            data: (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handlePaymentUpdate(item)}
                  className="p-1 text-red-700 rounded hover:text-gray-500 dark:hover:text-gray-300"
                  title="Record Payment"
                >
                  <DollarSign size={18} />
                </button>

                <button
                  onClick={() => handleViewNavigate(item)}
                  className="p-1 text-blue-700 rounded hover:text-gray-500 dark:hover:text-gray-300"
                  title="View Invoice"
                >
                  <Eye size={18} />
                </button>
              </div>
            ),
            className: "action-cell",
          },
        ],
      };
    });
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)]">
              Payment Management
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
      onClick={() => navigate("/invoice_create")}
      className="flex items-center justify-center text-white bg-[var(--color-primary)] hover-effect dark:bg-red-800 focus:outline-non font-medium text-sm rounded-sm px-5 py-2.5"
    >
      + New Invoice
    </button>


              <button
                onClick={handleOnExport}
                className="flex items-center justify-center text-gray-400 bg-white focus:outline-non font-medium text-sm rounded-sm border border-dotted border-gray-400 hover:text-red-700/70 px-3 dark:bg-gray-800 dark:text-gray-300 py-2.5"
              >
                <FileDown className="mr-1" />
                {!isMobile && "Export Excel"}
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
                placeholder="Payment Status"
                className="w-full md:w-[200px]"
              />

              {userRole === "superadmin" && (
                <Dropdown
                  options={[
                    { value: "", label: "All Branches" },
                    { value: "BRANCH-03", label: "BRANCH-03" },
                    { value: "BRCH_02", label: "BRCH_02" },
                  ]}
                  selectedValue={selectedBranchCode}
                  onSelect={handleBranchCodeChange}
                  placeholder="Branch Code"
                  className="w-full md:w-[200px]"
                />
              )}

              <div className={`${isMobile ? "w-full" : "w-[200px] mt-3"}`}>
                <SearchInput
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search payments..."
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
            paginationLabel="payments"
            isScroll={true}
          />
        </div>
      </div>

      <Modal
        isVisible={showPaymentModal}
        className="w-full md:w-[600px]"
        onClose={() => setShowPaymentModal(false)}
        title={`Record Payment for ${selectedInvoice?.invoice?.invoice_no || ""}`}
      >
        <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
          <form onSubmit={handlePaymentSubmit}>
            <div className="space-y-4">
              {selectedInvoice && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Amount
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                      {formatCurrency(selectedInvoice.invoice.total_amount)}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Balance Amount
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                      {formatCurrency(selectedInvoice.invoice.balance_amount)}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Paid Amount
                  </p>
                  <input
                    name="paid_amount"
                    value={paymentForm.paid_amount}
                    onChange={handlePaymentFormChange}
                    className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                    type="number"
                    placeholder="Amount"
                    required
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Payment Mode
                  </p>
                  <select
                    name="payment_mode"
                    value={paymentForm.payment_mode}
                    onChange={handlePaymentFormChange}
                    className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                    required
                  >
                    {paymentModeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Notes
                </p>
                <textarea
                  name="notes"
                  value={paymentForm.notes}
                  onChange={handlePaymentFormChange}
                  className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none min-h-[80px]"
                  placeholder="Payment notes"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors duration-200 font-medium text-sm"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-red-700 hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-md transition-colors duration-200 font-medium text-sm shadow-sm"
              >
                Record Payment
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default InvoiceList;
