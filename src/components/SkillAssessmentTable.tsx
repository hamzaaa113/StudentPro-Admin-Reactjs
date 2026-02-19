import { Edit2, Trash2, Eye, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/Table";
import type { SkillAssessment } from "../types/skillAssessment.types";
import { useAuth } from "../contexts/AuthContext";

interface SkillAssessmentTableProps {
  skillAssessments: SkillAssessment[];
  onEdit: (skillAssessment: SkillAssessment) => void;
  onDelete: (id: string) => void;
  onView: (skillAssessment: SkillAssessment) => void;
}

export default function SkillAssessmentTable({
  skillAssessments,
  onEdit,
  onDelete,
  onView,
}: SkillAssessmentTableProps) {
  const { canDelete } = useAuth();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden overflow-x-auto rounded-md border md:block">
        <Table>
          <TableHeader className="bg-gradient-to-l from-[#ABDBC0] to-[#E3EFFE] shadow-sm">
            <TableRow className="border-b-black/10 transition-colors hover:bg-black/5">
              <TableHead className="w-[35px]"></TableHead>
              <TableHead>Occupation Groups</TableHead>
              <TableHead>Pathways</TableHead>
              <TableHead>Standard Fee (AUD)</TableHead>
              <TableHead>Priority Fee (AUD)</TableHead>
              <TableHead>Standard Time</TableHead>
              <TableHead>Assessing Body Name</TableHead>
              <TableHead>Priority Available</TableHead>
              <TableHead>Official Link</TableHead>
              <TableHead className="w-[90px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skillAssessments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="py-8 text-center text-gray-500">
                  No skill assessments found
                </TableCell>
              </TableRow>
            ) : (
              skillAssessments.map((assessment) => {
                const isExpanded = expandedRows.has(assessment._id);
                const hasDocumentsChecklist =
                  assessment.documentsChecklist && assessment.documentsChecklist.trim() !== "";

                return (
                  <>
                    <TableRow key={assessment._id}>
                      {/* Expand/Collapse Arrow */}
                      <TableCell>
                        {hasDocumentsChecklist ? (
                          <button
                            onClick={() => toggleRow(assessment._id)}
                            className="rounded p-1.5 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                            title={isExpanded ? "Collapse details" : "Expand details"}
                          >
                            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                          </button>
                        ) : (
                          <div className="w-[34px]"></div>
                        )}
                      </TableCell>

                      <TableCell className="text-sm text-gray-700">
                        {assessment.occupationGroups}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {assessment.pathwaysStreams}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-700">
                          {assessment.standardFeeAUD || "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-700">
                          {assessment.priorityFeeAUD || "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-700">
                          {assessment.standardProcessingTime || "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {assessment.assessingBodyName ? (
                          assessment.assessingBodyLink ? (
                            <a
                              href={assessment.assessingBodyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-700 transition-colors hover:text-blue-900 hover:underline"
                              title={assessment.assessingBodyLink}
                            >
                              {assessment.assessingBodyName}
                            </a>
                          ) : (
                            <span className="text-sm text-gray-700">
                              {assessment.assessingBodyName}
                            </span>
                          )
                        ) : (
                          <span className="text-sm text-gray-700">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-700">
                          {assessment.priorityAvailable || "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {assessment.officialLink ? (
                          <a
                            href={assessment.officialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-700 transition-colors hover:text-gray-700"
                            title={assessment.officialLink}
                          >
                            <span className="max-w-[120px] truncate text-sm">
                              {assessment.officialLink}
                            </span>
                          </a>
                        ) : (
                          <span className="text-sm text-gray-700">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onView(assessment)}
                            className="rounded p-1.5 text-blue-600 transition hover:bg-blue-50 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => onEdit(assessment)}
                            className="rounded p-1.5 text-green-600 transition hover:bg-green-50 hover:text-green-900"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this skill assessment?"
                                  )
                                ) {
                                  onDelete(assessment._id);
                                }
                              }}
                              className="rounded p-1.5 text-red-600 transition hover:bg-red-50 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Row - Documents Checklist */}
                    {isExpanded && hasDocumentsChecklist && (
                      <TableRow>
                        <TableCell colSpan={10} className="border-t border-gray-200 bg-gray-50">
                          <div className="px-4 py-3">
                            <h4 className="mb-2 text-sm font-semibold text-gray-700">
                              Documents Checklist:
                            </h4>
                            <ol className="list-inside list-decimal space-y-1 text-sm text-gray-600">
                              {assessment.documentsChecklist!.split(";").map((item, idx) => {
                                const trimmedItem = item.trim();
                                return trimmedItem ? <li key={idx}>{trimmedItem}</li> : null;
                              })}
                            </ol>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {skillAssessments.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No skill assessments found</div>
        ) : (
          skillAssessments.map((assessment) => (
            <div key={assessment._id} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-medium text-gray-500">Occupation Groups</span>
                  <p className="text-sm font-semibold text-gray-900">
                    {assessment.occupationGroups}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500">Pathways/Streams</span>
                  <p className="text-sm text-gray-900">{assessment.pathwaysStreams}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs font-medium text-gray-500">Standard Fee</span>
                    <p className="text-sm text-gray-900">{assessment.standardFeeAUD || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500">Priority Fee</span>
                    <p className="text-sm text-gray-900">{assessment.priorityFeeAUD || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500">Priority Available</span>
                  <p className="text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        assessment.priorityAvailable?.toLowerCase() === "yes"
                          ? "bg-green-100 text-green-800"
                          : assessment.priorityAvailable?.toLowerCase() === "no"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {assessment.priorityAvailable || "N/A"}
                    </span>
                  </p>
                </div>
                {assessment.documentsChecklist && (
                  <div>
                    <span className="text-xs font-medium text-gray-500">Documents Checklist</span>
                    <p className="text-sm text-gray-900">{assessment.documentsChecklist}</p>
                  </div>
                )}
                {assessment.officialLink && (
                  <div>
                    <span className="text-xs font-medium text-gray-500">Official Link</span>
                    <p className="text-sm">
                      <a
                        href={assessment.officialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <ExternalLink size={14} />
                        <span>Open Link</span>
                      </a>
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2 border-t pt-4">
                <button
                  onClick={() => onView(assessment)}
                  className="flex flex-1 items-center justify-center gap-2 rounded bg-blue-50 px-3 py-2 text-sm text-blue-600 transition-colors hover:bg-blue-100"
                >
                  <Eye size={16} />
                  View
                </button>
                <button
                  onClick={() => onEdit(assessment)}
                  className="flex flex-1 items-center justify-center gap-2 rounded bg-yellow-50 px-3 py-2 text-sm text-yellow-600 transition-colors hover:bg-yellow-100"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                {canDelete && (
                  <button
                    onClick={() => {
                      if (
                        window.confirm("Are you sure you want to delete this skill assessment?")
                      ) {
                        onDelete(assessment._id);
                      }
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded bg-red-50 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
