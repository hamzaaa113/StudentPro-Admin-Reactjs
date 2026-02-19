import { useState } from "react";
import { useAccommodation } from "../hooks/useAccommodation";
import AccommodationTable from "../components/AccommodationTable";
import AccommodationModal from "../components/AccommodationModal";
import AccommodationViewModal from "../components/AccommodationViewModal";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Building2, Plus } from "lucide-react";
import type { Accommodation as AccommodationType, CreateAccommodationData, UpdateAccommodationData } from "../types/accommodation";
import { PAGE_SIZE_OPTIONS } from "../utils/helpers";

const Accommodation = () => {
  const {
    accommodations,
    loading,
    createAccommodation,
    updateAccommodation,
    deleteAccommodation,
  } = useAccommodation();

  const [pageSize, setPageSize] = useState(15);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAccommodation, setSelectedAccommodation] = useState<AccommodationType | null>(null);

  // Handle create accommodation
  const handleCreateAccommodation = async (data: CreateAccommodationData) => {
    const success = await createAccommodation(data);
    if (success) {
      setShowCreateModal(false);
    }
    return success;
  };

  // Handle update accommodation
  const handleUpdateAccommodation = async (data: UpdateAccommodationData) => {
    if (!selectedAccommodation) return false;
    const success = await updateAccommodation(selectedAccommodation._id, data);
    if (success) {
      setShowEditModal(false);
      setSelectedAccommodation(null);
    }
    return success;
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this accommodation?")) {
      await deleteAccommodation(id);
    }
  };

  // Open edit modal
  const openEditModal = (accommodation: AccommodationType) => {
    setSelectedAccommodation(accommodation);
    setShowEditModal(true);
  };

  // Open view modal
  const openViewModal = (accommodation: AccommodationType) => {
    setSelectedAccommodation(accommodation);
    setShowViewModal(true);
  };

  return (
   <div className="p-3 md:p-4 space-y-4">
          {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">Accommodation</h1>
                  <p className="mt-1 text-sm sm:text-base text-gray-600">Manage accommodation companies and locations</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    className="h-9 flex-1 sm:flex-none sm:w-[120px] rounded-lg border px-3 py-1.5 text-sm"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    {PAGE_SIZE_OPTIONS.map((size: number) => (
                      <option key={size} value={size}>
                        {size} rows
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-[#0A1F38] hover:bg-[#0A1F38]/90 text-white whitespace-nowrap text-sm px-3 sm:px-4"
                  >
                    <Plus size={16} className="sm:mr-2" />
                    <span className="hidden sm:inline">Add Accommodation</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </div>
              </div>
        
              
                    
        
        
              {/* Results Summary */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Showing {Math.min(accommodations.length, pageSize)} of {accommodations.length} {accommodations.length === 1 ? 'accommodation' : 'accommodations'}
                </span>
              </div>

          {/* Table Card */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : accommodations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <Building2 size={48} className="mb-4 text-gray-400" />
                  <p className="text-lg font-medium">No accommodations found</p>
                  <p className="text-sm">Click "Add Accommodation" to create a new one</p>
                </div>
              ) : (
                <AccommodationTable
                  accommodations={accommodations}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onView={openViewModal}
                />
              )}
            </CardContent>
          </Card>

          {/* Create/Edit Modal */}
          <AccommodationModal
            isOpen={showCreateModal || showEditModal}
            mode={showCreateModal ? "create" : "edit"}
            accommodation={selectedAccommodation}
            onClose={() => {
              setShowCreateModal(false);
              setShowEditModal(false);
              setSelectedAccommodation(null);
            }}
            onSubmit={showCreateModal ? handleCreateAccommodation : handleUpdateAccommodation}
          />

          {/* View Modal */}
          <AccommodationViewModal
            isOpen={showViewModal}
            accommodation={selectedAccommodation}
            onClose={() => {
              setShowViewModal(false);
              setSelectedAccommodation(null);
            }}
          />
       </div>
  );
};

export default Accommodation;
