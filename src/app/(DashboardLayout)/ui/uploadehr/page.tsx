'use client';
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const UploadFile = () => {  // Renamed to UploadFile to reflect broader support
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null); 
  const [preview, setPreview] = useState<string | null>(null); 
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]; 
    if (selectedFile) {
      setFile(selectedFile);
      
      // Preview only if it's an image
      if (selectedFile.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");

    const formData = new FormData();
    formData.append("file", file);

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
        const { file_url } = response.data;  // Updated to match backend response
        alert("File uploaded successfully!");
        
        // Redirect with file URL
        router.push(`/ui/categories?fileUrl=${file_url}`);
      } else {
        alert("Error uploading file");
      }
    } catch (error) {
      alert("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Upload File</h1>
      
      {/* Remove accept="image/*" if you want to allow all file types */}
      <input type="file" onChange={handleFileChange} className="mb-4" />

      {/* Show image preview if applicable */}
      {preview && (
        <img src={preview} alt="Preview" className="w-64 h-64 object-cover mb-4 border rounded" />
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>
    </div>
  );
};

export default UploadFile;
