import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Gift, Sparkles } from "lucide-react";
import type { Popup } from "../types/popup.types";

interface PromotionalPopupProps {
  popup: Popup;
  onClose: () => void;
}

const PromotionalPopup = ({ popup, onClose }: PromotionalPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, [popup]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleContactUs = () => {
    navigate("/contact-us");
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-2xl transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Decorative background elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#ABDBC0] rounded-full opacity-20 blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#0A1F38] rounded-full opacity-20 blur-2xl animate-pulse delay-75"></div>

        {/* Main popup content */}
        <div key={popup._id} className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col max-h-[85vh]">
          {/* Header with decorative pattern */}
          <div className="relative bg-gradient-to-r from-[#0A1F38] to-[#0d2a4d] p-6 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ABDBC0] rounded-full opacity-10 -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#ABDBC0] rounded-full opacity-10 -ml-12 -mb-12"></div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute z-10 p-2 transition-all duration-200 rounded-full top-4 right-4 bg-white/10 hover:bg-white/20 hover:rotate-90 backdrop-blur-sm"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Header content */}
            <div className="relative flex items-center gap-3">
              <div className="p-3 bg-[#ABDBC0] rounded-full">
                <Gift className="w-6 h-6 text-[#0A1F38]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#ABDBC0]" />
                  <span className="text-xs font-semibold text-[#ABDBC0] uppercase tracking-wider">
                    Special Offer
                  </span>
                </div>
                <h2 className="text-2xl font-bold leading-tight text-white">
                  {popup.headline}
                </h2>
              </div>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            {/* Display image if photoUrl exists and loads successfully, otherwise show offers */}
            {popup.photoUrl && popup.photoUrl.trim() !== "" && !imageError ? (
              <div className="mb-4 -mx-6 -mt-6">
                <img
                  src={popup.photoUrl}
                  alt={popup.headline}
                  className="w-full h-[350px] object-cover"
                  onError={() => {
                    console.error('Failed to load image:', popup.photoUrl);
                    setImageError(true);
                  }}
                />
              </div>
            ) : popup.photoUrl && popup.photoUrl.trim() !== "" && imageError ? (
              <div className="-mx-6 -mt-6 mb-4 bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex flex-col items-center justify-center min-h-[200px] border-b border-gray-300">
                <div className="mb-3 text-gray-400">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="mb-1 text-sm text-center text-gray-500">Image failed to load</p>
                <p className="text-xs text-center text-gray-400">Please use a direct image URL (ending in .jpg, .png, .gif, etc.)</p>
              </div>
            ) : (
              popup.offers.length > 0 && (
                <div className="space-y-3">
                  {/* Display only the first offer prominently */}
                  <div className="p-6 bg-gradient-to-r from-[#ABDBC0]/20 to-transparent rounded-xl border-2 border-[#ABDBC0]/30">
                    <p className="text-lg font-semibold leading-relaxed text-center text-gray-800">
                      {popup.offers[0]}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="p-6 pt-4 space-y-3 bg-white border-t border-gray-200">
            {/* Action button */}
            <button
              onClick={handleContactUs}
              className="w-full py-3 px-6 bg-gradient-to-r from-[#0A1F38] to-[#0d2a4d] hover:from-[#0d2a4d] hover:to-[#0A1F38] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
                Avail Now
            </button>

            {/* Footer note */}
            <p className="text-xs text-center text-gray-500">
              This offer is valid until{" "}
              {popup.endDate
                ? new Date(popup.endDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "further notice"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalPopup;
