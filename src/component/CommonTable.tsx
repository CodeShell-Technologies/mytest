// import PropTypes from 'prop-types';

// const CommonTable = ({
//   thead,
//   tbody,
//   isSearch = false,
//   handleSearch,
//   searchPlaceholder = 'Search...',
//   className = '',
//   tableClassName = '',
//   isLoading = false,
//   noDataText ="No Data Found",
// }) => {
//   const headers = thead?.() || [];
//   const bodyData = tbody?.() || [];

//   return (
//     <div className={`w-full overflow-x-auto ${className}`}>
// {isSearch && (
//   <div className="mb-4 relative">
//     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//       <svg 
//         className="h-5 w-5 text-gray-400 dark:text-gray-500" 
//         fill="none" 
//         viewBox="0 0 24 24" 
//         stroke="currentColor"
//       >
//         <path 
//           strokeLinecap="round" 
//           strokeLinejoin="round" 
//           strokeWidth={2} 
//           d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
//         />
//       </svg>
//     </div>
//     <input
//       type="text"
//       placeholder={searchPlaceholder}
//       onChange={handleSearch}
//       className="
//         w-[100px] md:w-50 
//         pl-10 pr-4 py-2 
//         border border-gray-400 dark:border-red-700 
//         rounded-sm 
//         focus:outline-none focus:ring-1
//         bg-white dark:bg-gray-800 
//         text-gray-900 dark:text-gray-100 
//         placeholder-gray-400 dark:placeholder-gray-500
//         transition-all duration-200
//         shadow-sm 
//       "
//     />
//     {/* Optional clear button when input has value */}
//     {/* {value && (
//       <button 
//         onClick={() => handleSearch('')}
//         className="absolute inset-y-0 right-0 pr-3 flex items-center"
//       >
//         <svg 
//           className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400" 
//           fill="none" 
//           viewBox="0 0 24 24" 
//           stroke="currentColor"
//         >
//           <path 
//             strokeLinecap="round" 
//             strokeLinejoin="round" 
//             strokeWidth={2} 
//             d="M6 18L18 6M6 6l12 12" 
//           />
//         </svg>
//       </button>
//     )} */}
//   </div>
// )}
//       <table className={`w-full border-lg ${tableClassName}`}>
//         <thead className="bg-red-700 dark:bg-gray-700">
//           <tr>
//             {headers.map((header, index) => (
//               <th
//                 key={index}
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-50 dark:text-gray-30 uppercase tracking-wider"
//               >
//                 {header.data}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//           {isLoading ? (
//             <tr>
//               <td colSpan={headers.length} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
// loading...          
//     </td>
//             </tr>
//           ) : bodyData.length > 0 ? (
//             bodyData.map((row, rowIndex) => (
//               <tr
//                 key={rowIndex}
//                 className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//               >
//                 {row.data.map((cell, cellIndex) => (
//                   <td
//                     key={cellIndex}
//                     className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
//                   >
//                     {cell.data}
//                   </td>
//                 ))}
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={headers.length} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
//                 {noDataText}
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// CommonTable.propTypes = {
//   thead: PropTypes.func.isRequired,
//   tbody: PropTypes.func.isRequired,
//   isSearch: PropTypes.bool,
//   handleSearch: PropTypes.func,
//   searchPlaceholder: PropTypes.string,
//   className: PropTypes.string,
//   tableClassName: PropTypes.string,
//   isLoading: PropTypes.bool,
//   noDataText: PropTypes.node,
// };

// export default CommonTable;

import PropTypes from 'prop-types';
import * as LucideIcons from 'lucide-react'
const CommonTable = ({
  thead,
  tbody,
  isSearch = false,
  handleSearch,
  searchPlaceholder = 'Search...',
  className = '',
  tableClassName = '',
  isLoading = false,
  noDataText = "No Data Found",
  actionIcons = []
}) => {
  const headers = thead?.() || [];
  const bodyData = tbody?.() || [];
  const renderActionIcons = () => {
    return actionIcons.map((iconName, index) => {
      const IconComponent = LucideIcons[iconName];
      if (!IconComponent) return null;
      
      return (
        <button
          key={index}
          className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mx-1 ${
            iconName === 'Trash2' ? 'text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400' :
            iconName === 'Edit' ? 'text-yellow-600 hover:text-yellow-800 dark:text-yellow-500 dark:hover:text-yellow-400' :
            'text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400'
          }`}
          title={iconName}
        >
          <IconComponent className="h-5 w-5" />
        </button>
      );
    });
  };
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          
          {isSearch && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                  className="h-5 w-5 text-gray-400 dark:text-gray-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder={searchPlaceholder}
                onChange={handleSearch}
                className="
                  w-[150px] md:w-[200px]
                  pl-10 pr-4 py-2
                  border border-gray-400 dark:border-red-700
                  rounded-sm
                  focus:outline-none focus:ring-1
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                  placeholder-gray-400 dark:placeholder-gray-500
                  transition-all duration-200
                  shadow-sm
                "
              />
            </div>
          )}
        </div>


        <table className={`w-[100] border-lg ${tableClassName}`}>
          <thead className="bg-red-700 dark:bg-gray-700">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-50 dark:text-gray-300 uppercase tracking-wider"
                >
                  {header.data}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
Loading....                </td>
              </tr>
            ) : bodyData.length > 0 ? (
              bodyData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
         {row?.data.map((cell, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200 whitespace-nowrap"
                    >
                      {cellIndex === row.data.length - 1 && actionIcons.length > 0 ? (
                        <div className="flex items-center space-x-2">
                          {renderActionIcons()}
                        </div>
                      ) : (
                        cell.data
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
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

CommonTable.propTypes = {
  thead: PropTypes.func.isRequired,
  tbody: PropTypes.func.isRequired,
  isSearch: PropTypes.bool,
  handleSearch: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  className: PropTypes.string,
  tableClassName: PropTypes.string,
  isLoading: PropTypes.bool,
  noDataText: PropTypes.node,
  actionIcons: PropTypes.arrayOf(PropTypes.string)

};

export default CommonTable;
