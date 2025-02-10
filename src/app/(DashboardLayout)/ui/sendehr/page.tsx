'use client';
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./sendehr.scss";
import axios from "axios";

const AddUserID = () => {
  const router = useRouter();
  const [userID, setUserID] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!userID) {
      alert("Please enter a user ID.");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("files", image);
      });

      const uploadResponse = await axios.post(
        "https://health-project-backend-url.vercel.app/multi_upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { image_urls } = uploadResponse.data;

      const payload = {
        user_id: userID,
        image_urls,
        title: "Sample Title",
        category: "Sample Category",
        date_time: new Date().toISOString(),
      };

      const response = await axios.post(
        "https://health-project-backend-url.vercel.app/uploads_wrt_userId",
        payload
      );

      if (response.status === 200) {
        alert("Images and details uploaded successfully!");
        router.push("/dashboard")
      } else {
        alert(`Failed to save uploads: ${response.data.message}`);
      }
    } catch (error) {
      alert(`An error occurred `);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <div className="add-user-container">
      <h1 className="header">Send Records to User ID</h1>
      <div className="form-container">
        <input
          type="text"
          placeholder="Enter User ID"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          className="input"
          aria-label="User ID"
        />
        <div className="file-upload-container">
          <label htmlFor="file-upload" className="file-upload-label">
            Upload Images
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              className="file-input"
              aria-label="Upload Images"
            />
          </label>
        </div>
        <div className="image-preview-container">
          {images.map((image, index) => (
            <div key={index} className="image-preview-wrapper">
              <Image
                src={URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
                width={100}
                height={100}
                className="image-preview"
              />
            </div>
          ))}
        </div>
        <button
          className="button"
          onClick={handleSubmit}
          disabled={isLoading}
          aria-label="Submit"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default AddUserID;