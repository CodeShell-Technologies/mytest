// import PropTypes from "prop-types";
// import * as LucideIcons from 'lucide-react';
// import '../../app/app.css';

// const DataTable = ({
//   thead,
//   tbody,
//   isSearch = false,
//   handleSearch,
//   searchPlaceholder = "Search...",
//   className = "",
//   tableClassName = "",
//   isLoading = false,
//   noDataText = "No Data Found",
//   maxHeight = "400px", 
//    maxWidth = "100%",// Default max height for vertical scroll
// }) => {
//   const header = thead?.() || [];
//   const bodyData = tbody?.() || [];

//   return (
//     <div className={`w-full overflow-auto ${className}`}>
//       {/* {isSearch && (
//         <div className="mb-4 flex justify-end">
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <LucideIcons.Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
//             </div>
//             <input
//               type="text"
//               placeholder={searchPlaceholder}
//               onChange={(e) => handleSearch(e.target.value)}
//               className="
//                 w-full md:w-64
//                 pl-10 pr-4 py-2
//                 border border-gray-300 dark:border-gray-600
//                 rounded-md
//                 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-blue-500
//                 bg-white dark:bg-gray-800
//                 text-gray-900 dark:text-gray-100
//                 placeholder-gray-400 dark:placeholder-gray-500
//                 transition-all duration-200
//               "
//             />
//           </div>
//         </div>
//       )} */}

//       {/* Scrollable Table Container */}
//       <div 
//         className="overflow-auto scrollbar-color:_#cbd5e1_transparent] dark:[scrollbar-color:_#334155_transparent]"
//         style={{ 
//           maxHeight: maxHeight, 
//           overflowX: 'auto',
//           maxWidth:maxWidth   
//         }}
//       >
//         <table className={`w-full border-collapse ${tableClassName}`}>
//           {/* Table Header */}
//           <thead className="bg-[var(--color-primary)] dark:bg-red-800 sticky top-0 z-[5]">
//             <tr>
//               {header.map((header, index) => (
//                 <th 
//                   key={index} 
//                   className="px-6 py-3 text-left text-xs font-medium text-white dark:text-gray-200 uppercase tracking-wider"
//                 >
//                   {header.data}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           {/* Table Body */}
//           <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//             {isLoading ? (
//               <tr>
//                 <td colSpan={header.length} className="px-6 py-6 text-center text-gray-600 dark:text-gray-400 text-sm">
//                   Loading...
//                 </td>
//               </tr>
//             ) : bodyData?.length > 0 ? (
//               bodyData.map((row, rowIndex) => (
//                 <tr key={rowIndex} className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
//                   {row?.data.map((cell, cellIndex) => (
//                     <td 
//                       key={cellIndex} 
//                       className="px-6 py-2 text-sm text-gray-900 dark:text-gray-200 whitespace-nowrap"
//                     >
//                       {cell.data}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={header.length} className="px-4 py-5 text-center text-gray-600 dark:text-gray-400 text-sm">
//                   {noDataText}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// DataTable.propTypes = {
//   thead: PropTypes.func.isRequired,
//   tbody: PropTypes.func.isRequired,
//   isSearch: PropTypes.bool,
//   handleSearch: PropTypes.func,
//   searchPlaceholder: PropTypes.string,
//   className: PropTypes.string,
//   tableClassName: PropTypes.string,
//   isLoading: PropTypes.bool,
//   noDataText: PropTypes.node,
//   maxHeight: PropTypes.string, // Add prop for dynamic height control
// };

// export default DataTable;





import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import "../../app/app.css";

const DataTable = ({
  thead,
  tbody,
  className = "",
  tableClassName = "",
  isLoading = false,
  noDataText = "No Data Found",
  maxHeight = "400px",
  maxWidth = "100%",
  onRowDoubleClick,
  enableSorting = false,
  enableFilters = false,
}) => {
  const header = thead?.() || [];
  const bodyData = tbody?.() || [];

  // --- Sorting state ---
  const [sortConfig, setSortConfig] = useState<{ key: number; direction: "asc" | "desc" } | null>(null);

  const sortedData = useMemo(() => {
    if (!enableSorting || !sortConfig) return bodyData;

    const { key, direction } = sortConfig;
    return [...bodyData].sort((a, b) => {
      const aVal = a.data[key]?.data ?? "";
      const bVal = b.data[key]?.data ?? "";

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [bodyData, sortConfig, enableSorting]);

  const handleSort = (colIndex: number) => {
    if (!enableSorting) return;

    setSortConfig((prev) => {
      if (prev?.key === colIndex) {
        // toggle asc <-> desc
        return { key: colIndex, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key: colIndex, direction: "asc" };
    });
  };

  // --- Filters state ---
  const [filters, setFilters] = useState<{ [key: number]: string }>({});

  const filteredData = useMemo(() => {
    if (!enableFilters) return sortedData;

    return sortedData.filter((row) =>
      row.data.every((cell, i) => {
        const filterValue = filters[i];
        if (!filterValue) return true;
        return String(cell.data).toLowerCase().includes(filterValue.toLowerCase());
      })
    );
  }, [sortedData, filters, enableFilters]);

  return (
    <div className={`w-full overflow-auto ${className}`}>
      <div
        className="overflow-auto scrollbar-color:_#cbd5e1_transparent] dark:[scrollbar-color:_#334155_transparent]"
        style={{
          maxHeight,
          overflowX: "auto",
          maxWidth,
        }}
      >
        <table className={`w-full border-collapse ${tableClassName}`}>
          {/* Table Header */}
          <thead className="bg-[var(--color-primary)] dark:bg-red-800 sticky top-0 z-[5]">
            <tr>
              {header.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-white dark:text-gray-200 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort(index)}
                >
                  {header.data}
                  {enableSorting &&
                    sortConfig?.key === index &&
                    (sortConfig.direction === "asc" ? " ▲" : " ▼")}
                </th>
              ))}
            </tr>

            {/* Filter Row */}
            {enableFilters && (
              <tr className="bg-gray-100 dark:bg-gray-700">
                {header.map((_, index) => (
                  <th key={index} className="px-6 py-2">
                    <input
                      type="text"
                      placeholder="Filter..."
                      value={filters[index] || ""}
                      onChange={(e) =>
                        setFilters({ ...filters, [index]: e.target.value })
                      }
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-200"
                    />
                  </th>
                ))}
              </tr>
            )}
          </thead>

          {/* Table Body */}
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td
                  colSpan={header.length}
                  className="px-6 py-6 text-center text-gray-600 dark:text-gray-400 text-sm"
                >
                  Loading...
                </td>
              </tr>
            ) : filteredData?.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onDoubleClick={() => onRowDoubleClick?.(row)}
                >
                  {row?.data.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-6 py-2 text-sm text-gray-900 dark:text-gray-200 whitespace-nowrap"
                    >
                      {cell.data}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={header.length}
                  className="px-4 py-5 text-center text-gray-600 dark:text-gray-400 text-sm"
                >
                  {noDataText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

DataTable.propTypes = {
  thead: PropTypes.func.isRequired,
  tbody: PropTypes.func.isRequired,
  className: PropTypes.string,
  tableClassName: PropTypes.string,
  isLoading: PropTypes.bool,
  noDataText: PropTypes.node,
  maxHeight: PropTypes.string,
  maxWidth: PropTypes.string,
  onRowDoubleClick: PropTypes.func,
  enableSorting: PropTypes.bool,
  enableFilters: PropTypes.bool,
};

export default DataTable;
