import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuthStore } from "src/stores/authStore";

const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const token = useAuthStore((state: any) => state.accessToken);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [meetingsRes, followupsRes] = await Promise.all([
          fetch("http://localhost:3000/api/doc_meet/read?comm_type=meeting", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3000/api/campaign/followup/read", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const meetingsData = await meetingsRes.json();
        const followupsData = await followupsRes.json();
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
          })) || [];

        setEvents([...formattedMeetings, ...formattedFollowups]);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  const goToNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, "month").toDate());
  };

  const goToPrevMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, "month").toDate());
  };

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
          <Calendar
            localizer={localizer}
            events={events}
            date={currentDate}
            onNavigate={setCurrentDate}
            startAccessor="start"
            endAccessor="end"
            defaultView="month"
            views={["month", "week", "day", "agenda"]}
            style={{ height: "100%" }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor:
                  event.priority === "High" ? "#ff6b6b" : "#51cf66",
                borderRadius: "4px",
                color: "white",
                border: "none",
              },
            })}
            onSelectEvent={(event) =>
              alert(
                `📅 ${event.title}\n🕒 ${moment(event.start).format(
                  "HH:mm"
                )} - ${moment(event.end).format("HH:mm")}\n🔗 Link: ${
                  event.link || "None"
                }\n📝 Notes: ${event.notes || "No notes"}`
              )
            }
          />
        )}
      </div>
    </div>
  );
};

export default MyCalendar;
