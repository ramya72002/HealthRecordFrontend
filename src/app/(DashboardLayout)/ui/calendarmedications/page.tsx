'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar"; // Use react-calendar for the calendar component
import "react-calendar/dist/Calendar.css"; // Import default calendar styles
import "./calendarmedications.scss"; // Import CSS module for styling

const CalendarMedications = () => {
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState<Record<string, { dots: { color: string; selectedDotColor: string }[]; selected: boolean }>>({});
  const [selectedMedications, setSelectedMedications] = useState<any[]>([]); // State to store selected medications for the modal
  const [modalVisible, setModalVisible] = useState<boolean>(false); // Modal visibility state
  const router = useRouter();

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");

        if (userDetails?.user.user_id) {
          const response = await axios.post(
            "https://health-project-backend-url.vercel.app/get_medications_wrt_userId",
            { user_id: userDetails.user.user_id }
          );

          const userMedications = response.data?.medications || [];
          setMedications(userMedications);
          const medicationDates: Record<string, { dots: { color: string; selectedDotColor: string }[]; selected: boolean }> = {};

          userMedications.forEach((med: any) => {
            const schedule = med.schedule ? JSON.parse(med.schedule) : [];
            const { start_date, end_date, frequency, selected_days, selected_dates, count } = med;

            const startDate = new Date(start_date);
            const endDate = new Date(end_date);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
              console.error(`Invalid start_date or end_date for ${med.medication_name}`);
              return;
            }

            let currentDate = new Date(startDate);
            const freq = frequency || "daily";
            const interval = freq === "Every x days" && count ? parseInt(count, 10) : 1;

            // Iterate over dates within the range
            while (currentDate <= endDate) {
              const dateStr = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

              if (freq === "Every day" || freq === "daily") {
                if (!medicationDates[dateStr]) {
                  medicationDates[dateStr] = { dots: [], selected: true };
                }
                medicationDates[dateStr].dots.push({ color: "red", selectedDotColor: "red" });
              } else if (freq === "Every x days" && interval > 0) {
                if (!medicationDates[dateStr]) {
                  medicationDates[dateStr] = { dots: [], selected: true };
                }
                medicationDates[dateStr].dots.push({ color: "red", selectedDotColor: "red" });
              } else if (freq === "Day of the week" && selected_days) {
                const dayOfWeek = currentDate.toLocaleString("en-US", { weekday: "short" });
                if (selected_days.includes(dayOfWeek)) {
                  if (!medicationDates[dateStr]) {
                    medicationDates[dateStr] = { dots: [], selected: true };
                  }
                  medicationDates[dateStr].dots.push({ color: "red", selectedDotColor: "red" });
                }
              } else if (freq === "Day of the month" && selected_dates) {
                const selectedDatesArray = selected_dates.split(",").map((date: string) => date.trim());
                if (selectedDatesArray.includes(currentDate.getDate().toString())) {
                  if (!medicationDates[dateStr]) {
                    medicationDates[dateStr] = { dots: [], selected: true };
                  }
                  medicationDates[dateStr].dots.push({ color: "red", selectedDotColor: "red" });
                }
              }

              // Increment the date
              currentDate.setDate(currentDate.getDate() + interval);
            }
          });

          setMarkedDates(medicationDates);
        } else {
          alert("User details not found. Please log in again.");
          router.push("/login"); // Redirect to login if user details are not found
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch medications.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  // Handle day press event
  const onDayPress = (date: Date) => {
    const selectedDay = date.toISOString().split("T")[0];

    // Find all medications for the selected date
    const medicationsForDay = medications.filter((med: any) => {
      const schedule = med.schedule ? JSON.parse(med.schedule) : [];
      const { start_date, end_date, frequency, selected_days, selected_dates } = med;

      const startDate = new Date(start_date);
      const endDate = new Date(end_date);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return false;
      }

      let currentDate = new Date(startDate);
      const freq = frequency || "daily";

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
        if (dateStr === selectedDay) {
          return true; // Medication is scheduled for the selected day
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return false;
    });

    if (medicationsForDay.length > 0) {
      setSelectedMedications(medicationsForDay); // Set all medications found for the selected day
      setModalVisible(true); // Open modal with medication details
    } else {
      alert("No medication scheduled for this day.");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMedications([]); // Clear selected medications
  };

  if (loading) {
    return (
      <div className="loadingContainer">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="errorContainer">
        <p className="errorText">{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="header">Medications Calendar</h1>

      <Calendar
        className="calendar"
        tileClassName={({ date }) => {
          const dateStr = date.toISOString().split("T")[0];
          return markedDates[dateStr] ? "markedDate" : null;
        }}
        onClickDay={onDayPress} // Handle date click
      />

      {/* Modal for displaying medication details */}
      {modalVisible && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2 className="modalTitle">Medication Details</h2>

            {selectedMedications.map((med, index) => {
              const schedule = med.schedule ? JSON.parse(med.schedule) : [];
              return (
                <div key={`med-${index}`} className="medicationContainer">
                  {/* Medication Details */}
                  <div className="medicationHeader">
                    <p className="modalText">Name: {med.medication_name}</p>
                    <p className="modalText">Start: {med.start_date}</p>
                    <p className="modalText">End: {med.end_date}</p>
                    <p className="modalText">Frequency: {med.frequency}</p>
                  </div>

                  {/* Schedule Table for This Medication */}
                  <div className="table">
                    <div className="tableHeader">
                      <p className="tableHeaderText">Time</p>
                      <p className="tableHeaderText">Dosage</p>
                    </div>

                    {schedule.map((item: any, itemIndex: number) => (
                      <div key={`sched-${itemIndex}`} className="tableRow">
                        <p className="tableCell">{item.time}</p>
                        <p className="tableCell">{item.dosage}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <button className="closeButton" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarMedications;
