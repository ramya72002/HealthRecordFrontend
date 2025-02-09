'use client'
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
const UploadImage = () => {
  const router=useRouter();
  const [image, setImage] = useState<File | null>(null); // Explicitly typed as File | null
  const [preview, setPreview] = useState<string | null>(null); // Explicitly typed as string | null
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; 
    if (file) {
      setImage(file); // TypeScript now knows image can be a File
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image first.");

    const formData = new FormData();
    formData.append("file", image);

    try {
      setUploading(true);
      const response = await axios.post(
        "https://health-project-backend-url.vercel.app/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const { image_url } = response.data;
        alert("Image uploaded successfully!");
        // Optionally, redirect after upload
        router.push(`/ui/categories?imageUrl=${image_url}`);
      } else {
        alert("Error uploading image");
      }
    } catch (error) {
      alert("Error uploading image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Image</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
      {preview && (
        <img src={preview} alt="Preview" className="w-64 h-64 object-cover mb-4 border rounded" />
      )}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
};

export default UploadImage;
