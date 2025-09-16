import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, toastposition } from "~/constants/api";
import toast, { Toaster } from "react-hot-toast";
import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
import { useAuthStore } from "src/stores/authStore";
import {
  CalendarCheck,
  ClipboardList,
  Hash,
  Mail,
  MapPin,
  Phone,
  User,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import useBranchStore from "src/stores/useBranchStore";
import useLeadsStore from "src/stores/LeadsStore";
import AsyncSelect from "react-select/async";

const ClientAddForm = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useAuthStore((state) => state.accessToken);
  const permissions = useAuthStore((state) => state.permissions);
  const userRole = permissions[0].role;
  const branchCode = useBranchStore((state) => state.branchCodeOptions);
  const branchcodeForNor = useAuthStore((state) => state.branchcode);
  const [leadOptions, setLeadOptions] = useState([]);
  const [isFetchingLeads, setIsFetchingLeads] = useState(false);

  const thisbranch = useAuthStore((state) => state.branchcode);
  console.log(thisbranch);
  const branchCodeOption =
    userRole === "superadmin"
      ? branchCode
      : [{ value: branchcodeForNor, label: branchcodeForNor }];

  const [formData, setFormData] = useState({
    branchcode: thisbranch,
    lead_id: "",
    client_name: "",
    company_name: "",
    primary_phone: "",
    email: "",
    office_address: "",
    website: "",
    industry_type: "commercial",
    comm_type: "email",
    status: "active",
    contacts: [
      {
        name: "",
        designation: "",
        phone: "",
        email: "",
      },
    ],
  });

  const industryOptions = [
    { value: "commercial", label: "Commercial" },
    { value: "residential", label: "Residential" },
    { value: "industrial", label: "Industrial" },
    { value: "retail", label: "Retail" },
    { value: "hospitality", label: "Hospitality" },
  ];

  const communicationOptions = [
    { value: "email", label: "Email" },
    { value: "call", label: "Call" },
    { value: "mom", label: "Meeting" },
    { value: "all", label: "All" },
    { value: "none", label: "None" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "blacklisted", label: "Blacklisted" },
  ];

  const fetchLeadOptions = async (branchcode) => {
    if (!branchcode) {
      setLeadOptions([]);
      return;
    }

    setIsFetchingLeads(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/campaign/leads/read?branchcode=${branchcode}&limit=1000`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.data) {
        const options = response.data.data.map((lead) => ({
          value: lead.id,
          label: lead.lead_name || lead.name || "Unnamed Lead",
        }));
        setLeadOptions(options);
      } else {
        setLeadOptions([]);
      }
    } catch (error) {
      console.error("Error fetching lead options", error);
      toast.error("Failed to fetch leads");
      setLeadOptions([]);
    } finally {
      setIsFetchingLeads(false);
    }
  };

  useEffect(() => {
    if (formData.branchcode) {
      fetchLeadOptions(formData.branchcode);
    } else {
      setLeadOptions([]);
      setFormData((prev) => ({ ...prev, lead_id: "" }));
    }
  }, [formData.branchcode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "lead_id" && value) {
      const selectedLead = leadOptions.find((lead) => lead.value === value);
      if (selectedLead) {
        setFormData((prev) => ({
          ...prev,
          client_name: selectedLead.label,
        }));
      }
    }
  };

  const loadBranches = (inputValue: string, callback: (options: Option[]) => void) => {
    const filtered = branchCodeOption.filter((c) =>
      c.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(filtered);
  };

  const handleContactChange = (index, e) => {
    const { name, value } = e.target;
    const updatedContacts = [...formData.contacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [name]: value,
    };
    setFormData((prev) => ({
      ...prev,
      contacts: updatedContacts,
    }));
  };

  const addContact = () => {
    setFormData((prev) => ({
      ...prev,
      contacts: [
        ...prev.contacts,
        {
          name: "",
          designation: "",
          phone: "",
          email: "",
        },
      ],
    }));
  };

  const removeContact = (index) => {
    if (formData.contacts.length === 1) return;
    const updatedContacts = formData.contacts.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      contacts: updatedContacts,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const clientData = {
      data: [
        {
          branchcode: formData.branchcode,
          lead_id: formData.lead_id,
          // company_name: formData.company_name,
           company_name: formData.company_name?.trim() === "" ? "N/A" : formData.company_name,
          client_name: formData.client_name,
          primary_phone: formData.primary_phone,
          email: formData.email,
          office_address: formData.office_address,
          website: formData.website,
          contacts: formData.contacts,
          // industry_type: formData.industry_type,
          // comm_type: formData.comm_type,

           comm_type:
          formData.comm_type === "other" ? formData.customType : formData.comm_type,
          // industry_type:
          //   formData.industry_type === "other" ? formData.customTypepi : formData.industry_type,
          industry_type:
  formData.industry_type === "other" ? formData.customTypei : formData.industry_type,

          status: formData.status,
        },
      ],
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/client/overview/create`,
        clientData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        toast.success("New Client Added Successfully!");
        onCancel();
        onSuccess();
      } else {
        console.error("Error in create");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      // toast.error(error || "Error creating client");
    } finally {
      setLoading(false);
    }
  };



            const [commtypes, setCommtypes] = useState<string[]>([]);
                const [indtypes, setIndtypes] = useState<string[]>([]);


useEffect(() => {
  const fetchCommTypes = async () => {
    try {
      const res = await fetch(`${BASE_URL}/getindtype`, {
        headers: {
          Authorization: `Bearer ${token}`, // only if required
        },
      });
      const json = await res.json();

      if (json?.comm_types) {
        // directly set since backend already returns unique list
        setCommtypes(json.comm_types);
        setIndtypes(json.ind_types);
      } else {
        setCommtypes([]);
        setIndtypes([]);
      }
    } catch (error) {
      console.error("Failed to load comm types:", error);
    }
  };

  fetchCommTypes();
}, [token]);











  return (
    <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
      <Toaster position={toastposition} />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          Client Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <User className="inline mr-1" size={14} /> Client Name
            </p>
            <input
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              type="text"
              placeholder="Client Name"
              required
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Hash className="inline mr-1" size={14} /> Branch Code
            </p>
    {/*        <select
              name="branchcode"
              value={formData.branchcode}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            >
              <option value="">Select Branch</option>
              {branchCodeOption?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>*/}


               <AsyncSelect
  cacheOptions
  defaultOptions={branchCodeOption}
  defaultValue={
    branchCodeOption.find((opt) => opt.value === formData.branchcode) || null
  }
  name="branchcode"
  loadOptions={loadBranches}
  onChange={(selected: Option | null) => {
    const fakeEvent = {
      target: { value: selected ? selected.value : "" },
    };
    handleChange(fakeEvent);
  }}
  placeholder="Select or search branch"
/>

          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Hash className="inline mr-1" size={14} /> Company Name
            </p>
            <input
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              type="text"
              placeholder="Company Name"
              required
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Phone className="inline mr-1" size={14} /> Primary Phone
            </p>
            <input
              name="primary_phone"
              value={formData.primary_phone}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              type="text"
              placeholder="Primary Phone"
              required
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Mail className="inline mr-1" size={14} /> Email
            </p>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              type="email"
              placeholder="Email"
              required
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <ClipboardList className="inline mr-1" size={14} /> Industry Type
            </p>
{/*            <select
              name="industry_type"
              value={formData.industry_type}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              
            >
              {industryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>*/}

                                        <select
    name="industry_type"
    value={formData.industry_type}
    onChange={(e) => {
      const value = e.target.value;
      if (value === "other") {
        setFormData((prev) => ({ ...prev, industry_type: "other", customTypei: "" }));
      } else {
        setFormData((prev) => ({ ...prev, industry_type: value, customTypei: "" }));
      }
    }}
    className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
    required
  >
    <option value="">Select type</option>
    {indtypes.map((t) => (
      <option key={t} value={t}>
        {t}
      </option>
    ))}
    <option value="other">Other</option>
  </select>

  {/* Show custom input if "Other" selected */}
  {formData.industry_type === "other" && (
    <input
      type="text"
      name="customTypei"
      value={formData.customTypei || ""}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, customTypei: e.target.value }))
      }
      className="mt-2 w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none border-b border-gray-300 dark:border-gray-600"
      placeholder="Enter new type"
  
    />
  )}






          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <FileText className="inline mr-1" size={14} /> Website
            </p>
            <input
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              type="text"
              placeholder="Website URL"
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <ClipboardList className="inline mr-1" size={14} /> Lead
            </p>
            <select
              name="lead_id"
              value={formData.lead_id}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              disabled={!formData.branchcode || isFetchingLeads}
              
            >
              <option value="">Select Lead</option>
              {isFetchingLeads ? (
                <option value="" disabled>
                  Loading leads...
                </option>
              ) : (
                leadOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          Address Information
        </h3>
        <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            <MapPin className="inline mr-1" size={14} /> Office Address
          </p>
          <textarea
            name="office_address"
            value={formData.office_address}
            onChange={handleChange}
            className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none min-h-[80px]"
            placeholder="Office Address"
            
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          Contacts
        </h3>
        {formData.contacts.map((contact, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 relative"
          >
            <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <User className="inline mr-1" size={14} /> Contact Name
              </p>
              <input
                name="name"
                value={contact.name}
                onChange={(e) => handleContactChange(index, e)}
                className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                type="text"
                placeholder="Contact Name"
              
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <User className="inline mr-1" size={14} /> Designation
              </p>
              <input
                name="designation"
                value={contact.designation}
                onChange={(e) => handleContactChange(index, e)}
                className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                type="text"
                placeholder="Designation"
            
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <Phone className="inline mr-1" size={14} /> Phone
              </p>
              <input
                name="phone"
                value={contact.phone}
                onChange={(e) => handleContactChange(index, e)}
                className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                type="text"
                placeholder="Phone"
            
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <Mail className="inline mr-1" size={14} /> Email
              </p>
              <input
                name="email"
                value={contact.email}
                onChange={(e) => handleContactChange(index, e)}
                className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                type="email"
                placeholder="Email"
                
              />
            </div>

            {index > 0 && (
              <button
                type="button"
                onClick={() => removeContact(index)}
                className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addContact}
          className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          <Plus size={16} /> Add Another Contact
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          Communication & Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <ClipboardList className="inline mr-1" size={14} /> Communication
              Type
            </p>
{/*            <select
              name="comm_type"
              value={formData.comm_type}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
            
            >
              {communicationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>*/}




                                      <select
    name="comm_type"
    value={formData.comm_type}
    onChange={(e) => {
      const value = e.target.value;
      if (value === "other") {
        setFormData((prev) => ({ ...prev, comm_type: "other", customType: "" }));
      } else {
        setFormData((prev) => ({ ...prev, comm_type: value, customType: "" }));
      }
    }}
    className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
    required
  >
    <option value="">Select type</option>
    {commtypes.map((t) => (
      <option key={t} value={t}>
        {t}
      </option>
    ))}
    <option value="other">Other</option>
  </select>

  {/* Show custom input if "Other" selected */}
  {formData.comm_type === "other" && (
    <input
      type="text"
      name="customType"
      value={formData.customType || ""}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, customType: e.target.value }))
      }
      className="mt-2 w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none border-b border-gray-300 dark:border-gray-600"
      placeholder="Enter new type"
      required
    />
  )}







          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <ClipboardList className="inline mr-1" size={14} /> Status
            </p>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
          
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors duration-200 font-medium text-sm"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-red-700 hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-md transition-colors duration-200 font-medium text-sm shadow-sm"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <ButtonLoader /> : "Create Client"}
        </button>
      </div>
    </div>
  );
};

export default ClientAddForm;
