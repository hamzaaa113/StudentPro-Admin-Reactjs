import { X } from "lucide-react";
import type { Accommodation } from "../types/accommodation";

interface AccommodationViewModalProps {
  isOpen: boolean;
  accommodation: Accommodation | null;
  onClose: () => void;
}

export default function AccommodationViewModal({
  isOpen,
  accommodation,
  onClose,
}: AccommodationViewModalProps) {
  if (!isOpen || !accommodation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-green-50">
          <h2 className="text-2xl font-semibold text-gray-800">
            {accommodation.company}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-blue-600 hover:bg-blue-100/50 rounded-full p-1 transition-all focus:outline-none focus:ring-0"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-7">
          {/* Basic Information */}
          <div>
            <h3 className="mb-4 text-xs font-medium tracking-wider text-gray-500 uppercase">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <Field label="Company" value={accommodation.company || "N/A"} />
              <Field label="Country" value={accommodation.country || "N/A"} />
            </div>
          </div>

          {/* Locations */}
          {accommodation.locations && accommodation.locations.length > 0 && (
            <div>
              <h3 className="mb-4 text-xs font-medium tracking-wider text-gray-500 uppercase">
                Locations
              </h3>
              <p className="text-sm text-gray-700">
                {accommodation.locations.join(", ")}
              </p>
            </div>
          )}

          {/* Items */}
          {accommodation.items && accommodation.items.length > 0 && (
            <div>
              <h3 className="mb-4 text-xs font-medium tracking-wider text-gray-500 uppercase">
                Accommodation Items ({accommodation.items.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item Name
                      </th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commission
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {accommodation.items.map((item, index) => (
                      <tr key={item._id || index}>
                        <td className="py-2 px-3 text-sm text-gray-800">
                          {item.name}
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-800 text-right">
                          {typeof item.commission === 'number' ? `$${item.commission.toFixed(2)}` : item.commission}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  );
}
