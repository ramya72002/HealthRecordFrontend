"use client"; // Mark as a Client Component
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import QRCode from "qrcode"; // For generating QR codes
import { toast } from "react-toastify"; // For showing alerts
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS

const Home = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user details from localStorage
    const fetchUserId = () => {
      try {
        const userDetails = localStorage.getItem("userDetails");
        if (userDetails) {
          const parsedDetails = JSON.parse(userDetails);
          if (parsedDetails && parsedDetails.user.user_id) {
            setUserId(parsedDetails.user.user_id);
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  const handleCopy = () => {
    if (userId) {
      navigator.clipboard.writeText(userId); // Copy userId to clipboard
      toast.success("User ID copied to clipboard!"); // Show success message
    }
  };

  const handleAddMedications = () => {
    router.push("/add-medications"); // Navigate to Add Medications page
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4">
      {/* Container */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mt-10">
         
      <div className="flex justify-center">
          <Image
            src="/images/upload.png" // Path to your image in the public folder
            alt="Upload"
            width={100}
            height={100}
            className="rounded-full border-2 border-gray-300"
          />
        </div>
        {/* Text */}
        <p className="text-sm text-gray-700 text-center mt-4 leading-relaxed">
          Share your user ID with your doctor to upload your records from them.
        </p>

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex justify-center mt-6">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* User ID */}
            <div className="mt-6 text-center">
              <input
                type="text"
                value={userId || "Loading..."}
                readOnly
                className="text-blue-600 font-bold text-sm text-center border-b-2 border-gray-300 focus:outline-none cursor-pointer"
                onClick={handleCopy}
              />
            </div>

            {/* QR Code */}
            {userId && (
              <div className="mt-6 flex flex-col items-center">
                <p className="text-sm text-gray-700 mb-4">
                  Scan this QR code to share your User ID:
                </p>
                {/* <QRCode value={userId} size={150} bgColor="#ffffff" fgColor="#000000" /> */}
              </div>
            )}
          </>
        )}
      </div>
 
    </div>
  );
};

export default Home;