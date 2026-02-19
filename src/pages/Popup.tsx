import { useState } from "react";
import { Plus, AlertCircle } from "lucide-react";
import { usePopup } from "../hooks/usePopup";
import type { CreatePopupData, UpdatePopupData, Popup } from "../types/popup.types";
import PopupModal from "../components/PopupModal";
import PopupTable from "../components/PopupTable";
import PopupViewModal from "../components/PopupViewModal";
import { Button } from "../components/ui/Button";

const PopupPage = () => {
  const { popups, loading, createPopup, updatePopup, deletePopup, togglePopupStatus } = usePopup();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPopup, setSelectedPopup] = useState<Popup | undefined>(undefined);
  const [viewPopup, setViewPopup] = useState<Popup | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const handleCreatePopup = async (data: CreatePopupData) => {
    try {
      await createPopup(data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating popup:", error);
      throw error;
    }
  };

  const handleUpdatePopup = async (data: UpdatePopupData) => {
    if (!selectedPopup) return;
    try {
      await updatePopup(selectedPopup._id, data);
      setIsModalOpen(false);
      setSelectedPopup(undefined);
    } catch (error) {
      console.error("Error updating popup:", error);
      throw error;
    }
  };

  const handleDeletePopup = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this popup?")) {
      return;
    }

    try {
      await deletePopup(id);
    } catch (error) {
      console.error("Error deleting popup:", error);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await togglePopupStatus(id);
    } catch (error) {
      console.error("Error toggling popup status:", error);
    }
  };

  const openCreateModal = () => {
    setSelectedPopup(undefined);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const openEditModal = (popup: Popup) => {
    setSelectedPopup(popup);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const openViewModal = (popup: Popup) => {
    setViewPopup(popup);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPopup(undefined);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewPopup(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Popup Management</h1>
          <p className="mt-1 text-gray-600">
            Create and manage promotional popups for your users
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-[#0A1F38] hover:bg-[#0A1F38]/90 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Popup
        </Button>
      </div>

      {/* Info Alert */}
      <div className="flex items-start gap-3 p-4 border border-blue-200 rounded-lg bg-blue-50">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="mb-1 font-medium">About Popups</p>
          <p>
            Popups will be displayed to users when they log in. Only active popups within their
            date range will be shown. Higher priority popups appear first.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white rounded-lg shadow">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A1F38]"></div>
          </div>
        ) : (
          <PopupTable
            popups={popups}
            onEdit={openEditModal}
            onDelete={handleDeletePopup}
            onView={openViewModal}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      {/* Modals */}
      <PopupModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={(modalMode === "create" ? handleCreatePopup : handleUpdatePopup) as (data: CreatePopupData | UpdatePopupData) => Promise<void>}
        popup={selectedPopup}
        mode={modalMode}
      />

      <PopupViewModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        popup={viewPopup}
      />
    </div>
  );
};

export default PopupPage;
