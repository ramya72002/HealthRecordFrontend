'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AlertCircle, Trash2 } from "lucide-react";
import "./viewmedications.scss";

interface Medication {
  medication_id: string;
  medication_name: string;
  frequency: string;
  count?: number;
  schedule?: string;
  start_date: string;
  end_date: string;
  selected_days?: string;
}

interface ScheduleEntry {
  time: string;
  dosage: string;
}

const MedicationsView: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch medications
  const fetchMedications = async () => {
    try {
      setLoading(true);
      const userDetails = JSON.parse(localStorage.getItem("userDetails") || '{}');

      if (userDetails?.user.user_id) {
        const response = await axios.post(
          "https://health-project-backend-url.vercel.app/get_medications_wrt_userId",
          { user_id: userDetails.user.user_id }
        );
        setMedications(response.data?.medications || []);
      } else {
        alert("User details not found. Please log in again.");
      }
    } catch (error) {
      console.error("Error fetching medications:", error);
      setError("Failed to load medications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a medication
  const deleteMedication = async (medicationId: string) => {
    try {
      const userDetails = JSON.parse(localStorage.getItem("userDetails") || '{}');

      if (userDetails?.user_id) {
        const response = await axios.post(
          "https://health-project-backend-url.vercel.app/delete_medication_wrt_id",
          {
            user_id: userDetails.user_id,
            medication_id: medicationId,
          }
        );

        if (response.data.success) {
          alert("Medication deleted successfully.");
          fetchMedications();
        } else {
          alert("Failed to delete medication.");
        }
      } else {
        alert("User details not found. Please log in again.");
      }
    } catch (error) {
      console.error("Error deleting medication:", error);
      alert("An error occurred while deleting the medication.");
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const handleDelete = (medicationId: string) => {
    if (confirm("Are you sure you want to delete this medication?")) {
      deleteMedication(medicationId);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <AlertCircle size={48} color="red" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="header">Medications Added</h2>
      <div className="medicationList">
        {medications.map((item, index) => {
          const schedule: ScheduleEntry[] = item.schedule ? JSON.parse(item.schedule) : [];
          return (
            <div key={index} className="medicationItem">
              <h3 className="medicationName">{item.medication_name}</h3>
              <p className="medicationFrequency">Frequency: {item.frequency}</p>
              {item.count && (
                <p className="medicationDays">Repeat every: {item.count} days</p>
              )}
              <div className="scheduleBox">
                <strong>Schedule:</strong>
                {schedule.map((entry, idx) => (
                  <p key={idx}>{entry.time} - {entry.dosage} dosage</p>
                ))}
              </div>
              <div className="dateContainer">
                <p>Start Date: {item.start_date}</p>
                <p>End Date: {item.end_date}</p>
              </div>
              {item.selected_days && (
                <p>Selected Days: {item.selected_days}</p>
              )}
              <button className="deleteButton" onClick={() => handleDelete(item.medication_id)}>
                <Trash2 size={20} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MedicationsView;
