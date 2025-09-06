

import { useEffect, useState } from "react";
import DataTable from "src/component/DataTable";
import CustomPagination from "src/component/CustomPagination";
import SearchInput from "src/component/SearchInput";
import Dropdown from "src/component/DrapDown";
import { FileDown, Eye, DollarSign, LogOut,SquarePen } from "lucide-react";
import * as XLSX from "xlsx";
import axios from "axios";
import { BASE_URL, toastposition } from "~/constants/api";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "src/stores/authStore";
import { useMediaQuery } from "../hooks/use-click-outside";
import Modal from "src/component/Modal";
import { useNavigate, useParams } from "react-router";

const PayRequestList = () => {
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
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const navigate=useNavigate()
  const { id } = useParams();
  const inv_id = decodeURIComponent(id);


  const [isEditOpen, setIsEditOpen] = useState(false);
const [selectedRequest, setSelectedRequest] = useState(null);


  const [paymentForm, setPaymentForm] = useState({
    project_code: "",
    milestone_code:"",
    invoice_no: "",
    request_id: "",
    paid_amount: "",
    payment_mode: "upi",
    notes: "",
  });

  const token = useAuthStore((state) => state.accessToken);
  const userRole = useAuthStore((state) => state.role);
  const staticBranchCode = "BRANCH-03";

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "request", label: "Requested" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "paid", label: "Paid" },
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

  const getPayRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/project/invoice/read?invoice_id=${inv_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.data && response.data.data.length > 0) {
        const invoiceData = response.data.data[0];
        setInvoiceDetails(invoiceData.invoice);
        setData(invoiceData.milestone_requests);
        setSheetData(invoiceData.milestone_requests);
        setTotalItem(invoiceData.milestone_requests.length);
      }
    } catch (error) {
      console.error("Error fetching invoice details", error);
      setError("Failed to fetch invoice details");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async (requestId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/project/pay/read?request_id=${requestId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPaymentHistory(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching payment history", error);
      toast.error("Failed to fetch payment history");
    }
  };

  const handleViewPayment = (requestId) => {
    setSelectedRequestId(requestId);
    fetchPaymentHistory(requestId);
    setShowViewModal(true);
  };

  const handlePaymentUpdate = (request) => {
    setPaymentForm({
      project_code: request.project_code,
      milestone_code:request.milestone_code,
      invoice_no: invoiceDetails.invoice_no,
      request_id: request.request_id,
      paid_amount: request.balance_amount,
      payment_mode: "upi",
      notes: "",
    });
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}/project/pay/create`,
        paymentForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        toast.success("Payment recorded successfully!");
        setShowPaymentModal(false);
        getPayRequests(); 
      }
    } catch (error) {
      console.error("Error recording payment", error);
      toast.error(error.response?.data?.message || "Failed to record payment");
    }
  };




  const handleUpdatePayment = (requestId) => {
  const req = data.find((r) => r.request_id === requestId);
  setSelectedRequest(req);
  setIsEditOpen(true);
};

  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    getPayRequests();
  }, [inv_id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(parseFloat(amount || "0"));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const thead = () => [
    { data: "Request ID" },
    { data: "Milestone" },
    { data: "Amount" },
    { data: "Balance" },
    { data: "Status" },
    { data: "Due Date" },
    { data: "Actions" },
  ];

  const tbody = () => {
    if (!data) return [];

    return data.map((request) => ({
      id: request.request_id,
      data: [
        { data: request.request_id },
        { data: request.miles_title },
        { data: formatCurrency(request.milestone_amount) },
        { data: formatCurrency(request.balance_amount) },
        {
          data: (
            <div
              className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${
                request.status === "approved"
                  ? "bg-green-100 text-green-800 dark:bg-green-800/25 dark:text-green-400"
                  : request.status === "rejected"
                  ? "bg-red-100 text-red-800 dark:bg-red-800/25 dark:text-red-300"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-800/25 dark:text-blue-300"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  request.status === "approved"
                    ? "bg-green-800 dark:bg-green-400"
                    : request.status === "rejected"
                    ? "bg-red-800 dark:bg-red-400"
                    : "bg-blue-800 dark:bg-blue-400"
                }`}
              ></span>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </div>
          ),
        },
        { data: formatDate(request.due_date) },
        {
          data: (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleViewPayment(request.request_id)}
                className="p-1 text-blue-700 rounded hover:text-gray-500 dark:hover:text-gray-300"
                title="View Payment"
              >
                <Eye size={18} />
              </button>

              {/*<button
                className="p-1 text-[var(--color-primary)] rounded hover:text-gray-500 dark:hover:text-gray-300"
                onClick={() => handleUpdatePayment(request.request_id)}
                title="Edit"
              >
                <SquarePen size={18} />
              </button>*/}
              <button
                onClick={() => handlePaymentUpdate(request)}
                className="p-1 text-red-700 rounded hover:text-gray-500 dark:hover:text-gray-300"
                title="Update Payment"
              >
                <DollarSign size={18} />
              </button>
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
              Invoice & Payment Management
            </h2>
               <div>
          <button
            className="text-gray-500 bg-gray-200 px-3 py-1 rounded-lg mt-6"
            onClick={() => navigate(-1)}
          >
            <LogOut className="inline rotate-180 text-gray-500 mr-3" />
            Go Back
          </button>
        </div>
          </div>
          <Toaster position={toastposition} reverseOrder={false} />

          {invoiceDetails && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Invoice Information</h3>
                  <p><span className="font-medium">Invoice No:</span> {invoiceDetails.invoice_no}</p>
                  <p><span className="font-medium">Date:</span> {formatDate(invoiceDetails.invoice_date)}</p>
                  <p><span className="font-medium">Due Date:</span> {formatDate(invoiceDetails.due_date)}</p>
                  <p><span className="font-medium">Status:</span> {invoiceDetails.status}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Client Information</h3>
                  <p><span className="font-medium">Client:</span> {invoiceDetails.client_name}</p>
                  <p><span className="font-medium">Company:</span> {invoiceDetails.company_name}</p>
                  <p><span className="font-medium">Project:</span> {invoiceDetails.project_title}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Financial Information</h3>
                  <p><span className="font-medium">Total Amount:</span> {formatCurrency(invoiceDetails.total_amount)}</p>
                  <p><span className="font-medium">Paid Amount:</span> {formatCurrency(invoiceDetails.paid_amount)}</p>
                  <p><span className="font-medium">Balance:</span> {formatCurrency(invoiceDetails.balance_amount)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Milestone Payment Requests</h3>
            
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
          
{isEditOpen && selectedRequest && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
      <h2 className="text-lg font-semibold mb-4">
        Edit Request {selectedRequest.request_id}
      </h2>

      <div className="space-y-3">
        {/* Milestone */}
        <div>
          <label className="block text-sm font-medium">Milestone</label>
          <input
            type="text"
            value={selectedRequest.miles_title}
            onChange={(e) =>
              setSelectedRequest({
                ...selectedRequest,
                miles_title: e.target.value,
              })
            }
            className="w-full border rounded p-2"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium">Amount</label>
          <input
            type="number"
            value={selectedRequest.milestone_amount}
            onChange={(e) =>
              setSelectedRequest({
                ...selectedRequest,
                milestone_amount: e.target.value,
              })
            }
            className="w-full border rounded p-2"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            value={selectedRequest.status}
            onChange={(e) =>
              setSelectedRequest({
                ...selectedRequest,
                status: e.target.value,
              })
            }
            className="w-full border rounded p-2"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => setIsEditOpen(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            try {
              const res = await fetch(
                `${BASE_URL}/updateRequest/${selectedRequest.request_id}`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(selectedRequest),
                }
              );
              if (res.ok) {
                alert("Request updated successfully!");
                setIsEditOpen(false);
                // 🔄 refresh data after update
              } else {
                alert("Update failed");
              }
            } catch (err) {
              console.error(err);
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}


          </div>
        </div>
      </div>

      <Modal
        isVisible={showViewModal}
        className="w-full md:w-[800px]"
        onClose={() => setShowViewModal(false)}
        title={`Payment History for ${selectedRequestId}`}
      >
        <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
          {paymentHistory.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Payment ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Payment Mode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {paymentHistory.map((payment) => (
                      <tr key={payment.pay_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {payment.pay_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {formatCurrency(payment.paid_amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {payment.payment_mode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {formatDate(payment.paid_on)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800/25 dark:text-green-400">
                            {payment.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {payment.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              No payment history found for this request
            </div>
          )}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowViewModal(false)}
              className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors duration-200 font-medium text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isVisible={showPaymentModal}
        className="w-full md:w-[600px]"
        onClose={() => setShowPaymentModal(false)}
        title={`Record Payment for Request ${paymentForm.request_id}`}
      >
        <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
          <form onSubmit={handlePaymentSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Project Code
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                    {paymentForm.project_code}
                  </p>
                </div>



                   <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Milestone Code
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                    {paymentForm.milestone_code}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Invoice No
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                    {paymentForm.invoice_no}
                  </p>
                </div>
              </div>

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

export default PayRequestList;