import { X } from "lucide-react";
import type { VisaService } from "../types/visaService.types";

interface VisaServiceViewModalProps {
  isOpen: boolean;
  visaService: VisaService | null;
  onClose: () => void;
}

export default function VisaServiceViewModal({
  isOpen,
  visaService,
  onClose,
}: VisaServiceViewModalProps) {
  if (!isOpen || !visaService) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-green-50">
          <h2 className="text-2xl font-semibold text-gray-800">
            {visaService.serviceType}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 transition-all rounded-full hover:text-blue-600 hover:bg-blue-100/50 focus:outline-none focus:ring-0"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Service Information */}
          <div>
            <h3 className="mb-4 text-xs font-medium tracking-wider text-gray-500 uppercase">
              Visa Service Information
            </h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Service Type" value={visaService.serviceType || "N/A"} />
              <Field label="Country" value={visaService.country || "N/A"} />
            </div>
          </div>

          {/* Fee Information */}
          <div>
            <h3 className="mb-4 text-xs font-medium tracking-wider text-gray-500 uppercase">
              Fee Details
            </h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Agent Service Fee" value={visaService.serviceFee || "N/A"} />
              <Field label="Government Fee" value={visaService.governmentFee || "N/A"} />
              <Field label="Referral Fee" value={visaService.referralFee || "N/A"} />
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="mb-4 text-xs font-medium tracking-wider text-gray-500 uppercase">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Processing Time" value={visaService.processingTime || "N/A"} />
              <Field 
                label="Application Method" 
                value={
                  visaService.applicationField && visaService.applicationField.trim() !== "" ? (
                    /^(https?:\/\/|www\.)/i.test(visaService.applicationField.trim()) ? (
                      <a
                        href={visaService.applicationField.startsWith('http') ? visaService.applicationField : `https://${visaService.applicationField}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 break-all"
                      >
                        {visaService.applicationField}
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      visaService.applicationField
                    )
                  ) : (
                    "N/A"
                  )
                } 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-1.5">{label}</p>
      <div className="text-sm text-gray-800">{value}</div>
    </div>
  );
}
