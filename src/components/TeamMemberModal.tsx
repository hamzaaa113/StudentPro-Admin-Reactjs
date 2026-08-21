import { useState, useRef } from "react";
import { X, Upload, User, Loader2 } from "lucide-react";
import type { TeamMember, TeamMemberFormData } from "../types/contact.types";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface TeamMemberModalProps {
  onClose: () => void;
  onSubmit: (data: Partial<TeamMemberFormData>) => Promise<boolean>;
  onUploadPhoto: (file: File) => Promise<string | null>;
  member?: TeamMember;
  mode: "create" | "edit";
}

const TeamMemberModal = ({
  onClose,
  onSubmit,
  onUploadPhoto,
  member,
  mode,
}: TeamMemberModalProps) => {
  const [formData, setFormData] = useState({
    name: member?.name || "",
    designation: member?.designation || "",
    phone: member?.phone || "",
    email: member?.email || "",
    address: member?.address || "",
    enquiryType: member?.enquiryType || "",
    photoUrl: member?.photoUrl || "",
    order: member?.order ?? 0,
    isActive: member?.isActive ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const url = await onUploadPhoto(file);
    if (url) {
      setFormData((prev) => ({ ...prev, photoUrl: url }));
    }
    setIsUploading(false);

    // allow re-picking the same file after a failed upload
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
            {mode === "create" ? "Add Team Member" : "Edit Team Member"}
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
          {/* Photo */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Profile Photo
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-24 h-24 overflow-hidden bg-gray-100 border border-gray-200 rounded-full">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User className="text-gray-300" size={40} />
                )}
              </div>
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="team-photo"
                />
                <label
                  htmlFor="team-photo"
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-colors border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {isUploading ? "Uploading..." : "Choose photo"}
                </label>
                <p className="text-xs text-gray-500">
                  JPG, PNG or WebP up to 5MB. Cropped to a square automatically.
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Danish Bhatti"
              required
              className="w-full"
            />
          </div>

          {/* Designation */}
          <div className="space-y-2">
            <label
              htmlFor="designation"
              className="block text-sm font-medium text-gray-700"
            >
              Designation <span className="text-red-500">*</span>
            </label>
            <Input
              id="designation"
              value={formData.designation}
              onChange={(e) =>
                setFormData({ ...formData, designation: e.target.value })
              }
              placeholder="e.g. Sr. Admission Officer"
              required
              className="w-full"
            />
          </div>

          {/* Enquiry type */}
          <div className="space-y-2">
            <label
              htmlFor="enquiryType"
              className="block text-sm font-medium text-gray-700"
            >
              Enquiry Type
            </label>
            <Input
              id="enquiryType"
              value={formData.enquiryType}
              onChange={(e) =>
                setFormData({ ...formData, enquiryType: e.target.value })
              }
              placeholder="e.g. B2B enquires"
              className="w-full"
            />
          </div>

          {/* Phone + Email */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+92 309 8849988"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@studentpro.com"
                className="w-full"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Office address"
              className="w-full"
            />
          </div>

          {/* Order + Active */}
          <div className="grid items-end gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                Display Order
              </label>
              <Input
                id="order"
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
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isSubmitting ? "Saving..." : mode === "create" ? "Add" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamMemberModal;
