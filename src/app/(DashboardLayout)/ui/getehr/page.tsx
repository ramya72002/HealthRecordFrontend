"use client"; // Mark as a Client Component
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "./getehr.scss"; // Import SCSS module for styling

const DisplayRecords = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [email, setEmail] = useState(null);
  const [menuVisible, setMenuVisible] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchEmail = async () => {
      const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
      if (userDetails?.user.email) {
        setEmail(userDetails.user.email);
        setUserId(userDetails.user.user_id);
      } else {
        alert("User details not found. Please log in again.");
        router.push("/login"); // Redirect to login if user details are not found
      }
    };

    fetchEmail();
  }, []);

  useEffect(() => {
    if (email) {
      axios
        .get(`https://health-project-backend-url.vercel.app/get_uploaded_records?email=${email}`)
        .then((response) => {
          const uploads = response.data.uploads;
          setRecords(uploads);
          setFilteredRecords(uploads);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setLoading(false);
        });
    }
  }, [email]);

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Image link copied successfully.");
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterRecords(query, selectedCategory);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterRecords(searchQuery, category);
  };

  const filterRecords = (query, category) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = records.filter(
      (record) =>
        (category === "All" || record.category === category) &&
        (record.title.toLowerCase().includes(lowercasedQuery) ||
          record.category.toLowerCase().includes(lowercasedQuery))
    );
    setFilteredRecords(filtered);
  };

  const sortRecords = (order) => {
    const sorted = [...records].sort((a, b) => {
      const dateA = new Date(a.date_time);
      const dateB = new Date(b.date_time);
      return order === "latest" ? dateB - dateA : dateA - dateB;
    });
    setRecords(sorted);
    setFilteredRecords(sorted);
    setSortMenuVisible(false);
  };

  const handleEdit = (item, index) => {
    setMenuVisible(false);
    setEditIndex(index);
    setEditTitle(item.title);
    setEditCategory(item.category);
  };

  const handleSave = async (index) => {
    try {
      const updatedRecord = {
        user_id: userId,
        image_url: records[index].image_url,
        title: editTitle,
        category: editCategory,
      };

      const response = await axios.put(
        "https://health-project-backend-url.vercel.app/update_uploads_t&c",
        updatedRecord
      );

      if (response.data.success) {
        const updatedRecords = [...records];
        updatedRecords[index] = { ...updatedRecords[index], title: editTitle, category: editCategory };
        setRecords(updatedRecords);
        setFilteredRecords(updatedRecords);
        setEditIndex(null);
        alert("Upload details updated successfully.");
      } else {
        alert(`Failed to update upload details: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error while saving data:", error);
      alert("An error occurred while saving the changes.");
    }
  };

  const renderItem = ({ item, index }) => (
    <div className="recordContainer">
      <img src={item.image_url} alt={item.title} className="image" />
      <div className="detailsContainer">
        {editIndex === index ? (
          <>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="editInput"
            />
            <input
              type="text"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="editInput"
            />
          </>
        ) : (
          <>
            <h3 className="title">{item.title}</h3>
            <p className="category">{item.category}</p>
          </>
        )}
        <div className="dateContainer">
          <p className="date">{new Date(item.date_time).toLocaleString()}</p>
          {editIndex === index && (
            <button onClick={() => handleSave(index)} className="saveButton">
              Save
            </button>
          )}
        </div>
      </div>
      <button
        onClick={() => setMenuVisible(menuVisible === index ? null : index)}
        className="menuButton"
      >
        ⋮
      </button>
      {menuVisible === index && (
        <div className="contextMenu">
          <button onClick={() => handleCopyLink(item.image_url)} className="menuOption">
            🗌 Copy Link
          </button>
          {editingRecord === item.id ? (
            <button onClick={() => handleSave(item.id)} className="menuOption">
              💾 Save
            </button>
          ) : (
            <button onClick={() => handleEdit(item, index)} className="menuOption">
              ✏ Edit
            </button>
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return <div className="loadingContainer">Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="header">Health Records</h1>
      <div className="filterContainer">
        <input
          type="text"
          placeholder="Search by title or category"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="searchBox"
        />
        <button onClick={() => setSortMenuVisible(!sortMenuVisible)} className="sortButton">
          Sort ⋮
        </button>
        {sortMenuVisible && (
          <div className="sortMenu">
            <button onClick={() => sortRecords("latest")} className="sortOption">
              Latest First
            </button>
            <button onClick={() => sortRecords("oldest")} className="sortOption">
              Old First
            </button>
          </div>
        )}
      </div>
      <div className="recordsList">
        {filteredRecords.map((item, index) => renderItem({ item, index }))}
      </div>
    </div>
  );
};

export default DisplayRecords;
