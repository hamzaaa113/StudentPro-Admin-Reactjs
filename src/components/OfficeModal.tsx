import { useState } from "react";
import { X } from "lucide-react";
import type { Office, OfficeFormData } from "../types/contact.types";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface OfficeModalProps {
  onClose: () => void;
  onSubmit: (data: Partial<OfficeFormData>) => Promise<boolean>;
  office?: Office;
  mode: "create" | "edit";
}

const OfficeModal = ({
  onClose,
  onSubmit,
  office,
  mode,
}: OfficeModalProps) => {
  const [formData, setFormData] = useState({
    name: office?.name || "",
    address: office?.address || "",
    phone: office?.phone || "",
    mapUrl: office?.mapUrl || "",
    order: office?.order ?? 0,
    isActive: office?.isActive ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    const ok = await onSubmit(formData);
    setIsSubmitting(false);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === "create" ? "Add Office" : "Edit Office"}
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
          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="office-name" className="block text-sm font-medium text-gray-700">
              Office Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="office-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. SYDNEY"
              required
              className="w-full"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label htmlFor="office-address" className="block text-sm font-medium text-gray-700">
              Address <span className="text-red-500">*</span>
            </label>
            <Input
              id="office-address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full street address"
              required
              className="w-full"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label htmlFor="office-phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <Input
              id="office-phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+61 493 167017"
              className="w-full"
            />
          </div>

          {/* Map URL */}
          <div className="space-y-2">
            <label htmlFor="office-map" className="block text-sm font-medium text-gray-700">
              Google Maps Embed URL
            </label>
            <Input
              id="office-map"
              value={formData.mapUrl}
              onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
              placeholder="https://maps.google.com/maps?q=...&output=embed"
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              In Google Maps: Share → Embed a map → copy the src URL from the
              iframe. Leave blank to hide the map for this office.
            </p>
          </div>

          {/* Map preview */}
          {formData.mapUrl && (
            <div className="h-48 overflow-hidden border border-gray-200 rounded">
              <iframe
                src={formData.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Map preview"
              ></iframe>
            </div>
          )}

          {/* Order + Active */}
          <div className="grid items-end gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="office-order" className="block text-sm font-medium text-gray-700">
                Display Order
              </label>
              <Input
                id="office-order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>
            <label className="flex items-center gap-2 pb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700">
                Show on the Contact Us page
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-700 bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : mode === "create" ? "Add" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfficeModal;
