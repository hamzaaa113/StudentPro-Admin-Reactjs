import { X, ExternalLink, Globe } from "lucide-react";
import type { Institution } from "../types/institution.types";
import {
  renderTerritoryBadge,
  formatCoursesForDisplay,
} from "../utils/helpers";
import { useAuth } from "../contexts/AuthContext";

interface InstitutionViewModalProps {
  isOpen: boolean;
  institution: Institution | null;
  onClose: () => void;
}

export default function InstitutionViewModal({
  isOpen,
  institution,
  onClose,
}: InstitutionViewModalProps) {
  const { canViewCommission } = useAuth();
  if (!isOpen || !institution) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-2xl font-semibold text-gray-800">
            {institution.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600 focus:outline-none focus:ring-0"
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
              <Field label="Country" value={institution.country || "N/A"} />
              <Field label="State" value={institution.state || "N/A"} />
              <Field
                label="Sector"
                value={
                  <span className="px-2.5 py-1 text-xs font-normal bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                    {institution.sector || "N/A"}
                  </span>
                }
              />
              <Field label="Global" value={institution.global ? "Yes" : "No"} />
              <Field label="Group" value={institution.group || "N/A"} />
              <Field
                label="Scholarship"
                value={
                  institution.scholarship ? (
                    <a
                      href={institution.scholarship}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                    >
                      View Link
                      <ExternalLink size={13} />
                    </a>
                  ) : (
                    "N/A"
                  )
                }
              />
              <Field label="100% Promotion" value={institution.promotion || "N/A"} />
              <Field
                label="Turn Around Time"
                value={institution.tat || "N/A"}
              />
              {institution.url && (
                <div className="col-span-2">
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Website</p>
                  <a
                    href={institution.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:underline transition-colors text-sm"
                  >
                    {institution.url}
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Territory */}
          {(institution.global || (institution.territory && institution.territory.length > 0)) && (
            <div>
              <h3 className="mb-4 text-xs font-medium tracking-wider text-gray-500 uppercase">
                Territory
              </h3>
              <div className="flex flex-wrap items-center gap-2.5">
                {institution.global ? (
                  <span
                    className="inline-flex items-center justify-center text-gray-500 transition-all duration-200 w-9 h-9 hover:text-gray-700 hover:scale-110"
                    title="Global"
                  >
                    <Globe size={20} />
                  </span>
                ) : (
                  institution.territory.map((t, idx) => {
                    const territoryData = renderTerritoryBadge(t);
                    if (!territoryData.displayText) return null;

                    if (territoryData.isGlobal) {
                      return (
                        <span
                          key={idx}
                          className="inline-flex items-center justify-center text-gray-500 transition-all duration-200 w-9 h-9 hover:text-gray-700 hover:scale-110"
                          title="Global"
                        >
                          <Globe size={20} />
                        </span>
                      );
                    }

                    return (
                      <span
                        key={idx}
                        className="px-3 py-1.5 text-sm font-normal text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        {territoryData.displayText}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Courses */}
          {institution.course && institution.course.length > 0 && (
            <div>
              <h3 className="mb-4 text-xs font-medium tracking-wider text-gray-500 uppercase">
                Courses ({institution.course.length})
              </h3>
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {formatCoursesForDisplay(institution.course).map((courseData) => (
                  <div
                    key={courseData.key}
                    className="flex items-center justify-between p-3.5 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-white hover:border-gray-300 transition-colors"
                  >
                    <span className="text-sm text-gray-800">
                      {courseData.course}
                    </span>
                    {canViewCommission && (
                      <span className="inline-flex items-center px-3 py-1 ml-3 text-xs font-normal border rounded-md text-emerald-700 bg-emerald-50 border-emerald-100 whitespace-nowrap">
                        {courseData.commission}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Application Method */}
          {institution.applicationMethod && institution.applicationMethod.trim() && (
            <div>
              <h3 className="mb-4 text-xs font-medium tracking-wider text-gray-500 uppercase">
                Application Method
              </h3>
              <div className="p-3.5 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-white">
                <a href={institution.applicationMethod} className="text-sm text-gray-800 underline break-words transition-colors hover:text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  {institution.applicationMethod}
                </a>
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
