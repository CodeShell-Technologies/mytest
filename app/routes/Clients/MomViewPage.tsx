import { useEffect, useState } from "react";
import { Calendar, ClipboardCheck, Users as UsersIcon } from "lucide-react";
import { CgFileDocument } from "react-icons/cg";
import { FaUsers } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "~/constants/api";
import { useAuthStore } from "src/stores/authStore";

// import  EditMeetingModal from "./EditMeetingModal";


import { useLocation , useParams  } from "react-router-dom";

const MomViewPage = () => {
  const [participants, setParticipants] = useState([]);

  const { state } = useLocation();
  // const meeting = state?.meetings; // 👈 meeting object passed from ClientMom

  const { id } = useParams();

   const [meeting, setMeeting] = useState<any>(null);
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useAuthStore((state) => state.accessToken);
  const [isEditOpen, setIsEditOpen] = useState(false);

  

useEffect(() => {
    if (!id) return;

    setLoading(true);

    // fetch meeting, participants, and targets in parallel
    const fetchMeetingData = async () => {
      try {
        const [meetingRes, participantsRes, targetsRes] = await Promise.all([
          axios.get(`${BASE_URL}/getmeetingbyid?id=${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/doc_meet/participant/read?meet_id=${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/doc_meet/target/read?meet_id=${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setMeeting(meetingRes.data.data);
        setParticipants(participantsRes.data.data || []);
        setTargets(targetsRes.data.data || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load meeting details");
      } finally {
        setLoading(false);
      }
    };

    fetchMeetingData();
  }, [id, token]);

  if (loading) return <p className="text-center mt-10">Loading meeting details...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!meeting) return <p className="text-center mt-10">Meeting not found</p>;



  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'active':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case 'pending':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-gray-500 dark:text-gray-400">
        Loading meeting details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-red-500 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>


        
          <h1 className="text-2xl font-bold text-red-700 dark:text-white">Minutes of Meeting</h1>
          <p className="text-gray-500 dark:text-gray-400">ID: {id || "N/A"}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="h-5 w-5 mr-1.5" />
            {formatDate(meeting?.start_date_time)}
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FaUsers className="h-5 w-5 mr-1.5" />
            {participants.length} attendees
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{meeting?.title || "Meeting Details"}</h2>
          <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(meeting?.status)}`}>
              {meeting?.status ? meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1) : "N/A"}
            </span>
            <span className="mx-2">•</span>
            <span>
              {formatDateTime(meeting?.start_date_time)} - {formatDateTime(meeting?.end_date_time)}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start mb-6">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg mr-4">
              <CgFileDocument className="h-6 w-6 text-red-700 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Meeting Details</h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Branch:</p>
                  <p className="text-gray-700 dark:text-gray-300">{meeting?.branchcode || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Project:</p>
                  <p className="text-gray-700 dark:text-gray-300">{meeting?.project_code || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By:</p>
                  <p className="text-gray-700 dark:text-gray-300">{meeting?.createdby || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Document Status:</p>
                  <p className="text-gray-700 dark:text-gray-300 capitalize">{meeting?.doc_status || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <UsersIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              Participants
            </h4>
            <div className="space-y-3">
              {participants.length > 0 ? (
                participants.map((participant) => (
                  <div key={participant.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{participant.person_id}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                          {participant.role} • {participant.status}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Added: {new Date(participant.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No participants found</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <ClipboardCheck className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              Targets
            </h4>
            <div className="space-y-3">
              {targets.length > 0 ? (
                targets.map((target) => (
                  <div key={target.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{target.target_id}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                          {target.type}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Added: {new Date(target.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No targets found</p>
              )}
            </div>
          </div>

          {meeting?.notes && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <ClipboardCheck className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                Meeting Notes / MOM
              </h4>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{meeting.notes}</p>
              </div>
            </div>
          )}

          {meeting?.meet_link && (
            <div className="mt-6">
              <a 
                href={meeting.meet_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
              >
                <svg className="w-5 h-5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
                Join Meeting
              </a>
            </div>
          )}
        </div>
          {meeting?.doc && meeting.doc.length > 0 && (
  <div className="mt-6">
    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
      <CgFileDocument className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
      Documents
    </h4>
    <div className="space-y-2">
      {meeting.doc.map((document) => (
        // <a
        //   key={document.id}
        //   href={document.url}
        //   target="_blank"
        //   rel="noopener noreferrer"
        //   className="block p-2 bg-gray-50 dark:bg-gray-700/30 rounded-md text-blue-600 dark:text-blue-400 hover:underline"
        // >
        //   {document.url}
        // </a>
        <a
  key={document.id}
  href={`${BASE_URL.replace("/api", "")}/documents/${document.url}`}
  target="_blank"
  rel="noopener noreferrer"
  className="block p-2 bg-gray-50 dark:bg-gray-700/30 rounded-md text-blue-600 dark:text-blue-400 hover:underline"
>
  {document.url}
</a>

      ))}
    </div>
  </div>
)}
      </div>




      <div className="mt-6 flex justify-end gap-3">
        {/*<button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
          Download PDF
        </button>*/}
        {/*<button 

          onClick={() => setIsEditOpen(true)}
          className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-900">
          Edit Minutes
        </button>*/}
      </div>
    
    {/*</div>*/}
    </div>



  );
};

export default MomViewPage;