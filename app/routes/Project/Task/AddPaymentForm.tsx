// import axios from "axios";
// import {
//   CalendarCheck,
//   ClipboardList,
//   Flag,
//   Hash,
//   Milestone,
//   Network,
//   Tag,
//   User2Icon,
//   ListChecks,
// } from "lucide-react";
// import { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
// import { useAuthStore } from "src/stores/authStore";
// import useClientStore from "src/stores/ClientStore";
// import useProjectStore from "src/stores/ProjectStore";
// import useBranchStore from "src/stores/useBranchStore";
// import useEmployeeStore from "src/stores/useEmployeeStore";
// import { BASE_URL } from "~/constants/api";

// const AddPaymentForm = ({ onSuccess, onCancel }) => {
//   const branchCodeOption = useBranchStore((state) => state.branchCodeOptions);
//   const clientcodeOptions = useClientStore((state) => state.clientscodeOptions);
//   const allProjectcodeOptions = useProjectStore(
//     (state) => state.allProjectcodeOptions
//   );
//   const milestonecodeOption = useProjectStore(
//     (state) => state.allMilestonecodeOptions
//   );
//   const employeeOption = useEmployeeStore(
//     (state) => state.branchEmployeeOptions
//   );

//   const token = useAuthStore((state) => state.accessToken);

//   const staff = useAuthStore((state) => state.staff_id);

//   const [employeeOptions, setEmployeeOptions] = useState<
//     { value: string; label: string }[]
//   >([]);


//   const [formData, setFormData] = useState({
//     branchcode: "",
//     client_code: "",
//     project_code: "",
//     milestone_code: "",
//     invoice_no: "",
//     request_id: "",
//     due_date: "",
//     milestone_amount: "",
//     paid_amount: "",
//     balance_amount: "",
//     sgst_percentage: "",
//     cgst_percentage: "",
//     sgst_amount: "",
//     cgst_amount: "",
//     discount: "",
//     round_off: "",
//     total_amount: "",
//     notes: "",
//     created_by : "",
//     status: "request",
//   });

//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // 👉 Calculation Effect (GST, Discount, Round Off, Balance)
//   useEffect(() => {
//     const milestoneAmount = parseFloat(formData.milestone_amount) || 0;
//     const paidAmount = parseFloat(formData.paid_amount) || 0;
//     const sgst = parseFloat(formData.sgst_percentage) || 0;
//     const cgst = parseFloat(formData.cgst_percentage) || 0;
//     const discount = parseFloat(formData.discount) || 0;
//     const roundOff = parseFloat(formData.round_off) || 0;

//     // Base amount = paid amount (or milestone if paid not given)
//     let baseAmount = paidAmount > 0 ? paidAmount : milestoneAmount;

//     // SGST & CGST amounts
//     let sgstAmount = (baseAmount * sgst) / 100;
//     let cgstAmount = (baseAmount * cgst) / 100;

//     // Gross amount
//     let grossAmount = baseAmount + sgstAmount + cgstAmount;

//     // Apply discount
//     let discounted = grossAmount - discount;

//     // Apply round off
//     let finalAmount = discounted + roundOff;

//     // Balance calculation
//     let balance = milestoneAmount - paidAmount;

//     setFormData((prev) => ({
//       ...prev,
//       sgst_amount: sgstAmount.toFixed(2),
//       cgst_amount: cgstAmount.toFixed(2),
//       total_amount: finalAmount.toFixed(2),
//       balance_amount: balance.toFixed(2),
//     }));
//   }, [
//     formData.milestone_amount,
//     formData.paid_amount,
//     formData.sgst_percentage,
//     formData.cgst_percentage,
//     formData.discount,
//     formData.round_off,
//   ]);

//   // 👉 Fetch employees by branch
//   useEffect(() => {
//     if (!formData.branchcode) {
//       setEmployeeOptions([]);
//       return;
//     }

//     async function fetchEmployees() {
//       try {
//         const res = await fetch(
//           `http://localhost:3000/api/getStaffbranch?branchcode=${encodeURIComponent(
//             formData.branchcode
//           )}`
//         );
//         const data = await res.json();

//         if (data?.status && Array.isArray(data.data)) {
//           const options = data.data.map((emp: any) => ({
//             value: emp.staff_id,
//             label: `${emp.firstname} ${emp.lastname} (${emp.designation})`,
//           }));
//           setEmployeeOptions(options);
//         } else {
//           setEmployeeOptions([]);
//         }
//       } catch (err) {
//         console.error("Error fetching employees:", err);
//         setEmployeeOptions([]);
//       }
//     }

//     fetchEmployees();
//   }, [formData.branchcode]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     // const payload = {
//     //   data: { ...formData },
//     // };

//     const payload = { ...formData };

//     try {
//       const response = await axios.post(
//         `${BASE_URL}/createpay`,
//         payload,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.status === 200) {
//         toast.success("Payment added successfully");
//         onSuccess();
//       } else {
//         setError(response.data.message || "Failed to add payment");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "An error occurred");
//       toast.error(err.response?.data?.message || "Error adding payment");
//     } finally {
//       setLoading(false);
//     }
//   };



//neew 
import axios from "axios";
import {
  CalendarCheck,
  ClipboardList,
  Flag,
  Hash,
  Milestone,
  Network,
  Tag,
  User2Icon,
  ListChecks,
} from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
import { useAuthStore } from "src/stores/authStore";
import useClientStore from "src/stores/ClientStore";
import useProjectStore from "src/stores/ProjectStore";
import useBranchStore from "src/stores/useBranchStore";
import useEmployeeStore from "src/stores/useEmployeeStore";
import { BASE_URL } from "~/constants/api";
import { useLocation } from "react-router-dom";

const AddPaymentForm = ({ onSuccess, onCancel }) => {
  const branchCodeOption = useBranchStore((state) => state.branchCodeOptions);
  const clientcodeOptions = useClientStore((state) => state.clientscodeOptions);
  const allProjectcodeOptions = useProjectStore(
    (state) => state.allProjectcodeOptions
  );
  const milestonecodeOption = useProjectStore(
    (state) => state.allMilestonecodeOptions
  );
  const employeeOption = useEmployeeStore(
    (state) => state.branchEmployeeOptions
  );

  const token = useAuthStore((state) => state.accessToken);
  const staff = useAuthStore((state) => state.staff_id);

  const [employeeOptions, setEmployeeOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [formData, setFormData] = useState({
    branchcode: "",
    client_code: "",
    project_code: "",
    milestone_code: "",
    invoice_no: "",
    request_id: "",
    due_date: "",
    milestone_amount: "",
    paid_amount: "",
    balance_amount: "",
    sgst_percentage: "",
    cgst_percentage: "",
    sgst_amount: "",
    cgst_amount: "",
    discount: "",
    round_off: "",
    total_amount: "",
    notes: "",
    created_by: "",
    status: "request",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 👉 Auto-populate based on URL (projectaccount or milestonepayment)
  useEffect(() => {
    const path = location.pathname.split("/").filter(Boolean); // ["projectaccount","02-fedra"]

    async function fetchData() {
      try {
        if (path[0] === "projectaccount") {
          const projectCode = path[1];

          const res = await axios.get(
            `${BASE_URL}/project/overview/read`,
            {
              headers: { Authorization: `Bearer ${token}` },
              params: { project_code: projectCode },
            }
          );

          if (res.data?.data?.length > 0) {
            const project = res.data.data[0];
            setFormData((prev) => ({
              ...prev,
              branchcode: project.branchcode || "",
              client_code: project.client_code || "",
              project_code: project.project_code || projectCode,
            }));
          }
        }

        if (path[0] === "milestonepayment") {
          const milestoneCode = path[1];

          const res = await axios.get(
            `${BASE_URL}/project/milestone/read`,
            {
              headers: { Authorization: `Bearer ${token}` },
              params: { milestone_code: milestoneCode },
            }
          );

          if (res.data?.data?.length > 0) {
            const milestone = res.data.data[0];
            setFormData((prev) => ({
              ...prev,
              branchcode: milestone.branchcode || "",
              client_code: milestone.client_code || "",
              project_code: milestone.project_code || "",
              milestone_code: milestone.milestone_code || milestoneCode,
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching project/milestone:", err);
      }
    }

    fetchData();
  }, [location, token]);

  // 👉 Calculation Effect (GST, Discount, Round Off, Balance)
  useEffect(() => {
    const milestoneAmount = parseFloat(formData.milestone_amount) || 0;
    const paidAmount = parseFloat(formData.paid_amount) || 0;
    const sgst = parseFloat(formData.sgst_percentage) || 0;
    const cgst = parseFloat(formData.cgst_percentage) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const roundOff = parseFloat(formData.round_off) || 0;

    let baseAmount = paidAmount > 0 ? paidAmount : milestoneAmount;

    let sgstAmount = (baseAmount * sgst) / 100;
    let cgstAmount = (baseAmount * cgst) / 100;

    let grossAmount = baseAmount + sgstAmount + cgstAmount;

    let discounted = grossAmount - discount;

    let finalAmount = discounted + roundOff;

    let balance = milestoneAmount - paidAmount;

    setFormData((prev) => ({
      ...prev,
      sgst_amount: sgstAmount.toFixed(2),
      cgst_amount: cgstAmount.toFixed(2),
      total_amount: finalAmount.toFixed(2),
      balance_amount: balance.toFixed(2),
    }));
  }, [
    formData.milestone_amount,
    formData.paid_amount,
    formData.sgst_percentage,
    formData.cgst_percentage,
    formData.discount,
    formData.round_off,
  ]);

  // 👉 Fetch employees by branch
  useEffect(() => {
    if (!formData.branchcode) {
      setEmployeeOptions([]);
      return;
    }

    async function fetchEmployees() {
      try {
        const res = await fetch(
          `${BASE_URL}/getStaffbranch?branchcode=${encodeURIComponent(
            formData.branchcode
          )}`
        );
        const data = await res.json();

        if (data?.status && Array.isArray(data.data)) {
          const options = data.data.map((emp: any) => ({
            value: emp.staff_id,
            label: `${emp.firstname} ${emp.lastname} (${emp.designation})`,
          }));
          setEmployeeOptions(options);
        } else {
          setEmployeeOptions([]);
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setEmployeeOptions([]);
      }
    }

    fetchEmployees();
  }, [formData.branchcode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { ...formData, created_by: staff };

    try {
      const response = await axios.post(`${BASE_URL}/createpay`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        toast.success("Payment added successfully");
        alert ("payment request added successfully!");
        onSuccess();
      } else {
        setError(response.data.message || "Failed to add payment");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      toast.error(err.response?.data?.message || "Error adding payment");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <Flag className="inline mr-2" /> Add Payment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Branch */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              <Hash className="inline mr-1" size={14} /> Branch Code
            </p>
            <select

              name="branchcode"
              value={formData.branchcode}
              onChange={handleChange}
              className="w-full bg-transparent text-sm mt-1 focus:outline-none"
              required
            >
              <option value="">Select Branch</option>
              {branchCodeOption?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Project */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              <Network className="inline mr-1" size={14} /> Project
            </p>
            <select
              name="project_code"
              value={formData.project_code}
              onChange={handleChange}
              className="w-full bg-transparent text-sm mt-1 focus:outline-none"
              required
            >
              <option value="">Select Project</option>
              {allProjectcodeOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Milestone */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              <Milestone className="inline mr-1" size={14} /> Milestone
            </p>
            <select
              name="milestone_code"
              value={formData.milestone_code}
              onChange={handleChange}
              className="w-full bg-transparent text-sm mt-1 focus:outline-none"
              required
            >
              {/*<option value="">Select Milestone</option>*/}
               {/* Show "Advance" option only if milestone_code is empty */}
  {formData.milestone_code === "" && formData.project_code && (
    <option value={`${formData.project_code}/advance`}>
      Advance
    </option>
  )}
              {milestonecodeOption?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Invoice No */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              <ClipboardList className="inline mr-1" size={14} /> Invoice No
            </p>
            <input
              type="text"
              name="invoice_no"
              value={formData.invoice_no}
              onChange={handleChange}
              className="w-full bg-transparent text-sm mt-1 focus:outline-none"
              placeholder="Enter Invoice No"
              required
            />
          </div>

          {/* Client */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              <User2Icon className="inline mr-1" size={14} /> Client
            </p>
            <select
              name="client_code"
              value={formData.client_code}
              onChange={handleChange}
              className="w-full bg-transparent text-sm mt-1 focus:outline-none"
            >
              <option value="">Select Client</option>
              {clientcodeOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              <CalendarCheck className="inline mr-1" size={14} /> Due Date
            </p>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full bg-transparent text-sm mt-1 focus:outline-none"
              required
            />
          </div>

          {/* Milestone Amount */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Milestone Amount
            </p>
            <input
              type="number"
              name="milestone_amount"
              value={formData.milestone_amount}
              onChange={handleChange}
              className="w-full bg-transparent text-sm mt-1 focus:outline-none"
              placeholder="Enter Amount"
              required
            />
          </div>

          {/* Paid Amount */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Paid Amount
            </p>
            <input
              type="number"
              name="paid_amount"
              value={formData.paid_amount}
              onChange={handleChange}
              className="w-full bg-transparent text-sm mt-1 focus:outline-none"
              placeholder="Enter Paid Amount"
            />
          </div>

          {/* SGST % */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              SGST %
            </p>
            <input
              type="number"
              name="sgst_percentage"
              value={formData.sgst_percentage}
              onChange={handleChange}
              className="w-full bg-transparent text-sm mt-1 focus:outline-none"
              placeholder="Enter SGST %"
            />
          </div>

          {/* SGST Amount */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              SGST Amount
            </p>
            <input
              type="number"
              name="sgst_amount"
              value={formData.sgst_amount}
              readOnly
              className="w-full bg-transparent text-sm mt-1 focus:outline-none font-semibold text-blue-600"
            />
          </div>

          {/* CGST % */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              CGST %
            </p>
            <input
              type="number"
              name="cgst_percentage"
              value={formData.cgst_percentage}
              onChange={handleChange}
              className="w-full bg-transparent text-sm mt-1 focus:outline-none"
              placeholder="Enter CGST %"
            />
          </div>

          {/* CGST Amount */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              CGST Amount
            </p>
            <input
              type="number"
              name="cgst_amount"
              value={formData.cgst_amount}
              readOnly
              className="w-full bg-transparent text-sm mt-1 focus:outline-none font-semibold text-blue-600"
            />
          </div>

          {/* Discount */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Discount
            </p>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="w-full bg-transparent text-sm mt-1 focus:outline-none"
              placeholder="Enter Discount"
            />
          </div>

          {/* Round Off */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Round Off
            </p>
            <input
              type="number"
              name="round_off"
              value={formData.round_off}
              onChange={handleChange}
              className="w-full bg-transparent text-sm mt-1 focus:outline-none"
              placeholder="Enter Round Off"
            />
          </div>

          {/* Total Amount */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Total Amount
            </p>
            <input
              type="number"
              name="total_amount"
              value={formData.total_amount}
              readOnly
              className="w-full bg-transparent text-sm mt-1 focus:outline-none font-semibold text-green-600"
            />
          </div>

          {/* Balance Amount */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Balance Amount
            </p>
            <input
              type="number"
              name="balance_amount"
              value={formData.balance_amount}
              readOnly
              className="w-full bg-transparent text-sm mt-1 focus:outline-none font-semibold text-purple-600"
            />
          </div>

          {/* Status */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              <Tag className="inline mr-1" size={14} /> Status
            </p>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-transparent text-sm mt-1 focus:outline-none"
              required
            >
              <option value="request">Request</option>
              <option value="paid">Paid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="completed">Completed</option>
              <option value="raised">Archived</option>
            </select>
          </div>
        </div>

        
<div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Created By
            </p>
            <input
              type="text"
              name="created_by"
              value={staff}
              readOnly
              className="w-full bg-transparent text-sm mt-1 focus:outline-none font-semibold text-purple-600"
            />
          </div>


        {/* Notes */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ListChecks size={18} /> Notes
          </h3>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full bg-gray-50 dark:bg-gray-700/70 rounded-lg p-2 text-sm"
            placeholder="Enter Notes"
          />
        </div>



        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-md shadow-sm disabled:opacity-70"
          >
            {loading ? <ButtonLoader /> : "Add Payment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPaymentForm;
