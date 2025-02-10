import React from "react";
import "../../(DashboardLayout)/ui/getehr/getehr.scss";
interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open("");
    printWindow?.document.write(`<img src="${imageUrl}" onload="window.print()" />`);
    printWindow?.document.close();
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <img src={imageUrl} alt="Full Screen" className="fullScreenImage" />
        <div className="modalActions">
          <button onClick={handleDownload} className="modalButton">
            Download
          </button>
          <button onClick={handlePrint} className="modalButton">
            Print
          </button>
          <button onClick={onClose} className="modalButton">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;