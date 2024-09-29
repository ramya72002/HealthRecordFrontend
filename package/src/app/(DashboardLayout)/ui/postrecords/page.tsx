'use client'
import React, { useState } from 'react';
import './postrecords.scss';

const categories = [
  'Cardiology (Heart Health)',
  'Neurology (Brain & Nerves)',
  'Endocrinology (Hormonal Health)',
  'Dermatology (Skin Health)',
  'Oncology (Cancer)',
  'Orthopedics (Bone & Muscle Health)',
  'Pulmonology (Lung Health)',
  'Gastroenterology (Digestive Health)',
  'Nephrology (Kidney Health)',
  'Urology (Urinary Health)',
  'Gynecology & Obstetrics (Women’s Health)',
  'Pediatrics (Child Health)',
  'Psychiatry & Mental Health',
  'Ophthalmology (Eye Health)',
  'ENT (Ear, Nose, Throat)',
  'Dental Health',
  'Immunology (Allergies & Immune System)',
  'Rheumatology (Autoimmune Diseases)',
  'General Medicine',
  'Surgery & Procedures',
];

const PostRecords = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);

  const handleCategoryClick = (category:any) => {
    setSelectedCategory(category);
  };

  const handleImageUpload = (e:any) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Handle form submission logic (e.g., saving data, uploading image)
    console.log({
      title,
      category: selectedCategory,
      image,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    });
  };

  return (
    <div className="postrecords-container">
      {!selectedCategory ? (
        <>
          <h1 className="heading">Select a Health Record Category</h1>
          <div className="card-grid">
            {categories.map((category, index) => (
              <div
                key={index}
                className="category-card"
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="form-container">
          <h2 className="form-heading">Upload Health Record for {selectedCategory}</h2>
          <form onSubmit={handleSubmit} className="record-form">
            <div className="form-group">
              <label>Date</label>
              <input
                type="text"
                value={new Date().toLocaleDateString()}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input
                type="text"
                value={new Date().toLocaleTimeString()}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input type="text" value={selectedCategory} readOnly />
            </div>
            <div className="form-group">
              <label>Upload Image/PDF</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleImageUpload}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostRecords;
