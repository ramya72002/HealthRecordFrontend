'use client'
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./sendehr.scss";
import axios from "axios";

const AddUserID = () => {
  const router = useRouter();
  const [userID, setUserID] = useState("");
  const [images, setImages] = useState<File[]>([]);


  const handleSubmit = async () => {
    if (!userID) {
      alert("Please enter a user ID.");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append("files", image);
      });

      const uploadResponse = await axios.post("https://health-project-backend-url.vercel.app/multi_upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { image_urls } = uploadResponse.data;

      const payload = {
        user_id: userID,
        image_urls,
        title: "Sample Title",
        category: "Sample Category",
        date_time: new Date().toISOString(),
      };

      const response = await axios.post("https://health-project-backend-url.vercel.app/uploads_wrt_userId", payload);

      if (response.status === 200) {
        alert("Images and details uploaded successfully!");
        router.push("/");
      } else {
        alert(`Failed to save uploads: ${response.data.message}`);
      }
    } catch (error) {
      alert(`An error occurred: `);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <div className="container">
      <h1 className="header">Send Records To User ID</h1>
      <input
        type="text"
        placeholder="Enter User ID"
        value={userID}
        onChange={(e) => setUserID(e.target.value)}
        className="input"
      />
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="fileInput"
      />
      <div className="imagePreviewContainer">
        {Array.from(images).map((image, index) => (
          <Image
            key={index}
            src={URL.createObjectURL(image)}
            alt={`preview-${index}`}
            width={100}
            height={100}
            className="imagePreview"
          />
        ))}
      </div>
      <button className="button" onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default AddUserID;
