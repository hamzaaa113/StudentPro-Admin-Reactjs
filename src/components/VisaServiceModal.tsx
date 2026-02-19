import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { toast } from "../lib/toast";
import type { VisaService, CreateVisaServiceData } from "../types/visaService.types";
import { FILTER_COUNTRIES } from "../utils/helpers";

interface VisaServiceModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  visaService?: VisaService | null;
  onClose: () => void;
  onSubmit: (data: CreateVisaServiceData) => Promise<boolean>;
}

export default function VisaServiceModal({
  isOpen,
  mode,
  visaService,
  onClose,
  onSubmit,
}: VisaServiceModalProps) {
  // Form states
  const [formData, setFormData] = useState<Partial<CreateVisaServiceData>>({
    serviceType: "",
    country: "",
    serviceFee: "",
    referralFee: "",
    governmentFee: "",
    processingTime: "",
    applicationField: "",
  });

  // Update form data when visaService or mode changes
  useEffect(() => {
    if (mode === "edit" && visaService) {
      // Intentional: syncing form state with prop changes for edit mode
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        serviceType: visaService.serviceType,
        country: visaService.country,
        serviceFee: visaService.serviceFee,
        referralFee: visaService.referralFee,
        governmentFee: visaService.governmentFee || "",
        processingTime: visaService.processingTime || "",
        applicationField: visaService.applicationField || "",
      });
    } else if (mode === "create") {
      setFormData({
        serviceType: "",
        country: "",
        serviceFee: "",
        referralFee: "",
        governmentFee: "",
        processingTime: "",
        applicationField: "",
      });
    }
  }, [mode, visaService]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.serviceType?.trim()) {
      toast.error("Service type is required");
      return;
    }
    if (!formData.country?.trim()) {
      toast.error("Country is required");
      return;
    }
    if (!formData.serviceFee?.trim()) {
      toast.error("Service fee is required");
      return;
    }
    if (!formData.referralFee?.trim()) {
      toast.error("Referral fee is required");
      return;
    }

    const cleanedData: CreateVisaServiceData = {
      serviceType: formData.serviceType.trim(),
      country: formData.country.trim(),
      serviceFee: formData.serviceFee.trim(),
      referralFee: formData.referralFee.trim(),
      governmentFee: formData.governmentFee?.trim() || "",
      processingTime: formData.processingTime?.trim() || "",
      applicationField: formData.applicationField?.trim() || "",
    };

    const success = await onSubmit(cleanedData);
    if (success) {
      onClose();
      resetForm();
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      serviceType: "",
      country: "",
      serviceFee: "",
      referralFee: "",
      governmentFee: "",
      processingTime: "",
      applicationField: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">
            {mode === "create" ? "Create New Visa Service" : "Edit Visa Service"}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Service Information */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Service Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  placeholder="e.g., Student Visa, Work Visa"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                >
                  <option value="">Select Country</option>
                  {FILTER_COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Fee Information */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Fee Details</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Agent Service Fee <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  value={formData.serviceFee}
                  onChange={(e) => setFormData({ ...formData, serviceFee: e.target.value })}
                  placeholder="e.g., $500, 500 USD"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Referral Fee <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  value={formData.referralFee}
                  onChange={(e) => setFormData({ ...formData, referralFee: e.target.value })}
                  placeholder="e.g., $50, 10%"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Government Fee
                </label>
                <Input
                  value={formData.governmentFee}
                  onChange={(e) => setFormData({ ...formData, governmentFee: e.target.value })}
                  placeholder="e.g., $100, 100 USD"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Additional Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Processing Time
                </label>
                <Input
                  value={formData.processingTime}
                  onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                  placeholder="e.g., 2-4 weeks"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Application Method
                </label>
                <Input
                  value={formData.applicationField}
                  onChange={(e) => setFormData({ ...formData, applicationField: e.target.value })}
                  placeholder="Enter application field or link"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0A1F38] hover:bg-[#10192c] text-white">
              {mode === "create" ? "Create Service" : "Update Service"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
