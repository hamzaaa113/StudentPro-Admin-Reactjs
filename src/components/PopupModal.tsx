import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { CreatePopupData, UpdatePopupData, Popup } from "../types/popup.types";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePopupData | UpdatePopupData) => Promise<void>;
  popup?: Popup;
  mode: "create" | "edit";
}

const PopupModal = ({ isOpen, onClose, onSubmit, popup, mode }: PopupModalProps) => {
  const [formData, setFormData] = useState<CreatePopupData>({
    headline: "",
    offers: [],
    photoUrl: "",
    isActive: true,
    priority: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
  });
  const [currentOffer, setCurrentOffer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens or popup data changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        headline: popup?.headline || "",
        offers: popup?.offers || [],
        photoUrl: popup?.photoUrl || "",
        isActive: popup?.isActive ?? true,
        priority: popup?.priority || 0,
        startDate: popup?.startDate ? new Date(popup.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        endDate: popup?.endDate ? new Date(popup.endDate).toISOString().split('T')[0] : "",
      });
      setCurrentOffer("");
    }
  }, [isOpen, popup]);

  if (!isOpen) return null;

  const handleAddOffer = () => {
    if (currentOffer.trim()) {
      setFormData({
        ...formData,
        offers: [...formData.offers, currentOffer.trim()],
      });
      setCurrentOffer("");
    }
  };

  const handleRemoveOffer = (index: number) => {
    setFormData({
      ...formData,
      offers: formData.offers.filter((_: string, i: number) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        endDate: formData.endDate || undefined,
      };
      console.log("Submitting popup data:", submitData);
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error("Error submitting popup:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === "create" ? "Create New Popup" : "Edit Popup"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-full hover:bg-gray-100"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Headline */}
          <div className="space-y-2">
            <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
              Headline <span className="text-red-500">*</span>
            </label>
            <Input
              id="headline"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              placeholder="Enter popup headline"
              required
              className="w-full"
            />
          </div>

          {/* Photo URL */}
          <div className="space-y-2">
            <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700">
              Photo URL (Optional)
            </label>
            <Input
              id="photoUrl"
              value={formData.photoUrl}
              onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
              placeholder="https://example.com/image.jpg or https://picsum.photos/800/600"
              className="w-full"
            />
            
          </div>

          {/* Offers */}
          <div className="space-y-2">
            <label htmlFor="offers" className="block text-sm font-medium text-gray-700">Offers</label>
            <div className="flex gap-2">
              <Input
                id="offers"
                value={currentOffer}
                onChange={(e) => setCurrentOffer(e.target.value)}
                placeholder="Enter an offer"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddOffer();
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddOffer}
                variant="outline"
                className="whitespace-nowrap"
              >
                Add Offer
              </Button>
            </div>

            {/* Display offers */}
            {formData.offers.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.offers.map((offer: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 rounded-lg bg-gray-50"
                  >
                    <span className="flex-1 text-sm text-gray-700">{offer}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOffer(index)}
                      className="p-1 transition-colors rounded hover:bg-gray-200"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority (Higher shows first)</label>
            <Input
              id="priority"
              type="number"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value === '' ? 0 : Number(e.target.value) })}
              placeholder="0"
              className="w-full"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
            <div>
              <label htmlFor="isActive" className="text-base font-medium text-gray-700">
                Active Status
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Enable this popup to be displayed to users
              </p>
            </div>
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-5 w-5 rounded border-gray-300 text-[#0A1F38] focus:ring-[#0A1F38]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.headline.trim()}
              className="bg-[#0A1F38] hover:bg-[#0A1F38]/90"
            >
              {isSubmitting ? "Saving..." : mode === "create" ? "Create Popup" : "Update Popup"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupModal;
