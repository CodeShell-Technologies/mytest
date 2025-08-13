import { useEffect, useState } from "react";
import { useAuthStore } from "src/stores/authStore";
import axios from "axios";
import { BASE_URL } from "~/constants/api";
import Dropdown from "src/component/DrapDown";
import DynamicDoughnutChart from "src/component/graphComponents/DynamicDoughnutChart";
import KPIBarChart from "src/component/graphComponents/KpiChart";
import DynamicLineGraph from "src/component/graphComponents/DynamicLineGraph";
import PaymentProgressCard from "src/component/graphComponents/ProgressCard";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  FileText,
  CalendarCheck,
  CalendarX,
  Plus,
  HandCoins,
  UserRoundCheck,
  ContactRound,
} from "lucide-react";
import useBranchStore from "src/stores/useBranchStore";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  FaMoneyBillWave,
  FaUsers,
  FaFileInvoice,
  FaClock,
  FaUserPlus,
  FaUserTimes,
  FaProjectDiagram,
  FaAward,
  FaHandsHelping,
  FaUserTie,
  FaUserSlash,
} from "react-icons/fa";

const AccountantDashboard = () => {
  const token = useAuthStore((state) => state.accessToken);
  const userRole = useAuthStore((state) => state.role);
  const userBranchCode = useAuthStore((state) => state.branchcode);
  const [branchCode, setBranchCode] = useState(
    userRole === "superadmin" ? "" : userBranchCode
  );
  const [clientSummaryData, setClientSummaryData] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { branchCodeOptions, fetchBranches } = useBranchStore();

  useEffect(() => {
    if (userRole === "superadmin") {
      fetchBranches(token);
    }
  }, [token, userRole]);

  useEffect(() => {
    if (branchCode) {
      fetchData();
    }
  }, [branchCode]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const clientResponse = await axios.get(
        `${BASE_URL}/report/branchsummary/read?branchcode=${branchCode}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClientSummaryData(clientResponse.data.data);

      const invoiceResponse = await axios.get(
        `${BASE_URL}/project/invoice/read?branchcode=${branchCode}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInvoiceData(invoiceResponse.data.data);
    } catch (err) {
      console.error("Error fetching data", err);
      setError("Failed to fetch data");
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const getPaymentSummaryData = () => {
    if (!invoiceData.length) return null;

    const totalAmount = invoiceData.reduce(
      (sum, item) => sum + parseFloat(item.invoice.final_amount),
      0
    );
    const paidAmount = invoiceData.reduce(
      (sum, item) => sum + parseFloat(item.invoice.paid_amount),
      0
    );
    const balanceAmount = invoiceData.reduce(
      (sum, item) => sum + parseFloat(item.invoice.balance_amount),
      0
    );

    const today = new Date();
    const overdueInvoices = invoiceData.filter((item) => {
      const dueDate = new Date(item.invoice.due_date);
      return dueDate < today && parseFloat(item.invoice.balance_amount) > 0;
    });
    const overdueAmount = overdueInvoices.reduce(
      (sum, item) => sum + parseFloat(item.invoice.balance_amount),
      0
    );

    return {
      totalAmount,
      paidAmount,
      balanceAmount,
      overdueCount: overdueInvoices.length,
      overdueAmount,
    };
  };

  const getClientPaymentData = () => {
    if (!clientSummaryData.length) return null;

    return clientSummaryData.map((client) => ({
      clientName: client.client_name,
      totalAmount: parseFloat(client.total_client_amount),
      paidAmount: parseFloat(client.total_paid_amount),
      balanceAmount: parseFloat(client.total_balance_amount),
    }));
  };

  const getInvoiceStatusData = () => {
    if (!invoiceData.length) return null;

    const statusCounts = invoiceData.reduce((acc, item) => {
      const status = item.invoice.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      title: "Invoice Status",
      labels: Object.keys(statusCounts).map((key) =>
        key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      ),
      values: Object.values(statusCounts),
      colors: ["#10B981", "#F59E0B", "#EF4444", "#3B82F6"],
    };
  };

  const getPaymentTimelineData = () => {
    if (!invoiceData.length) return null;

    const monthlyData = invoiceData.reduce((acc, item) => {
      const date = new Date(item.invoice.invoice_date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = {
          paid: 0,
          pending: parseFloat(item.invoice.balance_amount),
          total: parseFloat(item.invoice.final_amount)
        };
      } else {
        acc[monthYear].paid += parseFloat(item.invoice.paid_amount);
        acc[monthYear].pending += parseFloat(item.invoice.balance_amount);
        acc[monthYear].total += parseFloat(item.invoice.final_amount);
      }
      return acc;
    }, {});

    const months = Object.keys(monthlyData).sort();
    
    return {
      title: "Payment Timeline",
      labels: months,
      datasets: [
        { 
          label: "Paid", 
          data: months.map(month => monthlyData[month].paid),
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.2)"
        },
        { 
          label: "Pending", 
          data: months.map(month => monthlyData[month].pending),
          borderColor: "#F59E0B",
          backgroundColor: "rgba(245, 158, 11, 0.2)"
        },
        { 
          label: "Total", 
          data: months.map(month => monthlyData[month].total),
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.2)"
        }
      ]
    };
  };

  const getProjectStatusData = () => {
    if (!clientSummaryData.length) return null;

    const statusData = clientSummaryData.reduce((acc, client) => {
      acc.draft += parseInt(client.draft_projects);
      acc.planning += parseInt(client.planning_projects);
      acc.inProcess += parseInt(client.inprocess_projects);
      acc.completed += parseInt(client.completed_projects);
      return acc;
    }, { draft: 0, planning: 0, inProcess: 0, completed: 0 });

    return {
      title: "Project Status",
      labels: ["Draft", "Planning", "In Process", "Completed"],
      values: [
        statusData.draft,
        statusData.planning,
        statusData.inProcess,
        statusData.completed,
      ],
      colors: ["#F59E0B", "#3B82F6", "#8B5CF6", "#10B981"],
    };
  };

  const getClientPaymentBarData = () => {
    if (!clientSummaryData.length) return null;

    return {
      labels: clientSummaryData.map(client => client.client_name),
      datasets: [
        {
          label: "Total Amount",
          data: clientSummaryData.map(client => parseFloat(client.total_client_amount)),
          backgroundColor: "#3B82F6",
        },
        {
          label: "Paid Amount",
          data: clientSummaryData.map(client => parseFloat(client.total_paid_amount)),
          backgroundColor: "#10B981",
        },
        {
          label: "Balance Amount",
          data: clientSummaryData.map(client => parseFloat(client.total_balance_amount)),
          backgroundColor: "#F59E0B",
        }
      ]
    };
  };

  const paymentSummary = getPaymentSummaryData();
  const clientPaymentData = getClientPaymentData();
  const invoiceStatusData = getInvoiceStatusData();
  const paymentTimelineData = getPaymentTimelineData();
  const projectStatusData = getProjectStatusData();
  const clientPaymentBarData = getClientPaymentBarData();

  const progressItems = [
    {
      type: "paid",
      value: paymentSummary?.paidAmount || 0,
      color: "bg-green-500",
      icon: <CheckCircle className="text-green-500 mr-2" />,
      label: "Paid",
    },
    {
      type: "pending",
      value: paymentSummary?.balanceAmount || 0,
      color: "bg-yellow-500",
      icon: <Clock className="text-yellow-500 mr-2" />,
      label: "Pending",
    },
    {
      type: "overdue",
      value: paymentSummary?.overdueAmount || 0,
      color: "bg-red-500",
      icon: <AlertCircle className="text-red-500 mr-2" />,
      label: "Overdue",
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)]">
          Accountant Dashboard
        </h2>

        {userRole === "superadmin" && (
          <Dropdown
            options={branchCodeOptions}
            selectedValue={branchCode}
            onSelect={setBranchCode}
            placeholder="Select Branch"
            className="w-[250px]"
          />
        )}
      </div>

      {loading && <div className="text-center py-8">Loading data...</div>}
      {error && <div className="text-red-500 text-center py-8">{error}</div>}

      {clientSummaryData.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    ₹{paymentSummary?.totalAmount.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="text-blue-500" size={24} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Paid Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{paymentSummary?.paidAmount.toLocaleString()}
                  </p>
                </div>
                <CreditCard className="text-green-500" size={24} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Pending Amount</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    ₹{paymentSummary?.balanceAmount.toLocaleString()}
                  </p>
                </div>
                <TrendingDown className="text-yellow-500" size={24} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Overdue Amount</p>
                  <p className="text-2xl font-bold text-red-600">
                    ₹{paymentSummary?.overdueAmount.toLocaleString()}
                  </p>
                </div>
                <AlertCircle className="text-red-500" size={24} />
              </div>
            </div>
          </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-15 mb-10 mt-10">
            <div className="bg-white dark:bg-gray-800 rounded-tr-4xl rounded-bl-4xl shadow-lg overflow-hidden">
              <div className="bg-red-800 dark:bg-red-800 px-5 py-2">
                <h2 className="text-xl font-bold text-white">
                  Accounts Overview
                </h2>
              </div>
              <div className="p-4">
                <div className="flex flex-col mb-4 p-3 bg-red-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3 mb-1">
                    <FaMoneyBillWave className="text-red-700 dark:text-red-800" size={20} />
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      Total Revenue
                    </h3>
                  </div>
                  <p className="text-xl font-bold text-red-700 dark:text-red-800">
                    ₹{paymentSummary?.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="text-green-600 dark:text-green-400" size={16} />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Total Invoices
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      {invoiceData.length}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="text-amber-600 dark:text-amber-400" size={16} />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Pending Payments
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      {invoiceData.filter(inv => parseFloat(inv.invoice.balance_amount) > 0).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-tr-4xl rounded-bl-4xl shadow-lg overflow-hidden">
              <div className="bg-red-800 dark:bg-red-800 px-5 py-2 ">
                <h2 className="text-xl font-bold text-white">
                  Projects Overview
                </h2>
              </div>
              <div className="p-4">
                <div className="flex flex-col mb-4 p-3 bg-red-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3 mb-1">
                    <BookOpen className="text-red-700 dark:text-red-800" size={20} />
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      Total Projects
                    </h3>
                  </div>
                  <p className="text-xl font-bold text-red-700 dark:text-red-800">
                    {clientSummaryData.reduce((sum, client) => sum + parseInt(client.total_projects), 0)}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="text-green-600 dark:text-green-400" size={16} />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Completed
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      {clientSummaryData.reduce((sum, client) => sum + parseInt(client.completed_projects), 0)}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="text-amber-600 dark:text-amber-400" size={16} />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        In Progress
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      {clientSummaryData.reduce((sum, client) => sum + parseInt(client.inprocess_projects), 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
                         <div className="mt-10">
            <PaymentProgressCard
              items={progressItems}
              title="Payment Status"
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow "
            />
          </div>
          </div>

        

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 ">
     
          

            {invoiceStatusData && (
              <div className=" dark:bg-gray-800 p-4 ">
                <DynamicDoughnutChart
                  data={invoiceStatusData}
                  className="h-[450px] w-full"
                />
              </div>
            )}

            {projectStatusData && (
              <div className=" dark:bg-gray-800 p-4 ">
                <DynamicDoughnutChart
                  data={projectStatusData}
                  className="h-[450px] w-full"
                />
              </div>
            )}
              {paymentTimelineData && (
              <div className=" dark:bg-gray-800 p-4 ">
                <DynamicLineGraph
                  data={paymentTimelineData}
                  className="h-[350px] w-full "
                />
              </div>
            )}

            {clientPaymentBarData && (
              <div className=" dark:bg-gray-800 p-4 ">
                <KPIBarChart
                  data={clientPaymentBarData}
                  title="Client-wise Payments"
                 className="h-[350px] w-full"
                />
              </div>
            )}
          </div> 

          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold">Recent Invoices</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Invoice No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Paid
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {invoiceData.slice(0, 5).map((invoice) => (
                    <tr key={invoice.invoice.invoice_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {invoice.invoice.invoice_no}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(invoice.invoice.invoice_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {invoice.invoice.client_name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {invoice.invoice.company_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {invoice.invoice.project_title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        ₹{parseFloat(invoice.invoice.final_amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ₹{parseFloat(invoice.invoice.paid_amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-600">
                        ₹{parseFloat(invoice.invoice.balance_amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            invoice.invoice.status === "paid"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : invoice.invoice.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {invoice.invoice.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${
                          new Date(invoice.invoice.due_date) < new Date() && 
                          parseFloat(invoice.invoice.balance_amount) > 0
                            ? "text-red-600 font-medium"
                            : "text-gray-500 dark:text-gray-300"
                        }`}>
                          {new Date(invoice.invoice.due_date).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!loading && clientSummaryData.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          {branchCode
            ? "No data available for selected branch"
            : "Please select a branch to view analytics"}
        </div>
      )}
    </div>
  );
};

export default AccountantDashboard;