// // components/JoiningLetter.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { LogOut } from "lucide-react";
// import alminoLogo from "../../../assets/Almino structural consultancy_Final.png";
// import alminoSeal from "../../../assets/almino seal.png";
// import { BASE_URL } from "~/constants/api";
// import axios from "axios";

// const ViewJoiningLetter = () => {
//   const navigate = useNavigate();
//   const [employee, setEmployee] = useState(null);
//   const componentRef = useRef();
//   const { id } = useParams();
//   const staff_id = decodeURIComponent(id);
//   console.log("employeeid", id, staff_id);
 

// const fetchEmployee = async () => {
//   try {
//     const response = await axios.post(`${BASE_URL}/users/profile`, {
//       staff_id: staff_id,
//     }, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     console.log("dataemployee", response?.data?.data);
//     setEmployee(response.data.data);
//   } catch (error) {
//     console.error("Error in get staff details", error);
//   }
// };

//   useEffect(()=>{
//     fetchEmployee()
//   },[staff_id])
//   // useEffect(() => {
//   //   const fetchEmployeeData = async () => {
//   //     try {
//   //       const response = await fetch(`${BASE_URL}/users/profile`, {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({ staff_id: staff_id }),
//   //       });
//   //       console.log("dataaemployee", response);
//   //       if (!response.ok) {
//   //         throw new Error("Failed to fetch employee data");
//   //       }

//   //       const data = await response.json();
//   //       setEmployee(data.data);
//   //     } catch (err) {
//   //       console.log("error in get staff details", error);
//   //     }
//   //   };

//   //   fetchEmployeeData();
//   // }, [id]);
//   const handlePrint = () => {
//     const printContent = document.getElementById("print").innerHTML;
//     const originalContent = document.body.innerHTML;

//     const style = `
//       <style>
//         @media print {
//           @page {
//             margin-bottom: 0;
//           }
//           body { 
//             margin: 1cm;
//           }
//           header, footer, .no-print { 
//             display: none !important; 
//           }
//           a[href]:after {
//             content: none !important;
//           }
//           #print {
//             position: relative;
//             width: 100%;
//             height: 100%;
//           }
//         }
//       </style>
//     `;

//     document.body.innerHTML = style + printContent;
//     window.print();
//     window.onafterprint = () => {
//       document.body.innerHTML = originalContent;
//       window.location.reload();
//     };
//   };

//   const handleGoBack = () => {
//     navigate(-1);
//   };

//   return (
//     <div className="p-6 print:p-0">
//       <div className="flex justify-between">
//         <button
//           onClick={handlePrint}
//           className="mb-4 px-4 py-2 bg-red-700 text-white rounded shadow print:hidden"
//         >
//           Print Joining Letter
//         </button>
//         <button
//           className="text-gray-500 bg-gray-200 px-4 py-2 rounded-lg mt-3"
//           onClick={handleGoBack}
//         >
//           <LogOut className="inline rotate-180 text-gray-500 mr-3" />
//           Go Back
//         </button>
//       </div>

//       <div
//         ref={componentRef}
//         className="relative bg-white text-black p-10 w-[794px] mx-auto border border-red-500 text-[14px] font-serif"
//         id="print"
//       >
//         <img
//           src={alminoLogo}
//           alt="Watermark"
//           className="absolute opacity-10 z-0 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] pointer-events-none"
//         />

//         <div className="relative z-10">
//           <div className="flex justify-between items-center mb-4 border-b border-gray-400 pb-4">
//             <img src={alminoLogo} alt="Almino Logo" className="h-20" />
//             <div className="text-right text-sm">
//               <p className="font-bold text-lg">
//                 ALMINO STRUCTURAL CONSULTANCY PVT LTD
//               </p>
//               <p className="text-red-500 font-semibold">
//                 GST NO : 33AASCA3262R1Z2
//               </p>
//             </div>
//           </div>

//           <div className="text-center mb-4">
//             <h2 className="text-xl font-bold underline">JOINING LETTER</h2>
//             <p className="text-sm mt-1">GET NO: 330A562A0508172</p>
//           </div>

//           <p>To,</p>
//           <p className="font-semibold">
//             {employee.basic.firstname} {employee.basic.lastname}
//           </p>
//           <p>
//             {employee.basic.presentaddress ||
//               employee.basic.permanentaddress ||
//               "Address not specified"}
//           </p>

//           <p className="mt-6 font-semibold">
//             Subject: Joining Letter for the Position of{" "}
//             {employee.basic.designation}
//           </p>

//           <p className="mt-4">Dear {employee.basic.firstname},</p>
//           <p className="mt-2 text-justify">
//             We are pleased to confirm your appointment as{" "}
//             <strong>{employee.basic.designation}</strong> at Almino Structural
//             Consultancy Pvt Ltd, effective from{" "}
//             <strong>
//               {employee.basic.dateofjoining
//                 ? new Date(employee.basic.dateofjoining).toLocaleDateString()
//                 : "your joining date"}
//             </strong>
//             .
//           </p>

//           <div className="mt-4">
//             <p>
//               <strong>Employee ID:</strong> {employee.basic.staff_id}
//             </p>
//             <p>
//               <strong>Department:</strong> {employee.basic.department}
//             </p>
//             <p>
//               <strong>Designation:</strong> {employee.basic.designation}
//             </p>
//             <p>
//               <strong>Reporting To:</strong> Team Lead / Manager
//             </p>
//             <p>
//               <strong>Location:</strong> Company Branch
//             </p>
//           </div>

//           <div className="mt-4">
//             <p className="underline font-semibold">Compensation Details:</p>
//             {employee.salary && employee.salary.length > 0 ? (
//               <ul className="list-disc list-inside ml-4">
//                 <li>
//                   <strong>Basic Salary:</strong> ₹
//                   {employee.salary[0].basicsalary}
//                 </li>
//                 <li>
//                   <strong>HRA:</strong> ₹{employee.salary[0].hra}
//                 </li>
//                 <li>
//                   <strong>Other Allowances:</strong> ₹
//                   {employee.salary[0].other_allowance}
//                 </li>
//                 <li>
//                   <strong>Gross Salary:</strong> ₹
//                   {employee.salary[0].gross_salary}
//                 </li>
//               </ul>
//             ) : (
//               <p>Salary details not available</p>
//             )}
//           </div>

//           <p className="mt-4 text-justify">
//             Your employment will be subject to the terms and conditions outlined
//             in the company's HR policies. Please review the employee handbook
//             for detailed information about your benefits, leave policies, and
//             other employment terms.
//           </p>

//           <p className="mt-4 text-justify">
//             We are excited to have you on board and look forward to a successful
//             and productive association. If you have any questions, please feel
//             free to contact the HR department.
//           </p>

//           <p className="mt-6">Sincerely,</p>
//           <p className="mt-2 font-semibold">HR Manager</p>
//           <p>Almino Structural Consultancy Pvt Ltd</p>

//           <div className="mt-10 text-right">
//             <img src={alminoSeal} alt="Company Seal" className="h-20 inline" />
//           </div>

//           <footer className="text-sm mt-10 border-t border-gray-300 pt-3">
//             <div className="flex justify-between">
//               <div>
//                 <p className="text-red-600">
//                   📞 +91 95977 46657
//                   <br />
//                   📞 +91 97865 81307
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p>📍 Near King's Palace, Old Check Post,</p>
//                 <p>Pattinamkathan, Ramanathapuram - 623503</p>
//                 <p>📧 alminostructure@gmail.com</p>
//               </div>
//             </div>
//           </footer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewJoiningLetter;
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LogOut, Loader2 } from "lucide-react";
import alminoLogo from "../../../assets/Almino structural consultancy_Final.png";
import alminoSeal from "../../../assets/almino seal.png";
import { BASE_URL } from "~/constants/api";
import axios from "axios";

const ViewJoiningLetter = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const componentRef = useRef();
  const { id } = useParams();
  const staff_id = decodeURIComponent(id);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/users/profile`, {
        staff_id: staff_id,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data && response.data.data) {
        setEmployee(response.data.data);
      } else {
        throw new Error("No employee data found");
      }
    } catch (error) {
      console.error("Error in get staff details", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [staff_id]);

  const handlePrint = () => {
    const printContent = document.getElementById("print").innerHTML;
    const originalContent = document.body.innerHTML;

    const style = `
      <style>
        @media print {
          @page {
            margin-bottom: 0;
          }
          body { 
            margin: 1cm;
          }
          header, footer, .no-print { 
            display: none !important; 
          }
          a[href]:after {
            content: none !important;
          }
          #print {
            position: relative;
            width: 100%;
            height: 100%;
          }
        }
      </style>
    `;

    document.body.innerHTML = style + printContent;
    window.print();
    window.onafterprint = () => {
      document.body.innerHTML = originalContent;
      window.location.reload();
    };
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-red-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-800 text-lg">No employee data available</div>
      </div>
    );
  }

  return (
    <div className="p-6 print:p-0">
      <div className="flex justify-between">
        <button
          onClick={handlePrint}
          className="mb-4 px-4 py-2 bg-red-700 text-white rounded shadow print:hidden"
        >
          Print Joining Letter
        </button>
        <button
          className="text-gray-500 bg-gray-200 px-4 py-2 rounded-lg mt-3"
          onClick={handleGoBack}
        >
          <LogOut className="inline rotate-180 text-gray-500 mr-3" />
          Go Back
        </button>
      </div>

      <div
        ref={componentRef}
        className="relative bg-white text-black p-10 w-[794px] mx-auto  text-[14px] font-serif"
        id="print"
      >
        <img
          src={alminoLogo}
          alt="Watermark"
          className="absolute opacity-10 z-0 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] pointer-events-none"
        />

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4 border-b border-gray-400 pb-4">
            <img src={alminoLogo} alt="Almino Logo" className="h-20" />
            <div className="text-right text-sm">
              <p className="font-bold text-lg">
                ALMINO STRUCTURAL CONSULTANCY PVT LTD
              </p>
              <p className="text-red-500 font-semibold">
                GST NO : 33AASCA3262R1Z2
              </p>
            </div>
          </div>

          <div className="text-center mb-4">
            <h2 className="text-xl font-bold underline">JOINING LETTER</h2>
            <p className="text-sm mt-1">GET NO: 330A562A0508172</p>
          </div>

          <p>To,</p>
          <p className="font-semibold">
            {employee.basic.firstname} {employee.basic.lastname}
          </p>
          <p>
            {employee.basic.presentaddress ||
              employee.basic.permanentaddress ||
              "Address not specified"}
          </p>

          <p className="mt-6 font-semibold">
            Subject: Joining Letter for the Position of{" "}
            {employee.basic.designation}
          </p>

          <p className="mt-4">Dear {employee.basic.firstname},</p>
          <p className="mt-2 text-justify">
            We are pleased to confirm your appointment as{" "}
            <strong>{employee.basic.designation}</strong> at Almino Structural
            Consultancy Pvt Ltd, effective from{" "}
            <strong>
              {employee.basic.dateofjoining
                ? new Date(employee.basic.dateofjoining).toLocaleDateString()
                : "your joining date"}
            </strong>
            .
          </p>

          <div className="mt-4">
            <p>
              <strong>Employee ID:</strong> {employee.basic.staff_id}
            </p>
            <p>
              <strong>Department:</strong> {employee.basic.department}
            </p>
            <p>
              <strong>Designation:</strong> {employee.basic.designation}
            </p>
            <p>
              <strong>Reporting To:</strong> Team Lead / Manager
            </p>
            <p>
              <strong>Location:</strong> Company Branch
            </p>
          </div>

          <div className="mt-4">
            <p className="underline font-semibold">Compensation Details:</p>
            {employee.salary && employee.salary.length > 0 ? (
              <ul className="list-disc list-inside ml-4">
                <li>
                  <strong>Basic Salary:</strong> ₹
                  {employee.salary[0].basicsalary}
                </li>
                <li>
                  <strong>HRA:</strong> ₹{employee.salary[0].hra}
                </li>
                <li>
                  <strong>Other Allowances:</strong> ₹
                  {employee.salary[0].other_allowance}
                </li>
                <li>
                  <strong>Gross Salary:</strong> ₹
                  {employee.salary[0].gross_salary}
                </li>
              </ul>
            ) : (
              <p>Salary details not available</p>
            )}
          </div>

          <p className="mt-4 text-justify">
            Your employment will be subject to the terms and conditions outlined
            in the company's HR policies. Please review the employee handbook
            for detailed information about your benefits, leave policies, and
            other employment terms.
          </p>

          <p className="mt-4 text-justify">
            We are excited to have you on board and look forward to a successful
            and productive association. If you have any questions, please feel
            free to contact the HR department.
          </p>

          <p className="mt-6">Sincerely,</p>
          <p className="mt-2 font-semibold">HR Manager</p>
          <p>Almino Structural Consultancy Pvt Ltd</p>

          <div className="mt-10 text-right">
            <img src={alminoSeal} alt="Company Seal" className="h-20 inline" />
          </div>

          <footer className="text-sm mt-10 border-t border-gray-300 pt-3">
            <div className="flex justify-between">
              <div>
                <p className="text-red-600">
                  📞 +91 95977 46657
                  <br />
                  📞 +91 97865 81307
                </p>
              </div>
              <div className="text-right">
                <p>📍 Near King's Palace, Old Check Post,</p>
                <p>Pattinamkathan, Ramanathapuram - 623503</p>
                <p>📧 alminostructure@gmail.com</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ViewJoiningLetter;