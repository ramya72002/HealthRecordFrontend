"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import QRCode from "qrcode"; // For generating QR codes
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS

const Home = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userDetails = localStorage.getItem("userDetails");
        if (userDetails) {
          const parsedDetails = JSON.parse(userDetails);
          if (parsedDetails?.user?.user_id) {
            const id = parsedDetails.user.user_id;
            setUserId(id);
            generateQrCode(id);
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

  const generateQrCode = async (id: string) => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(id);
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleCopy = () => {
    if (userId) {
      navigator.clipboard.writeText(userId);
      toast.success("User ID copied to clipboard!", {
        autoClose: 2000, // Set autoClose to 2 seconds
        position: "top-center",
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    }
  };

  const handleTabClick = (route: string) => {
    router.push(route);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4">
      {/* Toast Notification */}
      <ToastContainer />

      {/* Tabs */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 mb-4">
        <div className="flex justify-around">
          {["/ui/uploadehr", "/ui/getehr", "/ui/sendehr"].map((route, index) => (
            <button
              key={index}
              className="text-blue-600 font-semibold hover:text-blue-800"
              onClick={() => handleTabClick(route)}
            >
              {route.split("/")[2].replace("ehr", " EHR").replace(/ui/, "").toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Container */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-center">
          <Image
            src="/images/upload.png"
            alt="Upload"
            width={100}
            height={100}
            className="rounded-full border-2 border-gray-300"
          />
        </div>

        <p className="text-sm text-gray-700 text-center mt-4 leading-relaxed">
          Share your user ID with your doctor to upload your records from them.
        </p>

        {loading ? (
          <div className="flex justify-center mt-6">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="mt-6 text-center">
              <input
                type="text"
                value={userId || "Loading..."}
                readOnly
                className="text-blue-600 font-bold text-sm text-center border-b-2 border-gray-300 focus:outline-none cursor-pointer"
                onClick={handleCopy}
              />
            </div>

            {qrCodeUrl && (
              <div className="mt-6 flex flex-col items-center">
                <p className="text-sm text-gray-700 mb-4">
                  Scan this QR code to share your User ID:
                </p>
                <Image
                  src={qrCodeUrl}
                  alt="QR Code"
                  width={150}
                  height={150}
                  className="border-2 border-gray-300 rounded-lg"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
