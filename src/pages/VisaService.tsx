import { useState } from "react";
import { useVisaService } from "../hooks/useVisaService";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Plus, FileText } from "lucide-react";
import VisaServiceTable from "../components/VisaServiceTable";
import VisaServiceModal from "../components/VisaServiceModal";
import VisaServiceViewModal from "../components/VisaServiceViewModal";
import type { VisaService as VisaServiceType, CreateVisaServiceData } from "../types/visaService.types";
import { PAGE_SIZE_OPTIONS } from "../utils/helpers";

export default function VisaService() {
  const {
    visaServices,
    loading,
    createVisaService,
    updateVisaService,
    deleteVisaService,
  } = useVisaService();

  const [pageSize, setPageSize] = useState(15);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedService, setSelectedService] = useState<VisaServiceType | null>(null);

  // Handle view visa service
  const handleView = (service: VisaServiceType) => {
    setSelectedService(service);
    setShowViewModal(true);
  };

  // Handle edit visa service
  const handleEdit = (service: VisaServiceType) => {
    setSelectedService(service);
    setShowEditModal(true);
  };

  // Handle delete visa service
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this visa service?")) {
      await deleteVisaService(id);
    }
  };

  // Handle create visa service submit
  const handleCreateSubmit = async (data: CreateVisaServiceData) => {
    const success = await createVisaService(data);
    if (success) {
      setShowCreateModal(false);
    }
    return success;
  };

  // Handle update visa service submit
  const handleUpdateSubmit = async (data: CreateVisaServiceData) => {
    if (!selectedService) return false;
    const success = await updateVisaService(selectedService._id, data);
    if (success) {
      setShowEditModal(false);
      setSelectedService(null);
    }
    return success;
  };

  return (
    <div className="p-3 md:p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">Visa Services</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">Manage visa service types and fees</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            className="h-9 flex-1 sm:flex-none sm:w-[120px] rounded-lg border px-3 py-1.5 text-sm"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size} rows
              </option>
            ))}
          </select>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-[#0A1F38] text-white hover:bg-[#0C2A4D] whitespace-nowrap text-sm px-3 sm:px-4"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Service</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {Math.min(visaServices.length, pageSize)} of {visaServices.length} {visaServices.length === 1 ? 'service' : 'services'}
        </span>
      </div>

      {/* Table Card */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : visaServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FileText size={48} className="mb-4 text-gray-400" />
              <p className="text-lg font-medium">No visa services found</p>
              <p className="text-sm">Create a new visa service to get started</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <VisaServiceTable
                visaServices={visaServices.slice(0, pageSize)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <VisaServiceModal
        isOpen={showCreateModal}
        mode="create"
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSubmit}
      />

      {/* Edit Modal */}
      <VisaServiceModal
        isOpen={showEditModal}
        mode="edit"
        visaService={selectedService}
        onClose={() => {
          setShowEditModal(false);
          setSelectedService(null);
        }}
        onSubmit={handleUpdateSubmit}
      />

      {/* View Modal */}
      <VisaServiceViewModal
        isOpen={showViewModal}
        visaService={selectedService}
        onClose={() => {
          setShowViewModal(false);
          setSelectedService(null);
        }}
      />
    </div>
  );
}
