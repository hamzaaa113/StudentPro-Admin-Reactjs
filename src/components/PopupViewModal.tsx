import { X } from "lucide-react";
import type { Popup } from "../types/popup.types";
import { Button } from "./ui/Button";

interface PopupViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  popup: Popup | null;
}

const PopupViewModal = ({ isOpen, onClose, popup }: PopupViewModalProps) => {
  if (!isOpen || !popup) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">Popup Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Headline */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Headline</h3>
            <p className="text-lg text-gray-800">{popup.headline}</p>
          </div>

          {/* Offers */}
          {popup.offers.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Offers</h3>
              <ul className="space-y-2">
                {popup.offers.map((offer, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-[#0A1F38] text-white rounded-full flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{offer}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Status</h3>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  popup.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {popup.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Priority</h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {popup.priority}
              </span>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Date Range</h3>
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div>
                <span className="text-sm text-gray-500">Start Date:</span>
                <p className="text-gray-800">{formatDate(popup.startDate)}</p>
              </div>
              {popup.endDate && (
                <div>
                  <span className="text-sm text-gray-500">End Date:</span>
                  <p className="text-gray-800">{formatDate(popup.endDate)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Created By */}
          {popup.createdBy && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Created By</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-800 font-medium">{popup.createdBy.name}</p>
                <p className="text-sm text-gray-500">{popup.createdBy.email}</p>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Created:</span> {formatDate(popup.createdAt)}
            </div>
            <div>
              <span className="font-medium">Updated:</span> {formatDate(popup.updatedAt)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t">
          <Button onClick={onClose} className="bg-[#0A1F38] hover:bg-[#0A1F38]/90">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopupViewModal;
