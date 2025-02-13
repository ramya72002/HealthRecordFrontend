'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './addmedications.scss';

interface Schedule {
  time: string;
  dosage: string;
}

interface SelectedDays {
  Mon: boolean;
  Tue: boolean;
  Wed: boolean;
  Thu: boolean;
  Fri: boolean;
  Sat: boolean;
  Sun: boolean;
}

interface User {
  created_at: string;
  email: string;
  id: string;
  name: string;
  user_id: string;
}

interface UserDetails {
  message: string;
  success: boolean;
  user: User;
}

const Medications: React.FC = () => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [medicationName, setMedicationName] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('Every day');
  const [count, setCount] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [schedule, setSchedule] = useState<Schedule[]>([
    { time: '07:00', dosage: '1.0' },
    { time: '13:00', dosage: '1.0' },
    { time: '19:00', dosage: '1.0' },
  ]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedDays, setSelectedDays] = useState<SelectedDays>({
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false,
  });
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [endDate, setEndDate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userDetailsString = localStorage.getItem('userDetails');
        if (userDetailsString) {
          const userDetails: UserDetails = JSON.parse(userDetailsString);
          if (userDetails.user.user_id) {
            setUserId(userDetails.user.user_id);
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserId();
  }, []);

  const handleAddMedication = async () => {
    let selectedDaysString = '';
    if (frequency === 'Day of the week') {
      selectedDaysString = Object.keys(selectedDays)
        .filter((day) => selectedDays[day as keyof SelectedDays])
        .join(', ');
    }

    let selectedDatesString = '';
    if (frequency === 'Day of the month') {
      selectedDatesString = selectedDates.join(', ');
    }

    const medicationData = {
      user_id: userId,
      image_urls: [],
      medication_name: medicationName,
      frequency: frequency,
      date_time: new Date().toISOString(),
      schedule: JSON.stringify(schedule),
      start_date: startDate,
      end_date: endDate,
      count: frequency === 'Every x days' ? count : null,
      selected_days: frequency === 'Day of the week' ? selectedDaysString : null,
      selected_dates: frequency === 'Day of the month' ? selectedDatesString : null,
    };

    try {
      const response = await axios.post(
        'https://health-project-backend-url.vercel.app/medications_wrt_userId',
        medicationData
      );
      if (response.data.success) {
        alert('Medication added successfully!');
        router.push('/ui/calendarmedications');
      } else {
        alert('Failed to add medication. Please try again.');
      }
    } catch (error) {
      alert('An error occurred while adding the medication.');
      console.error('API Error:', error);
    }
  };

  const handleSelectFrequency = (selectedFrequency: string) => {
    setFrequency(selectedFrequency);
    setModalVisible(false);
  };
  const handleIncreaseDosage = (index: number) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[index].dosage = (parseFloat(updatedSchedule[index].dosage) + 1).toFixed(1);
    setSchedule(updatedSchedule);
  };
  
  const handleDecreaseDosage = (index: number) => {
    const updatedSchedule = [...schedule];
    const newDosage = parseFloat(updatedSchedule[index].dosage) - 1;
    updatedSchedule[index].dosage = newDosage > 0 ? newDosage.toFixed(1) : "0.0";
    setSchedule(updatedSchedule);
  };
  
  const handleSelectDate = (day: number) => {
    setSelectedDates((prevDates) =>
      prevDates.includes(day) ? prevDates.filter((date) => date !== day) : [...prevDates, day]
    );
  };

  const handleTimeChange = (index: number, newTime: string) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[index].time = newTime;
    setSchedule(updatedSchedule);
  };

  const handleDeleteRow = (index: number) => {
    const updatedSchedule = schedule.filter((_, i) => i !== index);
    setSchedule(updatedSchedule);
  };

  return (
    <div className="medications-container">
      <h2 className="medications-header">Medications</h2>

      <div className="form-container">
        <div className="form-group">
          <label htmlFor="medication-name">Medication Name</label>
          <input
            type="text"
            id="medication-name"
            className="form-input"
            placeholder="Enter medication name"
            value={medicationName}
            onChange={(e) => setMedicationName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="start-date">Start Date</label>
          <input
            type="date"
            id="start-date"
            className="form-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="frequency">Frequency</label>
          <button
            id="frequency"
            className="form-input frequency-button"
            onClick={() => setModalVisible(true)}
          >
            {frequency}
          </button>
        </div>

        {modalVisible && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 className="modal-header">Select Frequency</h3>
              {['Every day', 'Every x days', 'Day of the week', 'Day of the month'].map((freq) => (
                <button
                  key={freq}
                  className="modal-option"
                  onClick={() => handleSelectFrequency(freq)}
                >
                  {freq}
                </button>
              ))}
              <button className="modal-close" onClick={() => setModalVisible(false)}>
                Close
              </button>
            </div>
          </div>
        )}

        {frequency === 'Day of the week' && (
          <div className="days-grid">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <button
                key={day}
                className={`day-button ${selectedDays[day as keyof SelectedDays] ? 'selected' : ''}`}
                onClick={() => setSelectedDays((prev) => ({ ...prev, [day]: !prev[day as keyof SelectedDays] }))}
              >
                {day}
              </button>
            ))}
          </div>
        )}

        {frequency === 'Day of the month' && (
          <div className="dates-grid">
            {Array.from({ length: 31 }, (_, num) => (
              <button
                key={num + 1}
                className={`date-button ${selectedDates.includes(num + 1) ? 'selected' : ''}`}
                onClick={() => handleSelectDate(num + 1)}
              >
                {num + 1}
              </button>
            ))}
          </div>
        )}

        {frequency === 'Every x days' && (
          <div className="form-group">
            <label htmlFor="count">Number of Days</label>
            <input
              type="number"
              id="count"
              className="form-input"
              placeholder="Enter number of days"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="end-date">End Date</label>
          <input
            type="date"
            id="end-date"
            className="form-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="schedule-container">
          <h3 className="schedule-header">Schedule</h3>
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Dosage</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
  {schedule.map((entry, index) => (
    <tr key={index}>
      <td>
        <input
          type="time"
          value={entry.time}
          onChange={(e) => handleTimeChange(index, e.target.value)}
          className="time-input"
        />
      </td>
      <td>
        <button onClick={() => handleDecreaseDosage(index)} className="dosage-button">-</button>
        {entry.dosage}
        <button onClick={() => handleIncreaseDosage(index)} className="dosage-button">+</button>
      </td>
      <td>
        <button className="delete-button" onClick={() => handleDeleteRow(index)}>
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>

        <button className="submit-button" onClick={handleAddMedication}>
          Add Medication
        </button>
      </div>
    </div>
  );
};

export default Medications;