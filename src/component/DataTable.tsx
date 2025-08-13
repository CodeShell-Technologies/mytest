import PropTypes from "prop-types";
import * as LucideIcons from 'lucide-react';
import '../../app/app.css';

const DataTable = ({
  thead,
  tbody,
  isSearch = false,
  handleSearch,
  searchPlaceholder = "Search...",
  className = "",
  tableClassName = "",
  isLoading = false,
  noDataText = "No Data Found",
  maxHeight = "400px", 
   maxWidth = "100%",// Default max height for vertical scroll
}) => {
  const header = thead?.() || [];
  const bodyData = tbody?.() || [];

  return (
    <div className={`w-full overflow-auto ${className}`}>
      {/* {isSearch && (
        <div className="mb-4 flex justify-end">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LucideIcons.Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => handleSearch(e.target.value)}
              className="
                w-full md:w-64
                pl-10 pr-4 py-2
                border border-gray-300 dark:border-gray-600
                rounded-md
                focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-blue-500
                bg-white dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
                transition-all duration-200
              "
            />
          </div>
        </div>
      )} */}

      {/* Scrollable Table Container */}
      <div 
        className="overflow-auto scrollbar-color:_#cbd5e1_transparent] dark:[scrollbar-color:_#334155_transparent]"
        style={{ 
          maxHeight: maxHeight, 
          overflowX: 'auto',
          maxWidth:maxWidth   
        }}
      >
        <table className={`w-full border-collapse ${tableClassName}`}>
          {/* Table Header */}
          <thead className="bg-[var(--color-primary)] dark:bg-red-800 sticky top-0 z-[5]">
            <tr>
              {header.map((header, index) => (
                <th 
                  key={index} 
                  className="px-6 py-3 text-left text-xs font-medium text-white dark:text-gray-200 uppercase tracking-wider"
                >
                  {header.data}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={header.length} className="px-6 py-6 text-center text-gray-600 dark:text-gray-400 text-sm">
                  Loading...
                </td>
              </tr>
            ) : bodyData?.length > 0 ? (
              bodyData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
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
                <td colSpan={header.length} className="px-4 py-5 text-center text-gray-600 dark:text-gray-400 text-sm">
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
  isSearch: PropTypes.bool,
  handleSearch: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  className: PropTypes.string,
  tableClassName: PropTypes.string,
  isLoading: PropTypes.bool,
  noDataText: PropTypes.node,
  maxHeight: PropTypes.string, // Add prop for dynamic height control
};

export default DataTable;