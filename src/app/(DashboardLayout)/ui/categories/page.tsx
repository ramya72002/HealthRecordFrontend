'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import './categories.scss';

const CategoriesContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileUrl = searchParams.get('fileUrl');
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [loading, setLoading] = useState(false);

  const categories = [
    "Cardiology (Heart Health)",
    "Neurology (Brain & Nerves)",
    "Endocrinology (Hormonal Health)",
    "Dermatology (Skin Health)",
    "Oncology (Cancer)",
    "Orthopedics (Bone & Muscle Health)",
    "Pulmonology (Lung Health)",
    "Gastroenterology (Digestive Health)",
    "Nephrology (Kidney Health)",
    "Urology (Urinary Health)",
    "Gynecology & Obstetrics (Women’s Health)",
    "Pediatrics (Child Health)",
    "Psychiatry & Mental Health",
    "Ophthalmology (Eye Health)",
    "ENT (Ear, Nose, Throat)",
    "Dental Health",
    "Immunology (Allergies & Immune System)",
    "Rheumatology (Autoimmune Diseases)",
    "General Medicine",
    "Surgery & Procedures"
  ];

  const handleUpload = async () => {
    if (!title || !selectedCategory || !date || !fileUrl) {
      console.log(title,selectedCategory,date,fileUrl)
      alert("All fields are required!");
      return;
    }

    setLoading(true);

    try {
      const userDetails = localStorage.getItem('userDetails');
      const parsedDetails = userDetails ? JSON.parse(userDetails) : null;

      if (!parsedDetails || !parsedDetails.user.email) {
        alert("User details not found. Please log in again.");
        setLoading(false);
        return;
      }

      const payload = {
        email: parsedDetails.user.email,
        image_url: fileUrl,
        title: title,
        category: selectedCategory,
        date_time: new Date(date).toISOString(),
      };

      const response = await fetch('https://health-project-backend-url.vercel.app/uploads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Record uploaded successfully!');
        router.push('/');
      } else {
        alert(result.message || 'Failed to upload record.');
      }
    } catch (error) {
      console.error('Error uploading record:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="header">Assign Tags</h1>

      <input
        type="text"
        className="input"
        placeholder="Enter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="pickerContainer">
        <label className="label">Select Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="picker"
        >
          <option value="">-- Select a Category --</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="dateContainer">
        <label className="label">Select Date</label>
        <input
          type="datetime-local"
          className="dateInput"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {fileUrl && (
        <div className="imageContainer">
          <p className="imageText">Uploaded Image</p>
          <img src={fileUrl} alt="Uploaded" className="image" />
        </div>
      )}

      <button
        className="button"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload Record'}
      </button>
    </div>
  );
};

const Categories = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoriesContent />
    </Suspense>
  );
};

export default Categories;
