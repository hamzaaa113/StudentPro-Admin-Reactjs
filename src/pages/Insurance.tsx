import { useState } from "react";
import { useHealthInsurance } from "../hooks/useInsurance";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Plus, ShieldCheck } from "lucide-react";
import InsuranceTable from "../components/insuranceTable";
import InsuranceModal from "../components/InsuranceModal";
import InsuranceViewModal from "../components/InsuranceViewModal";
import type { HealthInsurance, CreateHealthInsuranceData } from "../types/insurance.types";
import { PAGE_SIZE_OPTIONS } from "../utils/helpers";

export default function Insurance() {
  const {
    healthInsurances,
    loading,
    createHealthInsurance,
    updateHealthInsurance,
    deleteHealthInsurance,
  } = useHealthInsurance();

  const [pageSize, setPageSize] = useState(15);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState<HealthInsurance | null>(null);


  // Handle view insurance
  const handleView = (insurance: HealthInsurance) => {
    setSelectedInsurance(insurance);
    setShowViewModal(true);
  };

  // Handle edit insurance
  const handleEdit = (insurance: HealthInsurance) => {
    setSelectedInsurance(insurance);
    setShowEditModal(true);
  };

  // Handle delete insurance
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this health insurance?")) {
      await deleteHealthInsurance(id);
    }
  };

  // Handle create insurance submit
  const handleCreateSubmit = async (data: CreateHealthInsuranceData) => {
    const success = await createHealthInsurance(data);
    if (success) {
      setShowCreateModal(false);
    }
    return success;
  };

  // Handle update insurance submit
  const handleUpdateSubmit = async (data: CreateHealthInsuranceData) => {
    if (!selectedInsurance) return false;
    const success = await updateHealthInsurance(selectedInsurance._id, data);
    if (success) {
      setShowEditModal(false);
      setSelectedInsurance(null);
    }
    return success;
  };

  return (
    <div className="p-3 md:p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">Health Insurance</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">Manage health insurance companies and their plans</p>
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
            <span className="hidden sm:inline">Add Insurance</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      
            


      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {Math.min(healthInsurances.length, pageSize)} of {healthInsurances.length} {healthInsurances.length === 1 ? 'company' : 'companies'}
        </span>
      </div>

      {/* Table Card */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : healthInsurances.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <ShieldCheck size={48} className="mb-4 text-gray-400" />
              <p className="text-lg font-medium">No health insurance companies found</p>
              <p className="text-sm">Try adjusting your filters or create a new insurance company</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <InsuranceTable
                insurances={healthInsurances.slice(0, pageSize)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* TODO: Add modals for Create, Edit, and View */}
      {/* These can be added later similar to InstitutionModal and InstitutionViewModal */}

      {/* Create Modal */}
      <InsuranceModal
        isOpen={showCreateModal}
        mode="create"
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSubmit}
      />

      {/* Edit Modal */}
      <InsuranceModal
        isOpen={showEditModal}
        mode="edit"
        insurance={selectedInsurance}
        onClose={() => {
          setShowEditModal(false);
          setSelectedInsurance(null);
        }}
        onSubmit={handleUpdateSubmit}
      />

      {/* View Modal */}
      <InsuranceViewModal
        isOpen={showViewModal}
        insurance={selectedInsurance}
        onClose={() => {
          setShowViewModal(false);
          setSelectedInsurance(null);
        }}
      />
    </div>
  );
}
