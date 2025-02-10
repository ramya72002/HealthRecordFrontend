'use client';
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const UploadFile = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);  // Error message for file size

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB in bytes

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      console.log(selectedFile.size,MAX_FILE_SIZE)
      if (selectedFile.size >=MAX_FILE_SIZE) {
        setError("File size must be 1 MB or less.");
        setFile(null);
        setPreview(null);
      } else {
        setFile(selectedFile);
        setError(null); // Clear any previous errors
        
        if (selectedFile.type.startsWith('image/')) {
          setPreview(URL.createObjectURL(selectedFile));
        } else {
          setPreview(null);
        }
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return alert("Please select a valid file under 1 MB.");
    }

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
        const { file_url } = response.data;
        alert("File uploaded successfully!");
        router.push(`/ui/categories?fileUrl=${file_url}`);
      } else {
        alert("Error uploading file.");
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
      
      <input type="file" onChange={handleFileChange} className="mb-4" />

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Show image preview if applicable */}
      {preview && (
        <img src={preview} alt="Preview" className="w-64 h-64 object-cover mb-4 border rounded" />
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || !!error}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>
    </div>
  );
};

export default UploadFile;
