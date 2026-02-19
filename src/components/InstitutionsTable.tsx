import { useState } from "react";
import { Edit2, Trash2, Eye, Globe, ChevronDown, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";
import type { Institution } from "../types/institution.types";
import {
  getCountryName,
  parseStateField,
  renderTerritoryBadge,
  parseCourseString,
} from "../utils/helpers";
import { useAuth } from "../contexts/AuthContext";

interface InstitutionsTableProps {
  institutions: Institution[];
  onEdit: (institution: Institution) => void;
  onDelete: (id: string) => void;
  onView: (institution: Institution) => void;
}

export default function InstitutionsTable({
  institutions,
  onEdit,
  onDelete,
  onView,
}: InstitutionsTableProps) {
  const { canDelete, canViewCommission } = useAuth();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (institutionId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(institutionId)) {
        newSet.delete(institutionId);
      } else {
        newSet.add(institutionId);
      }
      return newSet;
    });
  };

  const parseCourses = (courses: Array<{ course?: string; commission?: string; _id?: string }>) => {
    return courses.flatMap((course) => {
      const courseText = course.course || '';
      const existingCommission = course.commission || '';

      // If the course already has a commission, treat it as a single entry
      // Don't split by newlines - the newlines are part of the course description
      if (existingCommission.trim()) {
        // Clean up trailing opening parentheses that might be left over
        const cleanedCourseName = courseText.replace(/\s*\(\s*$/, '').trim();

        return [
          {
            ...course,
            course: cleanedCourseName,
            commission: existingCommission,
          },
        ];
      }

      // If no commission exists, split by newlines and try to parse each line
      const courseLines = courseText
        .split(/\n+/)
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0);

      return courseLines.map((line: string) => {
        const parsed = parseCourseString(line);

        if (parsed && parsed.commission && parsed.commission.trim()) {
          // Clean up trailing opening parentheses
          const cleanedCourseName = parsed.course.replace(/\s*\(\s*$/, '').trim();

          return {
            ...course,
            _id: undefined,
            course: cleanedCourseName,
            commission: parsed.commission,
          };
        }

        return {
          ...course,
          _id: undefined,
          course: parsed?.course || line,
          commission: 'N/A',
        };
      });
    });
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block border rounded-md">
        <Table>
        <TableHeader className="bg-gradient-to-l from-[#ABDBC0] to-[#E3EFFE] shadow-sm">
          <TableRow className="transition-colors hover:bg-black/5 border-b-black/10">
            <TableHead className="w-[35px]"></TableHead>
            <TableHead className="w-[70px]">Country</TableHead>
            <TableHead className="w-[70px]">State</TableHead>
            <TableHead className="w-[60px]">Sector</TableHead>
            <TableHead className="min-w-[120px]">Name</TableHead>
            <TableHead className="w-[70px]">Territory</TableHead>
            <TableHead className="w-[65px]">100% Promotion</TableHead>
            <TableHead className="w-[65px]">TAT</TableHead>
            <TableHead className="w-[65px]">Scholarship</TableHead>
            <TableHead className="w-[70px]">Group</TableHead>
            <TableHead className="w-[90px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {institutions.map((institution) => {
            const isExpanded = expandedRows.has(institution._id);
            const hasCourses = institution.course && institution.course.length > 0;
            const hasApplicationMethod = institution.applicationMethod && institution.applicationMethod.trim() !== "";
            const hasExpandableContent = hasCourses || hasApplicationMethod;
            const parsedCourses = hasCourses ? parseCourses(institution.course) : [];

            return (
              <>
                <TableRow key={institution._id}>
                  {/* Expand/Collapse Arrow */}
                  <TableCell>
                    {hasExpandableContent ? (
                      <button
                        onClick={() => toggleRow(institution._id)}
                        className="rounded p-1.5 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                        title={isExpanded ? "Collapse details" : "Expand details"}
                      >
                        {isExpanded ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </button>
                    ) : (
                      <div className="w-[34px]"></div>
                    )}
                  </TableCell>

                  {/* Country */}
                  <TableCell className="text-sm text-gray-700">
                    {getCountryName(institution.country)}
                  </TableCell>

                  {/* State */}
                  <TableCell className="text-sm text-gray-700">{parseStateField(institution.state)}</TableCell>

                  {/* Sector */}
                  <TableCell>
                    <span className="text-sm text-gray-700 ">
                      {institution.sector}
                    </span>
                  </TableCell>

                  {/* Name with Link */}
                  <TableCell>
                    {institution.url ? (
                      <a
                        href={institution.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-700 transition-colors hover:text-gray-700"
                      >
                        <span title={institution.name}>
                          {institution.name}
                        </span>

                      </a>
                    ) : (
                      <span
                        className="font-medium text-gray-900"
                        title={institution.name}
                      >
                        {institution.name}
                      </span>
                    )}
                  </TableCell>

                  {/* Territory */}
                  <TableCell>
                    {institution.global ? (
                      <span
                        className="inline-flex items-center justify-center w-8 h-8 text-gray-500 transition-transform cursor-default hover:scale-110"
                        title="Global"
                      >
                        <Globe size={14} />
                      </span>
                    ) : institution.territory && institution.territory.length > 0 ? (
                      <div className="flex flex-wrap gap-1 items-center max-w-[120px]">
                        {institution.territory.map((t, idx) => {
                          const territoryData = renderTerritoryBadge(t);
                          if (!territoryData.displayText) return null;

                          if (territoryData.isGlobal) {
                            return (
                              <span
                                key={idx}
                                className="inline-flex items-center justify-center w-8 h-8 text-gray-500 transition-transform cursor-default hover:scale-110"
                                title="Global"
                              >
                                <Globe size={14} />
                              </span>
                            )
                          }

                          return (
                            <span
                              key={idx}
                              className="inline-flex items-center justify-center h-5 transition-transform cursor-default select-none w-7 hover:scale-110"
                              title={territoryData.displayText}
                              aria-hidden="true"
                            >
                              {territoryData.countryCode.length === 2 ? (
                                <img
                                  src={`https://flagcdn.com/w20/${territoryData.countryCode.toLowerCase()}.png`}
                                  srcSet={`https://flagcdn.com/w40/${territoryData.countryCode.toLowerCase()}.png 2x`}
                                  width="16"
                                  height="12"
                                  alt={territoryData.countryCode}
                                  className="object-contain"
                                  loading="lazy"
                                />
                              ) : (
                                <span className="text-sm leading-none">{territoryData.flag}</span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>

                  {/* 100% Promotion */}
                  <TableCell>
                    {institution.promotion && institution.promotion !== "" ? (
                      <span
                        className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
                        title={institution.promotion}
                      >
                        {institution.promotion}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>

                  {/* TAT */}
                  <TableCell className="text-sm text-gray-700">
                    {institution.tat || <span className="text-gray-400">—</span>}
                  </TableCell>

                  {/* Scholarship */}
                  <TableCell className="text-center">
                    {institution.scholarship ? (
                      <a
                        href={institution.scholarship}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded bg-[#ABDBC0] px-3 py-1.5 text-xs font-semibold text-[#0A1F38] transition-colors shadow-sm"
                        title={institution.scholarship}
                      >
                        Scholarship
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>

                  {/* Group */}
                  <TableCell className="text-sm text-gray-700">
                    {institution.group &&
                      institution.group.trim() &&
                      institution.group !== "_" ? (
                      <span
                        className="text-sm text-gray-700 text-s"
                        title={institution.group}
                      >
                        {institution.group}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => onView(institution)}
                        className="rounded p-1.5 text-blue-600 transition hover:bg-blue-50 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(institution)}
                        className="rounded p-1.5 text-green-600 transition hover:bg-green-50 hover:text-green-900"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      {canDelete && (
                        <button
                          onClick={() => onDelete(institution._id)}
                          className="rounded p-1.5 text-red-600 transition hover:bg-red-50 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>

                {/* Expanded Course Details Row */}
                {isExpanded && hasExpandableContent && (
                  <TableRow key={`${institution._id}-courses`}>
                    <TableCell></TableCell>
                    <TableCell colSpan={10} className="p-0 bg-gray-50">
                      <div className="px-4 py-3">
                        <div className="max-w-4xl overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
                          {hasCourses && (
                            <>
                              <div className="px-3 py-2 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <h4 className="text-sm font-semibold text-gray-800">
                                  Courses for {institution.name}
                                </h4>
                              </div>
                              <div className="overflow-x-auto">
                                {canViewCommission ? (
                                  <table className="w-full">
                                    <thead>
                                      <tr className="border-b border-gray-200 bg-gray-100/70">
                                        <th className="text-left px-3 py-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                                          Course Name
                                        </th>
                                        <th className="text-right px-3 py-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[180px] max-w-[300px]">
                                          Commission
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      {parsedCourses.map((course, index) => (
                                        <tr
                                          key={course._id || index}
                                          className="transition-colors hover:bg-blue-50/30"
                                        >
                                          <td className="px-3 py-1.5 text-sm text-gray-900 border-r border-gray-200">
                                            {course.course}
                                          </td>
                                          <td className="px-3 py-1.5 text-right align-top min-w-[180px] max-w-[300px]">
                                            <span className="inline-block text-sm font-medium text-right text-gray-900 break-words whitespace-normal">
                                              {course.commission || 'N/A'}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                ) : (
                                  <ul className="px-3 py-2 space-y-1.5 list-disc list-inside">
                                    {parsedCourses.map((course, index) => (
                                      <li key={course._id || index} className="text-sm text-gray-900">
                                        {course.course}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </>
                          )}
                          {/* Application Method */}
                          {hasApplicationMethod && (
                            <div className={`px-3 py-2 ${hasCourses ? 'border-t' : ''} border-gray-200 bg-gray-50`}>
                              {!hasCourses && (
                                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                  Details for {institution.name}
                                </h4>
                              )}
                              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                Application Method
                              </p>
                              <a href={institution.applicationMethod} className="text-sm text-gray-800 break-words underline hover:text-blue-600 hover:underline transition-colors" target="_blank" rel="noopener noreferrer">
                                {institution.applicationMethod}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {institutions.map((institution) => {
          const isExpanded = expandedRows.has(institution._id);
          const hasCourses = institution.course && institution.course.length > 0;
          const hasApplicationMethod = institution.applicationMethod && institution.applicationMethod.trim() !== "";
          const hasExpandableContent = hasCourses || hasApplicationMethod;
          const parsedCourses = hasCourses ? parseCourses(institution.course) : [];

          return (
            <div key={institution._id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-l from-[#ABDBC0] to-[#E3EFFE] p-3"></div>

              {/* Card Body */}
              <div className="flex gap-3">
                {/* Expand/Collapse Button */}
                <div className="flex items-start pt-3 pl-3">
                  {hasExpandableContent ? (
                    <button
                      onClick={() => toggleRow(institution._id)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition"
                      title={isExpanded ? "Collapse details" : "Expand details"}
                    >
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                  ) : (
                    <div className="w-[34px]"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-3 pt-3 pr-3 space-y-2.5">
                {/* Name */}
                <div>
                  <span className="font-medium text-gray-500 text-xs">Name:</span>
                  <div className="mt-1">
                    {institution.url ? (
                      <a
                        href={institution.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-gray-700 text-sm font-medium"
                      >
                        {institution.name}
                      </a>
                    ) : (
                      <p className="text-gray-900 text-sm font-medium">{institution.name}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-500 text-xs">Country:</span>
                    <p className="text-gray-900">{getCountryName(institution.country)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500 text-xs">State:</span>
                    <p className="text-gray-900">{parseStateField(institution.state)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500 text-xs">Sector:</span>
                    <p className="text-gray-900">{institution.sector}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500 text-xs">Group:</span>
                    <p className="text-gray-900">
                      {institution.group && institution.group.trim() && institution.group !== "_" 
                        ? institution.group 
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Territory */}
                <div>
                  <span className="font-medium text-gray-500 text-xs">Territory:</span>
                  <div className="mt-1">
                    {institution.global ? (
                      <span className="inline-flex items-center gap-1 text-gray-700 text-sm">
                        <Globe size={14} /> Global
                      </span>
                    ) : institution.territory && institution.territory.length > 0 ? (
                      <div className="flex flex-wrap gap-1 items-center">
                        {institution.territory.map((t, idx) => {
                          const territoryData = renderTerritoryBadge(t);
                          if (!territoryData.displayText) return null;

                          if (territoryData.isGlobal) {
                            return (
                              <span key={idx} className="inline-flex items-center gap-1 text-gray-700 text-sm">
                                <Globe size={14} /> Global
                              </span>
                            )
                          }

                          return (
                            <span
                              key={idx}
                              className="inline-flex items-center justify-center h-5 w-7"
                              title={territoryData.displayText}
                            >
                              {territoryData.countryCode.length === 2 ? (
                                <img
                                  src={`https://flagcdn.com/w20/${territoryData.countryCode.toLowerCase()}.png`}
                                  srcSet={`https://flagcdn.com/w40/${territoryData.countryCode.toLowerCase()}.png 2x`}
                                  width="16"
                                  height="12"
                                  alt={territoryData.countryCode}
                                  loading="lazy"
                                />
                              ) : (
                                <span className="text-sm">{territoryData.flag}</span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </div>
                </div>

                {/* 100% Promotion */}
                <div>
                  <span className="font-medium text-gray-500 text-xs">100% Promotion:</span>
                  <div className="mt-1">
                    {institution.promotion && institution.promotion !== "" ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                        {institution.promotion}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </div>
                </div>

                {/* TAT */}
                <div>
                  <span className="font-medium text-gray-500 text-xs">TAT:</span>
                  <div className="mt-1">
                    <span className="text-gray-700 text-sm">{institution.tat || <span className="text-gray-400">—</span>}</span>
                  </div>
                </div>

                {/* Scholarship */}
                <div>
                  <span className="font-medium text-gray-500 text-xs">Scholarship:</span>
                  <div className="mt-1">
                    {institution.scholarship ? (
                      <a
                        href={institution.scholarship}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded bg-[#ABDBC0] px-3 py-1 text-xs font-semibold text-[#0A1F38]"
                      >
                        View Scholarship
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <button
                    onClick={() => onEdit(institution)}
                    className="flex-1 flex items-center justify-center gap-1 rounded p-2 text-green-600 bg-green-50 hover:bg-green-100"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  {canDelete && (
                    <button
                      onClick={() => onDelete(institution._id)}
                      className="flex-1 flex items-center justify-center gap-1 rounded p-2 text-red-600 bg-red-50 hover:bg-red-100"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  )}
                </div>
              </div>
              </div>

              {/* Expanded Courses */}
              {isExpanded && hasExpandableContent && (
                <div className="border-t bg-gray-50 p-3">
                  {hasCourses && (
                    <>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Courses</h4>
                      <div className="space-y-2">
                        {parsedCourses.map((course, index) => (
                          <div key={course._id || index} className="bg-white p-2 rounded border text-sm">
                            <div className="font-medium text-gray-900">{course.course}</div>
                            {canViewCommission && (
                              <div className="text-gray-600 text-xs mt-1">
                                Commission: <span className="font-medium">{course.commission || 'N/A'}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {/* Application Method */}
                  {hasApplicationMethod && (
                    <div className={hasCourses ? "mt-3 pt-3 border-t border-gray-200" : ""}>
                      <span className="font-medium text-gray-500 text-xs">Application Method:</span>
                      <a href={institution.applicationMethod} className="text-gray-900 text-sm mt-1 break-words underline hover:text-blue-600 hover:underline transition-colors" target="_blank" rel="noopener noreferrer ">{institution.applicationMethod}</a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
