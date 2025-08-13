const AddSalaryRevision = ({ onCancel }) => {
  return (
    <>
      <div className="text-medium dark:bg-gray-800 dark:text-gray-200">
        <div className="text-medium flex gap-5">
          <div className="flex flex-col py-2 text-left mt-1">
            <label
              htmlFor=""
              className="text-sm text-gray-700 dark:text-gray-300 mb-3"
            >
              Employee Name
            </label>
            <input
              className=" bg-blue-200/25  w-[300px] dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
              type="text"
            />
          </div>

          <div className="flex flex-col py-2 text-left mt-1">
            <label
              htmlFor=""
              className="text-sm text-gray-700 dark:text-gray-300 mb-3"
            >
              Department
            </label>
            <input
              className=" bg-blue-200/25  w-[300px] dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
              type="text"
            />
          </div>
        </div>
        <div>
          <div className="text-medium flex gap-5">
            <div className="flex flex-col py-2 text-left mt-1">
              <label
                htmlFor=""
                className="text-sm text-gray-700 dark:text-gray-300 mb-3"
              >
                Designation
              </label>
              <input
                className=" bg-blue-200/25  w-[300px] dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                type="text"
              />
            </div>
            
            <div className="flex flex-col py-2 text-left mt-1 w-[300px] ">
              <label
                htmlFor=""
                className="text-sm text-gray-700 dark:text-gray-300 mb-3 "
              >
                Current Salary
              </label>
              <input
                className=" bg-blue-200/25  w-[300px] dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                type="text"
              />
            </div>
          </div>
        </div>
    
        <div className="text-medium sm:flex justify-between">
             <div className="flex flex-col py-2 text-left mt-1 w-[180px]">
            <label
              htmlFor=""
              className="text-sm text-gray-700 dark:text-gray-300 mb-3"
            >
              Proposed Salary
            </label>
            <input
              className="  bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
              type="text"
            />
          </div>
          <div className="flex flex-col py-2 text-left mt-1 w-[180px]">
            <label
              htmlFor=""
              className="text-sm text-gray-700 dark:text-gray-300 mb-3"
            >
              Increment Percentage
            </label>
            <input
              className="  bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
              type="text"
            />
          </div>
          <div className="flex flex-col py-2 text-left mt-1 w-[180px]">
            <label
              htmlFor=""
              className="text-sm text-gray-700 dark:text-gray-300 mb-3"
            >
              Requested By
            </label>
            <input
              className="  bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
              type="text"
            />
          </div>
        </div>
        <div className="text-medium sm:flex gap-5">
          <div className="flex flex-col py-2 text-left mt-1">
            <label
              htmlFor=""
              className="text-sm text-gray-700 dark:text-gray-300 mb-3"
            >
              Status
            </label>
            <input className="max-w-full w-[300px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            className="px-4 py-2 bg-red-700/20 text-red-700 hover-effect  dark:text-gray-700 rounded hover:bg-red-700/15 dark:hover:bg-gray-500 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-hover)]  text-white rounded hover:bg-gradient-to-b hover-effect transition"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};
export default AddSalaryRevision;
