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
import type { VisaService } from "../types/visaService.types";
import { useAuth } from "../contexts/AuthContext";

interface VisaServiceTableProps {
    visaServices: VisaService[];
    onEdit: (visaService: VisaService) => void;
    onDelete: (id: string) => void;
    onView: (visaService: VisaService) => void;
}

export default function VisaServiceTable({
    visaServices,
    onEdit,
    onDelete,
    onView,
}: VisaServiceTableProps) {
    const { canDelete } = useAuth();
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const toggleRow = (serviceId: string) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(serviceId)) {
                newSet.delete(serviceId);
            } else {
                newSet.add(serviceId);
            }
            return newSet;
        });
    };

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden overflow-x-auto border rounded-md md:block">
                <Table>
                <TableHeader className="bg-gradient-to-l from-[#ABDBC0] to-[#E3EFFE] shadow-sm">
                    <TableRow className="transition-colors hover:bg-black/5 border-b-black/10">
                        <TableHead className="w-[35px]"></TableHead>
                        <TableHead className="px-4 py-3">Service Type</TableHead>
                        <TableHead className="px-4 py-3">Country</TableHead>
                        <TableHead className="px-4 py-3">Agent Service Fee</TableHead>
                        <TableHead className="px-4 py-3">Government Fee</TableHead>
                        <TableHead className="px-4 py-3">Referral Fee</TableHead>
                        <TableHead className="px-4 py-3 w-[120px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {visaServices.map((service) => {
                        const isExpanded = expandedRows.has(service._id);

                        return (
                            <>
                                <TableRow key={service._id} className="hover:bg-gray-50">
                                    {/* Expand/Collapse Arrow */}
                                    <TableCell>
                                        <button
                                            onClick={() => toggleRow(service._id)}
                                            className="rounded p-1.5 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                                            title={isExpanded ? "Collapse details" : "Expand details"}
                                        >
                                            {isExpanded ? (
                                                <ChevronDown size={18} />
                                            ) : (
                                                <ChevronRight size={18} />
                                            )}
                                        </button>
                                    </TableCell>

                            {/* Service Type */}
                            <TableCell className="px-4 py-3">
                                <span className="text-sm text-gray-700">
                                    {service.serviceType}
                                </span>
                            </TableCell>

                            {/* Country */}
                            <TableCell className="px-4 py-3">
                                <span className="text-sm text-gray-700">
                                    {service.country}
                                </span>
                            </TableCell>

                            {/* Service Fee */}
                            <TableCell className="px-4 py-3">
                                <span className="text-sm text-gray-700 whitespace-pre-wrap break-words block max-w-[200px]">
                                    {service.serviceFee}
                                </span>
                            </TableCell>

                            {/* Government Fee */}
                            <TableCell className="px-4 py-3 text-center">
                                <span className="text-sm text-gray-700">
                                    {service.governmentFee || <span className="text-gray-400">—</span>}
                                </span>
                            </TableCell>

                            {/* Referral Fee */}
                            <TableCell className="px-4 py-3">
                                <span className="text-sm text-gray-700">
                                    {service.referralFee}
                                </span>
                            </TableCell>

                            {/* Actions */}
                            <TableCell className="px-4 py-3">
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => onView(service)}
                                        className="rounded p-1.5 text-blue-600 transition hover:bg-blue-50 hover:text-blue-900"
                                        title="View Details"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        onClick={() => onEdit(service)}
                                        className="rounded p-1.5 text-green-600 transition hover:bg-green-50 hover:text-green-900"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    {canDelete && (
                                        <button
                                            onClick={() => onDelete(service._id)}
                                            className="rounded p-1.5 text-red-600 transition hover:bg-red-50 hover:text-red-900"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </TableCell>
                                </TableRow>

                                {/* Expanded Content Row */}
                                {isExpanded && (
                                    <TableRow className="bg-gradient-to-r from-blue-50/50 to-green-50/50">
                                        <TableCell colSpan={7} className="px-6 py-5">
                                            <div className="p-5 border rounded-lg shadow-sm bg-white/70 border-gray-200/50">
                                                <h4 className="pb-2 mb-4 text-xs font-semibold tracking-wider text-gray-700 uppercase border-b border-gray-200">
                                                    Additional Information
                                                </h4>
                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                    <div className="flex flex-col space-y-1.5">
                                                        <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Processing Time:</span>
                                                        <span className="text-sm font-medium text-gray-800">
                                                            {service.processingTime && service.processingTime.trim() !== "" ? service.processingTime : (
                                                                <span className="italic text-gray-400">N/A</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col space-y-1.5">
                                                        <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Application Method:</span>
                                                        <span className="text-sm font-medium text-gray-800">
                                                            {service.applicationField && service.applicationField.trim() !== "" ? (
                                                                /^(https?:\/\/|www\.)/i.test(service.applicationField.trim()) ? (
                                                                    <a
                                                                        href={service.applicationField.startsWith('http') ? service.applicationField : `https://${service.applicationField}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center gap-1 text-blue-600 break-all hover:text-blue-800 hover:underline"
                                                                    >
                                                                        {service.applicationField}
                                                                        <svg className="flex-shrink-0 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                        </svg>
                                                                    </a>
                                                                ) : (
                                                                    <span className="break-words">{service.applicationField}</span>
                                                                )
                                                            ) : (
                                                                <span className="italic text-gray-400">N/A</span>
                                                            )}
                                                        </span>
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
            {visaServices.map((service) => (
                <div key={service._id} className="overflow-hidden bg-white border rounded-lg shadow-sm">
                    {/* Card Header */}
                    <div className="bg-gradient-to-l from-[#ABDBC0] to-[#E3EFFE] p-3">
                    </div>

                    {/* Card Body */}
                    <div className="p-3 space-y-2.5">
                        <div>
                            <span className="text-xs font-medium text-gray-500">Service Type:</span>
                            <p className="text-sm font-medium text-gray-900">{service.serviceType}</p>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-xs font-medium text-gray-500">Country:</span>
                                <p className="text-gray-900">{service.country}</p>
                            </div>
                            <div>
                                <span className="text-xs font-medium text-gray-500">Service Fee:</span>
                                <p className="text-gray-900 break-words whitespace-pre-wrap">{service.serviceFee}</p>
                            </div>
                            <div>
                                <span className="text-xs font-medium text-gray-500">Government Fee:</span>
                                <p className="text-gray-900">{service.governmentFee || <span className="text-gray-400">—</span>}</p>
                            </div>
                            <div>
                                <span className="text-xs font-medium text-gray-500">Referral Fee:</span>
                                <p className="text-gray-900">{service.referralFee}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t">
                            <button
                                onClick={() => onEdit(service)}
                                className="flex items-center justify-center flex-1 gap-1 p-2 text-green-600 rounded bg-green-50 hover:bg-green-100"
                            >
                                <Edit2 size={16} /> Edit
                            </button>
                            {canDelete && (
                                <button
                                    onClick={() => onDelete(service._id)}
                                    className="flex items-center justify-center flex-1 gap-1 p-2 text-red-600 rounded bg-red-50 hover:bg-red-100"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </>
    );
}
