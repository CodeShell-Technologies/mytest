import React, { useState, useEffect } from "react";
import DataTable from "src/component/DataTable";
import CustomPagination from "src/component/CustomPagination";
import SearchInput from "src/component/SearchInput";
import Modal from "src/component/Modal";
import Dropdown from "src/component/DrapDown";
import { FileDown, Eye, Plus } from "lucide-react";
import * as XLSX from "xlsx";
import toast, { Toaster } from "react-hot-toast";
import { useMediaQuery } from "~/routes/hooks/use-click-outside";
import { useNavigate } from "react-router-dom";

const OfferLettersGenerative = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pageSize, setPageSize] = useState(8);
  const [showFilters, setShowFilters] = useState(false);
  const [sheetData, setSheetData] = useState([]);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "",
    location: "",
    startDate: "",
    monthlySalary: "",
    otherAllowances: "",
    contactEmail: "",
    contactPhone: "",
  });

  const pageSizeOptions = [
    { value: 20, label: "20 per page" },
    { value: 40, label: "30 per page" },
    { value: 50, label: "40 per page" },
    { value: 80, label: "50 per page" },
    { value: 100, label: "100 per page" },
    { value: 200, label: "100 per page" },
  ];

  // Load saved offer letters from localStorage
  useEffect(() => {
    const savedLetters = localStorage.getItem("offerLetters");
    if (savedLetters) {
      const letters = JSON.parse(savedLetters);
      setData(letters);
      setSheetData(letters);
      setTotalItem(letters.length);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOfferLetter = {
      ...formData,
      id: Date.now().toString(),
      generatedDate: new Date().toISOString(),
    };
    
    const updatedLetters = [...data, newOfferLetter];
    setData(updatedLetters);
    setSheetData(updatedLetters);
    setTotalItem(updatedLetters.length);
    localStorage.setItem("offerLetters", JSON.stringify(updatedLetters));
    
    // Reset form
    setFormData({
      name: "",
      position: "",
      department: "",
      location: "",
      startDate: "",
      monthlySalary: "",
      otherAllowances: "",
      contactEmail: "",
      contactPhone: "",
    });
    
    setShowCreateModal(false);
    toast.success("Offer letter generated successfully!");
  };

  const viewOfferLetter = (id) => {
    navigate(`/offer-letter-view/${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handleOnExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, "OfferLetters");
    XLSX.writeFile(wb, "OfferLetters.xlsx");
  };

  // Filter data based on search term
  const filteredData = data.filter(letter =>
    letter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    letter.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    letter.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const thead = () => [
    { data: "#" },
    { data: "Candidate Name" },
    { data: "Position" },
    { data: "Department" },
    { data: "Location" },
    { data: "Generated Date" },
    { data: "Actions", className: "text-center" },
  ];

  const tbody = () => {
    return paginatedData.map((letter, index) => ({
      id: letter.id,
      data: [
        { data: index + 1 + (currentPage - 1) * pageSize },
        { data: letter.name },
        { data: letter.position },
        { data: letter.department },
        { data: letter.location },
        { 
          data: new Date(letter.generatedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        },
        {
          data: (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => viewOfferLetter(letter.id)}
                className="p-1 text-blue-600 rounded hover:text-gray-500 dark:hover:text-gray-300"
                title="View Offer Letter"
              >
                <Eye size={18} />
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
              Offer Letter Management
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
          <Toaster position="top-right" reverseOrder={false} />

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
                onClick={handleOnExport}
                className="flex items-center justify-center text-gray-400 bg-white focus:outline-non font-medium text-sm rounded-sm border border-dotted border-gray-400 hover:text-red-700/70 px-3 dark:bg-gray-800 dark:text-gray-300 py-2.5"
              >
                <FileDown className="mr-1" />
                {!isMobile && "Export Excel"}
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center text-white bg-[var(--color-primary)] hover-effect dark:bg-red-800 focus:outline-non font-medium text-sm rounded-sm px-5 py-2.5"
              >
                {!isMobile && "New Offer Letter"} <Plus className="ml-1" size={18} />
              </button>
            </div>
          </div>

          <div
            className={`${isMobile && !showFilters ? "hidden" : "block"} mb-4`}
          >
            <div
              className={`${isMobile ? "grid grid-cols-1 gap-3" : "flex justify-between items-center gap-3"}`}
            >
              <div className={`${isMobile ? "w-full" : "w-[300px]"}`}>
                <SearchInput
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search offer letters..."
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
            total={filteredData.length}
            currentPage={currentPage}
            defaultPageSize={pageSize}
            onChange={handlePageChange}
            paginationLabel="offer letters"
            isScroll={true}
          />
        </div>
      </div>

      {/* Create Offer Letter Modal */}
      <Modal
        isVisible={showCreateModal}
        className="w-full md:w-[800px]"
        onClose={() => setShowCreateModal(false)}
        title="Create New Offer Letter"
      >
        <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
                Candidate Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Monthly Salary
                  </label>
                  <input
                    type="text"
                    name="monthlySalary"
                    value={formData.monthlySalary}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Other Allowances
                  </label>
                  <input
                    type="text"
                    name="otherAllowances"
                    value={formData.otherAllowances}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors duration-200 font-medium text-sm"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-red-700 hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-md transition-colors duration-200 font-medium text-sm shadow-sm"
              >
                Generate Offer Letter
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default OfferLettersGenerative;