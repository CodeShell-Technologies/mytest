// import React, { useState, useEffect } from "react";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { useAuthStore } from "src/stores/authStore";
// import { useNavigate } from "react-router-dom";
// const localizer = momentLocalizer(moment);

// const MyCalendar = () => {
//   const token = useAuthStore((state: any) => state.accessToken);
//   const [events, setEvents] = useState<any[]>([]);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [currentDate, setCurrentDate] = useState(new Date());
//    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
//   const [view, setView] = useState<"month" | "week" | "day" | "agenda">("month");
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const [meetingsRes, followupsRes] = await Promise.all([
//           fetch("http://localhost:3000/api/doc_meet/read?comm_type=meeting", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch("http://localhost:3000/api/campaign/followup/read", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         const meetingsData = await meetingsRes.json();
//         const followupsData = await followupsRes.json();
//         const formattedMeetings =
//           meetingsData?.data?.map((item: any) => ({
//             id: item.meet_id,
//             title: item.title,
//             start: new Date(item.start_date_time),
//             end: new Date(item.end_date_time),
//             type: "meeting",
//             priority: item.category === "custom" ? "High" : "Normal",
//             notes: item.notes,
//             link: item.meet_link,
//           })) || [];

//         const formattedFollowups =
//           followupsData?.data?.map((item: any) => ({
//             id: item.id,
//             title: `Follow-up: Lead #${item.lead_id}`,
//             start: new Date(item.next_date),
//             end: new Date(item.next_date),
//             allDay: true,
//             type: "followup",
//             priority: "Normal",
//             notes: item.notes || "Lead follow-up",
//             campaign: item.campaign_code,
//           })) || [];

//         setEvents([...formattedMeetings, ...formattedFollowups]);
//       } catch (err) {
//         console.error("Failed to fetch data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) fetchData();
//   }, [token]);

//   const goToNextMonth = () => {
//     setCurrentDate(moment(currentDate).add(1, "month").toDate());
//   };

//   const goToPrevMonth = () => {
//     setCurrentDate(moment(currentDate).subtract(1, "month").toDate());
//   };

//   return (
//     <div
//       style={{
//         height: "100vh",
//         padding: "20px",
//         backgroundColor: "#f5f5f5",
//       }}
//     >
   

//       <div
//         style={{
//           background: "white",
//           height: "calc(100% - 40px)",
//           borderRadius: "8px",
//           boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//           padding: "20px",
//         }}
//       >
// {loading ? (
//   <p>Loading calendar...</p>
// ) : (
//   <>
//     <Calendar
//       localizer={localizer}
//       events={events}
//       date={currentDate}
//       onNavigate={setCurrentDate}
//       view={view}
//       onView={setView}
//       startAccessor="start"
//       endAccessor="end"
//       defaultView="month"
//       views={["month", "week", "day", "agenda"]}
//       popup
//       style={{ height: "100%" }}
//       eventPropGetter={(event) => ({
//         style: {
//           backgroundColor: event.priority === "High" ? "#ff6b6b" : "#51cf66",
//           borderRadius: "4px",
//           color: "white",
//           border: "none",
//         },
//       })}
//       onSelectEvent={(event) => setSelectedEvent(event)}
//     />

//     {/* Modal for event details */}
//     {selectedEvent && (
//       <div className="fixed inset-0 flex items-center justify-center bg-black/50">
//         <div className="bg-white p-6 rounded-xl shadow-lg w-96">
//           <h2 className="text-lg font-semibold mb-2">{selectedEvent.title}</h2>
//           <p>
//             🕒 {moment(selectedEvent.start).format("HH:mm")} -{" "}
//             {moment(selectedEvent.end).format("HH:mm")}
//           </p>
//           <p>🔗 {selectedEvent.link || "None"}</p>
//           <p>📝 {selectedEvent.notes || "No notes"}</p>

//           <div className="mt-4 flex justify-end gap-3">
//             <button
//               className="px-4 py-2 rounded-lg bg-gray-300"
//               onClick={() => setSelectedEvent(null)}
//             >
//               Close
//             </button>
//             <button
//               className="px-4 py-2 rounded-lg bg-blue-600 text-white"
//               onClick={() => navigate(`/meetings/${selectedEvent.id}`)}
//             >
//               Edit
//             </button>
//             <button
//               className="px-4 py-2 rounded-lg bg-blue-600 text-white"
//               onClick={() => navigate(`/meeting_view/${selectedEvent.id}`)}
//             >
//               View
//             </button>
//           </div>
//         </div>
//       </div>
//     )}
//   </>
// )}

//       </div>
//     </div>
//   );
// };

// export default MyCalendar;


import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuthStore } from "src/stores/authStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, toastposition, toastStyle } from "~/constants/api";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const token = useAuthStore((state: any) => state.accessToken);
  const user = useAuthStore((state: any) => state.user); // ✅ assume user object { role, staff_id }
  const role = useAuthStore((state: any) => state.role); // ✅ assume user object { role, staff_id }
  const staff_id = useAuthStore((state: any) => state.staff_id); // ✅ assume user object { role, staff_id }
  const [events, setEvents] = useState<any[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">("month");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const formattedDate = moment().format("YYYY-MM-DD");

        const [meetingsRes, followupsRes, overdueRes] = await Promise.all([
          fetch(`${BASE_URL}/doc_meet/read?comm_type=meeting`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/campaign/followup/read`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/project/overview/read?overdue=${formattedDate}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const meetingsData = await meetingsRes.json();
        const followupsData = await followupsRes.json();
        const overdueData = overdueRes.data;

        // ---------- Format Data ----------
        const formattedMeetings =
          meetingsData?.data?.map((item: any) => ({
            id: item.meet_id,
            title: item.title,
            start: new Date(item.start_date_time),
            end: new Date(item.end_date_time),
            type: "meeting",
            priority: item.category === "custom" ? "High" : "Normal",
            notes: item.notes,
            link: item.meet_link,
            creator_id: item.creator_id,
            participants: item.participants || [], // ensure API provides participants
          })) || [];

        const formattedFollowups =
          followupsData?.data?.map((item: any) => ({
            id: item.id,
            title: `Follow-up: Lead #${item.lead_id}`,
            start: new Date(item.next_date),
            end: new Date(item.next_date),
            allDay: true,
            type: "followup",
            priority: "Normal",
            notes: item.notes || "Lead follow-up",
            campaign: item.campaign_code,
            related_staff: item.related_staff, // assumed from API
          })) || [];

        const formattedOverdues =
          overdueData?.data?.map((item: any) => ({
            id: `overdue-${item.project_code}`,
            title: `Overdue: ${item.title}`,
            start: new Date(item.end_date),
            end: new Date(item.end_date),
            allDay: true,
            type: "overdue",
            priority: "High",
            notes: item.notes,
            project_code: item.project_code,
            handler_department: item.handler_department,
            handler_by: item.handler_by,
            status: item.status,
            budget: item.budget,
            balance: item.balance,
          })) || [];

        let allEvents = [...formattedMeetings, ...formattedFollowups, ...formattedOverdues];

        // ---------- Apply Role / Staff Filtering ----------
        if (!["superadmin", "admin", "hr"].includes(role)) {
          allEvents = allEvents.filter((event) => {
            if (event.type === "meeting") {
              return (
                event.creator_id === user.staff_id ||
                (event.participants && event.participants.includes(staff_id))
              );
            }
            if (event.type === "overdue") {
              return event.handler_by === staff_id;
            }
            if (event.type === "followup") {
              return event.related_staff === staff_id;
            }
            return false;
          });
        }

        setEvents(allEvents);
      } catch (err) {
        console.error("Failed to fetch calendar data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token, role,staff_id]);

  return (
    <div
      style={{
        height: "100vh",
        padding: "20px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          background: "white",
          height: "calc(100% - 40px)",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          padding: "20px",
        }}
      >
        {loading ? (
          <p>Loading calendar...</p>
        ) : (
          <>
            <Calendar
              localizer={localizer}
              events={events}
              date={currentDate}
              onNavigate={setCurrentDate}
              view={view}
              onView={setView}
              startAccessor="start"
              endAccessor="end"
              defaultView="month"
              views={["month", "week", "day", "agenda"]}
              popup
              style={{ height: "100%" }}
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor:
                    event.type === "overdue"
                      ? "#e03131"
                      : event.priority === "High"
                      ? "#ff922b"
                      : "#1971c2",
                  borderRadius: "4px",
                  color: "white",
                  border: "none",
                },
              })}
              onSelectEvent={(event) => setSelectedEvent(event)}
            />

            {/* Modal same as before */}
            {selectedEvent && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                <div className="bg-white p-6 rounded-xl shadow-lg w-[500px] max-w-full">
                  <h2 className="text-xl font-semibold mb-3">
                    {selectedEvent.title}
                  </h2>
                  {selectedEvent.type === "overdue" ? (
                    <>
                      <p>📌 Project Code: {selectedEvent.project_code}</p>
                      <p>👤 Handler: {selectedEvent.handler_by}</p>
                      <p>📊 Status: {selectedEvent.status}</p>
                      <p>
                        💰 Reason: {selectedEvent.reason} 
                      </p>
                      <p>📝 {selectedEvent.notes || "No notes"}</p>
                    </>
                  ) : (
                    <>
                      <p>
                        🗓 {moment(selectedEvent.start).format("DD MMM YYYY, HH:mm")} –{" "}
                        {moment(selectedEvent.end).format("HH:mm")}
                      </p>
                      <p>📝 {selectedEvent.notes || "No notes available"}</p>
                    </>
                  )}
                  <div className="mt-4 flex justify-end gap-3">
                    {selectedEvent.type === "meeting" && (
                      <>
                        <button
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                          onClick={() => navigate(`/meetings/${selectedEvent.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                          onClick={() => navigate(`/meeting_view/${selectedEvent.id}`)}
                        >
                          View
                        </button>
                      </>
                    )}

                    <button
                      className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                      onClick={() => setSelectedEvent(null)}
                    >
                      Close
                    </button>
                    {selectedEvent.type === "overdue" && (
                      <button
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                        onClick={() =>
                          navigate(`/project/${selectedEvent.project_code}`)
                        }
                      >
                        View Project
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyCalendar;
