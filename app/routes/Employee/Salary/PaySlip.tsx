import { BackpackIcon, ChevronLeft, ChevronLeftCircleIcon, LogIn, LogOut, LucideChevronLeftCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";
// import pkg from "react-to-print";
// const { useReactToPrint } = pkg;
// import { Printer, Download } from "lucide-react";

const Payslip = () => {
  const payslipRef = React.useRef<HTMLDivElement>(null);
const navigate=useNavigate();
  // const handlePrint = useReactToPrint({
  //   content: () => payslipRef.current,
  //   pageStyle: `
  //     @page { size: A4; margin: 10mm; }
  //     @media print {
  //       body { -webkit-print-color-adjust: exact; }
  //       .no-print { display: none !important; }
  //       .payslip-container { box-shadow: none; border: none; }
  //     }
  //   `,
  // });

  // const handleDownload = () => {
  //   alert("PDF download functionality would be implemented here");
  // };

  // Sample data - replace with your actual data
  const employeeData = {
    name: "John Doe",
    employeeId: "EMP-2023-001",
    designation: "Senior Software Engineer",
    department: "Development",
    bankAccount: "XXXXXX7890",
    panNumber: "ABCDE1234F",
    joiningDate: "15/03/2020",
    payPeriod: "June 2023",
    paymentDate: "30/06/2023",
  };

  const salaryDetails = {
    basic: 10000,
    hra: 22500,
    da: 11250,
    specialAllowance: 15000,
    medicalAllowance: 1250,
    conveyanceAllowance: 5000,
    otherAllowances: 0,
    totalEarnings: 15000,
    pf: 1800,
    professionalTax: 200,
    tds: 4500,
    otherDeductions: 0,
    totalDeductions: 500,
    netPay: 14500,
    inWords: "Fourteen Thousand five Hundred Only",
  };

  const handleGoBack = () => {
    navigate(-1); // -1 goes back one page in history
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6 no-print">
        <button className="text-gray-500 bg-gray-200 px-3 py-2 rounded-lg" onClick={handleGoBack}>
          <LogOut className="inline rotate-180 text-gray-500 mr-3"/>Go Back
        </button>
        <h1 className="text-2xl font-bold text-gray-600">Salary Slip</h1>
        <div className="flex gap-4">
          {/* <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <Printer size={18} /> Print
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            <Download size={18} /> Download PDF
          </button> */}
        </div>
      </div>
      

      <div
        ref={payslipRef}
        className="payslip-container bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto border border-gray-200"
      >
        {/* Company Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-red-700">Almino Structural Consultancy</h2>
          <p className="text-gray-600">123 Business Park, City - 600001</p>
          <p className="text-gray-600">GSTIN: 22AAAAA0000A1Z5</p>
        </div>

        {/* Payslip Title */}
        <div className="border-b-2 border-gray-300 pb-4 mb-6">
          <h3 className="text-2xl font-semibold text-center text-gray-800">
            SALARY SLIP
          </h3>
          <p className="text-center text-gray-600">{employeeData.payPeriod}</p>
        </div>

        {/* Employee Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              Employee Details
            </h4>
            <div className="space-y-1">
              <p>
                <span className="font-medium">Name:</span> {employeeData.name}
              </p>
              <p>
                <span className="font-medium">Employee ID:</span>{" "}
                {employeeData.employeeId}
              </p>
              <p>
                <span className="font-medium">Designation:</span>{" "}
                {employeeData.designation}
              </p>
              <p>
                <span className="font-medium">Department:</span>{" "}
                {employeeData.department}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              Payment Details
            </h4>
            <div className="space-y-1">
              <p>
                <span className="font-medium">Bank Account:</span>{" "}
                {employeeData.bankAccount}
              </p>
              <p>
                <span className="font-medium">PAN Number:</span>{" "}
                {employeeData.panNumber}
              </p>
              <p>
                <span className="font-medium">Joining Date:</span>{" "}
                {employeeData.joiningDate}
              </p>
              <p>
                <span className="font-medium">Payment Date:</span>{" "}
                {employeeData.paymentDate}
              </p>
            </div>
          </div>
        </div>

        {/* Salary Details */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">
            Salary Details
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b border-r border-gray-300 text-left">
                    Earnings
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 text-right">
                    Amount (₹)
                  </th>
                  <th className="py-2 px-4 border-b border-l border-r border-gray-300 text-left">
                    Deductions
                  </th>
                  <th className="py-2 px-4 border-b border-gray-300 text-right">
                    Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b border-r border-gray-300">
                    Basic Salary
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 text-right">
                    {salaryDetails.basic.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b border-l border-r border-gray-300">
                    Provident Fund
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 text-right">
                    {salaryDetails.pf.toLocaleString()}
                  </td>
                </tr>
    
                <tr>
                  <td className="py-2 px-4 border-b border-r border-gray-300">
                    Food Allowance
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 text-right">
                    {salaryDetails.conveyanceAllowance.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b border-l border-r border-gray-300"></td>
                  <td className="py-2 px-4 border-b border-gray-300 text-right"></td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-r border-gray-300">
                    Other Allowances
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 text-right">
                    {salaryDetails.otherAllowances.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b border-l border-r border-gray-300"></td>
                  <td className="py-2 px-4 border-b border-gray-300 text-right"></td>
                </tr>
                <tr className="font-semibold">
                  <td className="py-2 px-4 border-b border-r border-gray-300">
                    Total Earnings
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 text-right">
                    {salaryDetails.totalEarnings.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b border-l border-r border-gray-300">
                    Total Deductions
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 text-right">
                    {salaryDetails.totalDeductions.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Net Pay */}
        <div className="flex justify-between items-center mb-8 p-4 bg-gray-100 rounded">
          <div>
            <p className="font-semibold">Net Pay (In Words):</p>
            <p className="italic">{salaryDetails.inWords}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Net Payable Amount:</p>
            <p className="text-2xl font-bold">
              ₹ {salaryDetails.netPay.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-4 border-t border-gray-300">
          <div className="text-center">
            <p className="font-medium">Employee Signature</p>
            <div className="h-16"></div>
          </div>
          <div className="text-center">
            <p className="font-medium">For Almino Structural Consultancy</p>
            <div className="h-16"></div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 mt-8">
          <p>This is a system generated payslip and does not require signature</p>
          <p className="mt-1">For any queries, please contact HR Department</p>
        </div>
      </div>
    </div>
  );
};

export default Payslip;