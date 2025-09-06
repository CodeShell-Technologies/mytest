
import { useEffect, useState } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

import { useParams } from "react-router-dom";

import axios from 'axios';
import moment from 'moment'; // Optional: for formatting date/time

import DataTable from "src/component/DataTable";
import CustomPagination from "src/component/CustomPagination";
import SearchInput from "src/component/SearchInput";
import Modal from "src/component/Modal";
import Dropdown from "src/component/DrapDown";
import { Dot, FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import { Link } from "react-router";
import { useAuthStore } from "src/stores/authStore";
import useBranchStore from "src/stores/useBranchStore";
import AddNewTaskForm from "./AddNewFinalFile";
import { BASE_URL, toastposition } from "~/constants/api";
interface Document {
  uri: string;
  fileType: string;
  fileName: string;
  fileSize:string;

// projectData: {
//     project_code: string;
//     // Add other fields from projectData if needed
//   };
//   // projectData: {projectData};

}

function FinalDocument({ projectData }: ClientDocumentProps): JSX.Element {
  // const documents: Document[] = [
  //   {
  //     uri: "/documents/Abc Client Documents.pdf",
  //     fileType: "pdf",
  //     fileName: "Abc Client Documents.pdf",
  //        fileSize:"15MB"
  //   },
    
  //   {
  //     uri: "/documents/AbcProject draft.pdf",
  //     fileType: "pdf",
  //     fileName: "AbcProject Meeting Document.pdf",
  //        fileSize:"15MB"
  //   },
  //  {
  //     uri: "/documents/AbcProject Final 2 Documents.pdf",
  //     fileType: "pdf",
  //     fileName: "Abc company overview.pdf",
  //        fileSize:"15MB"
  //   },
  //      {
  //     uri: "/documents/AbcProject final Document.pdf",
  //     fileType: "pdf",
  //     fileName: "Abc structure Documents.pdf",
  //        fileSize:"15MB"
  //   },
  // ];




  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document>(documents[0]);
  const [key, setKey] = useState(0); // Add a key to force re-render

    const token = useAuthStore((state) => state.accessToken);
  const permission = useAuthStore((state) => state.permissions);
  const staff_id = useAuthStore((state) => state.staff_id);
  const userBranchCode = useAuthStore((state) => state.branchcode);
  const [selectedBranch, setSelectedBranch] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [pageSize, setPageSize] = useState(8);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [error, setError] = useState(null);
  
  // const project_code=projectData.project_code;

  
  const pathname = window.location.pathname; // "/project/02-fedra"
const project_code = pathname.split("/").pop(); // "02-fedra"

  console.log("Project code from URL:", project_code);
const [IsModalOpen, setIsModalOpen] = useState(false);
const [formData, setFormData] = useState({
  staff_id: '',
  name: '',
  type: 'pdf',
  on_date: '',
  description: '',
  file: null as File | null,
});

// const token = useAuthStore((state) => state.accessToken);
  const {
    branches,
    managerOptions,
    branchCodeOptions,
    fetchBranches,
    isLoading: isStoreLoading,
  } = useBranchStore();

  const statusOptions = [
    { value: "", label: "All Branches" },
    { value: "active", label: "Active Branches" },
    { value: "inactive", label: "Inactive Branches" },
  ];

  const pageSizeOptions = [
    { value: 20, label: "20 per page" },
    { value: 40, label: "30 per page" },
    { value: 50, label: "40 per page" },
    { value: 80, label: "50 per page" },
    { value: 100, label: "100 per page" },
    { value: 200, label: "100 per page" },
  ];

  useEffect(() => {
    fetchBranches(token);
  }, [token]);


useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/final-documents/${project_code}`
        );
        const data = await res.json();

        // Transform data into DocViewer format
        const formattedDocs = data.documents.map((doc) => ({
          ...doc,
          uri: `/${doc.uri}`, // prepend domain
        }));

        setDocuments(formattedDocs);

        // Select first document by default
        if (formattedDocs.length > 0) {
          setSelectedDoc(formattedDocs[0]);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []);


const handleCreateSuccess = () => {
    setShowCreateModal(false);
    toast.success("Task added successfully!");
    fetchBranches(token);
    getBranch();
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleEditBranch = (branch) => {
    console.log("branchhhhtaskk", branch);
    setSelectedBranch(branch);
    setShowEditModal(true);
  };

  const handleDeleteBranch = (milestone) => {
    setShowDeleteModal(true);
    setDeleteData(milestone);
  };
  const handleDeleteSubmit = async () => {
    const deletedData = {
      data: {
        branchcode: deleteData.branchcode,
        project_code: deleteData.project_code,
        milestone_code: deleteData.milestone_code,
        delete_type: inActiveData.delete_type,
        status: inActiveData.status,
      },
    };
    console.log("projectdeleteddataa", deletedData);
    try {
      setLoading(true);
      const response = await axios.delete(
        `${BASE_URL}/project/milestone/delete`,
        {
          data: deletedData,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("deleteemployeeresponse", response);
      if (response?.status === 201) {
        setShowDeleteModal(false);
        toast.success("Milestone Deleted Successfully!");
        getBranch();
        setLoading(false);
        setInActiveData({
          delete_type: "",
          status: "",
        });
      }
    } catch (error) {
      console.error("Error deleting milestone", error);
      toast.error("Failed to delete milestone");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInActiveData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "" : "desc"));
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setSelectStatus(value);
    setCurrentPage(1);
  };

  const handleManagerChange = (value) => {
    setSelectedManager(value);
    setCurrentPage(1);
  };

  const handleBranchCodeChange = (value) => {
    setSelectedBranchCode(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] || null;
  setFormData((prev) => ({ ...prev, file }));
};

const handleSubmit = async () => {
  const data = new FormData();
  for (const key in formData) {
    if (formData[key as keyof typeof formData]) {
      data.append(key, formData[key as keyof typeof formData] as any);
    }
  }

  try {
    await fetch(`${BASE_URL}/final_documents/upload`, {
      method: "POST",
      body: data,
    });
    alert("Document uploaded successfully!");
    setIsModalOpen(false);
  } catch (err) {
    alert("Upload failed.");
  }
};

  const handleDocSelect = (doc: Document) => {
    setSelectedDoc(doc);
    setKey(prev => prev + 1); // Change key to force DocViewer re-render
  };

  return (
    <div className="flex flex-col h-[1050px] p-6 bg-gray-50">
      <div className="mb-4">
  <button
    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    onClick={() => setIsModalOpen(true)}
  >
    + Add Final Document 
  </button>

<Modal
        isVisible={IsModalOpen}
        className="w-full md:w-[800px]"
        onClose={() => setIsModalOpen(false)}
        title="Add New File Form"
      >
        <AddNewTaskForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>


</div>

      <h1 className="text-xl font-bold text-red-800 mb-8">Final Documents</h1>
      





      <div className="flex flex-1 gap-6 overflow-hidden">
      {/* Document List */}
      <div className="w-96 flex flex-col border-l border-gray-200 pl-6 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Documents List
        </h2>
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
          <ul>
            {documents.map((doc) => (
              <li
                key={doc.uri}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedDoc?.uri === doc.uri
                    ? "bg-red-50/80 border-l-4 border-red-600 shadow-sm dark:bg-red-900/20 dark:border-red-500"
                    : "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/70"
                }`}
                onClick={() => setSelectedDoc(doc)}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    {doc.fileType === "pdf" ? (
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="..." clipRule="evenodd" />
                      </svg>
                    ) : doc.fileType === "doc" || doc.fileType === "docx" ? (
                      <svg
                        className="w-5 h-5 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="..." clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="..." clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate dark:text-gray-200">
                      {doc.fileName}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                        {doc.fileType.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                      {doc.uri}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Document Viewer */}
      <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
        {selectedDoc && (
          <DocViewer
            key={selectedDoc.uri} // force re-render when doc changes
            documents={[{ uri: selectedDoc.uri, fileType: selectedDoc.fileType }]}
            pluginRenderers={DocViewerRenderers}
            theme={{
              primary: "rgb(185 28 28)",
              secondary: "#BDBDBD",
              tertiary: "#BDBDBD",
              textPrimary: "#ffffff",
              textSecondary: "rgb(185 28 28)",
              textTertiary: "rgb(185 28 28)",
              disableThemeScrollbar: false,
            }}
            config={{
              header: {
                disableHeader: false,
                disableFileName: true,
                retainURLParams: false,
              },
            }}
          />
        )}
      </div>
    
       
        {/* <div className="w-96 flex flex-col border-l border-gray-200 pl-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Documents List</h2>
          <div className="flex-1 overflow-y-auto pr-2">
            <ul className="space-y-3">
              {documents.map((doc) => (
                <li 
                  key={doc.uri}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedDoc.uri === doc.uri 
                      ? 'bg-red-100 border-l-4 border-red-700' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleDocSelect(doc)}
                >
                  <div className="font-medium text-gray-900 truncate">{doc.fileName}</div>
                  <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                    {doc.fileType}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div> */}
  
      </div>
    </div>
  );
}

export default FinalDocument;