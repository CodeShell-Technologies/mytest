
import { useState } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";


const [isModalOpen, setIsModalOpen] = useState(false);
const [formData, setFormData] = useState({
  staff_id: '',
  name: '',
  type: 'pdf',
  on_date: '',
  description: '',
  file: null as File | null,
});

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
    await fetch("http://localhost:3000/api/client_documents/upload", {
      method: "POST",
      body: data,
    });
    alert("Document uploaded successfully!");
    setIsModalOpen(false);
  } catch (err) {
    alert("Upload failed.");
  }
};

interface Document {
  uri: string;
  fileType: string;
  fileName: string;
  fileSize:string
}

function ClientDocument(): JSX.Element {
  const documents: Document[] = [
    {
      uri: "/documents/Abc Client Documents.pdf",
      fileType: "pdf",
      fileName: "Abc Client Documents.pdf",
         fileSize:"15MB"
    },
    
    {
      uri: "/documents/AbcProject draft.pdf",
      fileType: "pdf",
      fileName: "AbcProject Meeting Document.pdf",
         fileSize:"15MB"
    },
   {
      uri: "/documents/AbcProject Final 2 Documents.pdf",
      fileType: "pdf",
      fileName: "Abc company overview.pdf",
         fileSize:"15MB"
    },
       {
      uri: "/documents/AbcProject final Document.pdf",
      fileType: "pdf",
      fileName: "Abc structure Documents.pdf",
         fileSize:"15MB"
    },
  ];

  const [selectedDoc, setSelectedDoc] = useState<Document>(documents[0]);
  const [key, setKey] = useState(0); // Add a key to force re-render

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
    + Add Client Document
  </button>

{isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Upload Client Document</h2>
      
      <input
        type="text"
        name="staff_id"
        placeholder="Staff ID"
        value={formData.staff_id}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded"
      />
      <input
        type="text"
        name="name"
        placeholder="Document Name"
        value={formData.name}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded"
      />
      <input
        type="date"
        name="on_date"
        value={formData.on_date}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border rounded"
      />
      <input
        type="file"
        onChange={handleFileChange}
        className="w-full"
      />

      <div className="flex justify-end gap-2">
        <button onClick={() => setIsModalOpen(false)} className="px-3 py-2 border rounded">
          Cancel
        </button>
        <button onClick={handleSubmit} className="px-4 py-2 bg-red-600 text-white rounded">
          Upload
        </button>
      </div>
    </div>
  </div>
)}


</div>

      <h1 className="text-xl font-bold text-red-800 mb-8">Client Documents</h1>
      





      
      <div className="flex flex-1 gap-6 overflow-hidden">
              <div className="w-96 flex flex-col border-l border-gray-200 pl-6 dark:border-gray-700">
  <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Documents List</h2>
  <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
    <ul className="space-y-2">
      {documents.map((doc) => (
        <li 
          key={doc.uri}
          className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
            selectedDoc.uri === doc.uri
              ? 'bg-red-50/80 border-l-4 border-red-600 shadow-sm dark:bg-red-900/20 dark:border-red-500'
              : 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/70'
          }`}
          onClick={() => handleDocSelect(doc)}
        >
          <div className="flex items-start">
            {/* File icon based on type */}
            <div className="mr-3 mt-0.5">
              {doc.fileType === 'pdf' ? (
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              ) : doc.fileType === 'doc' || doc.fileType === 'docx' ? (
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
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
                  {doc.fileSize || '--'}
                </span>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
</div>
        {/* Document Viewer - Left Side */}
        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
          <DocViewer
            key={key} // Important: This forces re-render when document changes
            documents={[selectedDoc]}
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

export default ClientDocument;