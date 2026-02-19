import { useState } from "react";
import { Edit2, Trash2, Eye, ChevronDown, ChevronRight } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/Table";
import type { HealthInsurance } from "../types/insurance.types";
import { useAuth } from "../contexts/AuthContext";

interface InsuranceTableProps {
    insurances: HealthInsurance[];
    onEdit: (insurance: HealthInsurance) => void;
    onDelete: (id: string) => void;
    onView: (insurance: HealthInsurance) => void;
}

export default function InsuranceTable({
    insurances,
    onEdit,
    onDelete,
    onView,
}: InsuranceTableProps) {
    const { canDelete, canViewCommission } = useAuth();
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const toggleRow = (insuranceId: string) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(insuranceId)) {
                newSet.delete(insuranceId);
            } else {
                newSet.add(insuranceId);
            }
            return newSet;
        });
    };

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden overflow-x-auto border md:block rounded-8md">
                <Table>
               <TableHeader className="bg-gradient-to-l from-[#ABDBC0] to-[#E3EFFE] shadow-sm">
  <TableRow className="transition-colors hover:bg-black/5 border-b-black/10">
    <TableHead className="w-8 px-1 py-2"></TableHead>
    <TableHead className="w-[35px]">Company</TableHead>
    <TableHead className="w-[60px]">Country</TableHead>
    <TableHead className="w-[70px]">Actions</TableHead>
  </TableRow>
</TableHeader>

                <TableBody>
                    {insurances.map((insurance) => {
                        const isExpanded = expandedRows.has(insurance._id);
                        const hasItems = insurance.items && insurance.items.length > 0;

                        return (
                            <>
                                <TableRow key={insurance._id}>
                                    {/* Expand/Collapse Arrow */}
                                    <TableCell className="px-1 py-2">
                                        {hasItems ? (
                                            <button
                                                onClick={() => toggleRow(insurance._id)}
                                                className="rounded p-1.5 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                                                title={isExpanded ? "Collapse items" : "Expand items"}
                                            >
                                                {isExpanded ? (
                                                    <ChevronDown size={18} />
                                                ) : (
                                                    <ChevronRight size={18} />
                                                )}
                                            </button>
                                        ) : (
                                            <div className="w-[20px]"></div>
                                        )}
                                    </TableCell>

                                    {/* Company */}
                                    <TableCell className="px-3 py-2">
                                        <span
                                            className="text-sm text-gray-700"
                                            title={insurance.company}
                                        >
                                            {insurance.company}
                                        </span>
                                    </TableCell>

                                    {/* Country */}
                                    <TableCell className="text-sm text-gray-700">
                                        {insurance.country}
                                    </TableCell>

                               

                                    {/* Actions */}
                                    <TableCell className="px-3 py-2">
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => onView(insurance)}
                                                className="rounded p-1.5 text-blue-600 transition hover:bg-blue-50 hover:text-blue-900"
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => onEdit(insurance)}
                                                className="rounded p-1.5 text-green-600 transition hover:bg-green-50 hover:text-green-900"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            {canDelete && (
                                                <button
                                                    onClick={() => onDelete(insurance._id)}
                                                    className="rounded p-1.5 text-red-600 transition hover:bg-red-50 hover:text-red-900"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {/* Expanded Items Details Row */}
                                {isExpanded && hasItems && (
                                    <TableRow key={`${insurance._id}-items`}>
                                        <TableCell className="px-1"></TableCell>
                                        <TableCell colSpan={3} className="p-0 bg-gray-50">
                                            <div className="py-3 pl-4">
                                                <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm w-fit">
                                                    <div className="px-3 py-2 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                                        <h4 className="text-sm font-semibold text-gray-800">
                                                            Insurance Items for {insurance.company}
                                                        </h4>
                                                    </div>
                                                    <div className="overflow-x-auto">
                                                        {canViewCommission ? (
                                                          <table className="w-auto">
                                                              <thead>
                                                                  <tr className="border-b border-gray-200 bg-gray-100/70">
                                                                      <th className="text-left px-3 py-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 whitespace-nowrap">
                                                                          Item Name
                                                                      </th>
                                                                      <th className="text-left px-3 py-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                                                                          Commission
                                                                      </th>
                                                                  </tr>
                                                              </thead>
                                                              <tbody className="divide-y divide-gray-200">
                                                                  {insurance.items.map((item, index) => (
                                                                      <tr
                                                                          key={index}
                                                                          className="transition-colors hover:bg-blue-50/30"
                                                                      >
                                                                          <td className="px-3 py-1.5 text-sm text-gray-900 border-r border-gray-200 whitespace-nowrap">
                                                                              {item.name}
                                                                          </td>
                                                                          <td className="px-3 py-1.5 text-sm text-gray-700">
                                                                              {item.commission || 'N/A'}
                                                                          </td>
                                                                      </tr>
                                                                  ))}
                                                              </tbody>
                                                          </table>
                                                        ) : (
                                                          <ul className="px-3 py-2 space-y-1.5 list-disc list-inside">
                                                              {insurance.items.map((item, index) => (
                                                                  <li key={index} className="text-sm text-gray-900">
                                                                      {item.name}
                                                                  </li>
                                                              ))}
                                                          </ul>
                                                        )}
                                                    </div>
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
        <div className="space-y-4 md:hidden">
            {insurances.map((insurance) => {
                const isExpanded = expandedRows.has(insurance._id);
                const hasItems = insurance.items && insurance.items.length > 0;

                return (
                    <div key={insurance._id} className="overflow-hidden bg-white border rounded-lg shadow-sm">
                        {/* Card Header */}
                        <div className="bg-gradient-to-l from-[#ABDBC0] to-[#E3EFFE] p-3"></div>

                        {/* Card Body */}
                        <div className="flex gap-3">
                            {/* Expand/Collapse Button */}
                            <div className="flex items-start pt-3 pl-3">
                                {hasItems ? (
                                    <button
                                        onClick={() => toggleRow(insurance._id)}
                                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition"
                                        title={isExpanded ? "Collapse items" : "Expand items"}
                                    >
                                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                    </button>
                                ) : (
                                    <div className="w-[34px]"></div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-3 pt-3 pr-3 space-y-2.5">
                            <div>
                                <span className="text-xs font-medium text-gray-500">Company:</span>
                                <p className="text-sm font-medium text-gray-900">{insurance.company}</p>
                            </div>

                            <div>
                                <span className="text-xs font-medium text-gray-500">Country:</span>
                                <p className="text-sm text-gray-900">{insurance.country}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2 border-t">
                                <button
                                    onClick={() => onEdit(insurance)}
                                    className="flex items-center justify-center flex-1 gap-1 p-2 text-green-600 rounded bg-green-50 hover:bg-green-100"
                                >
                                    <Edit2 size={16} /> Edit
                                </button>
                                {canDelete && (
                                    <button
                                        onClick={() => onDelete(insurance._id)}
                                        className="flex items-center justify-center flex-1 gap-1 p-2 text-red-600 rounded bg-red-50 hover:bg-red-100"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                )}
                            </div>
                        </div>
                        </div>

                        {/* Expanded Items */}
                        {isExpanded && hasItems && (
                            <div className="p-3 border-t bg-gray-50">
                                <h4 className="mb-2 text-sm font-semibold text-gray-800">Insurance Items</h4>
                                <div className="space-y-2">
                                    {insurance.items.map((item, index) => (
                                        <div key={index} className="p-2 text-sm bg-white border rounded">
                                            <div className="font-medium text-gray-900">{item.name}</div>
                                            {canViewCommission && (
                                              <div className="mt-1 text-xs text-gray-600">
                                                  Commission: <span className="font-medium">{item.commission || 'N/A'}</span>
                                              </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </>
    );
}
