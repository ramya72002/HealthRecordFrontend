'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

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
    <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Medications</h2>

      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        placeholder="Medication Name"
        value={medicationName}
        onChange={(e) => setMedicationName(e.target.value)}
      />

      <input
        type="date"
        className="w-full p-2 border rounded mb-4"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <button className="w-full p-2 bg-blue-500 text-white rounded mb-4" onClick={() => setModalVisible(true)}>
        {frequency}
      </button>

      {modalVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Select Frequency</h3>
            {['Every day', 'Every x days', 'Day of the week', 'Day of the month'].map((freq) => (
              <button
                key={freq}
                className="block w-full text-left p-2 border-b hover:bg-blue-100"
                onClick={() => handleSelectFrequency(freq)}
              >
                {freq}
              </button>
            ))}
            <button className="w-full p-2 mt-2 bg-red-500 text-white rounded" onClick={() => setModalVisible(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {frequency === 'Day of the week' && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <button
              key={day}
              className={`p-2 border rounded ${selectedDays[day as keyof SelectedDays] ? 'bg-green-300' : 'bg-gray-200'} hover:bg-blue-100`}
              onClick={() => setSelectedDays((prev) => ({ ...prev, [day]: !prev[day as keyof SelectedDays] }))}
            >
              {day}
            </button>
          ))}
        </div>
      )}

      {frequency === 'Day of the month' && (
        <div className="grid grid-cols-7 gap-2 mb-4">
          {Array.from({ length: 31 }, (_, num) => (
            <button
              key={num + 1}
              className={`p-2 border rounded ${selectedDates.includes(num + 1) ? 'bg-green-300' : 'bg-gray-200'} hover:bg-blue-100`}
              onClick={() => handleSelectDate(num + 1)}
            >
              {num + 1}
            </button>
          ))}
        </div>
      )}

      {frequency === 'Every x days' && (
        <input
          type="number"
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter number of days"
          value={count}
          onChange={(e) => setCount(e.target.value)}
        />
      )}

      <input
        type="date"
        className="w-full p-2 border rounded mb-4"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder='End Date'
      />

      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Schedule</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Time</th>
              <th className="border p-2">Dosage</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((entry, index) => (
              <tr key={index}>
                <td className="border p-2">
                  <input
                    type="time"
                    value={entry.time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="border p-2">{entry.dosage}</td>
                <td className="border p-2">
                  <button
                    className="p-1 bg-red-500 text-white rounded hover:bg-red-700"
                    onClick={() => handleDeleteRow(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-700" onClick={handleAddMedication}>
        Add Medication
      </button>
    </div>
  );
};

export default Medications;
