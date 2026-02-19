import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { toast } from "../lib/toast";
import type { Accommodation, CreateAccommodationData, AccommodationItem } from "../types/accommodation";
import { FILTER_COUNTRIES } from "../utils/helpers";

interface AccommodationModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  accommodation?: Accommodation | null;
  onClose: () => void;
  onSubmit: (data: CreateAccommodationData) => Promise<boolean>;
}

export default function AccommodationModal({
  isOpen,
  mode,
  accommodation,
  onClose,
  onSubmit,
}: AccommodationModalProps) {
  // Form states
  const [formData, setFormData] = useState<Partial<CreateAccommodationData>>({
    company: "",
    country: "",
    locations: [],
    items: [],
  });

  // New item input state
  const [newItem, setNewItem] = useState<AccommodationItem>({
    name: "",
    commission: "",
  });

  // Location input state
  const [locationInput, setLocationInput] = useState("");

  // Update form data when accommodation or mode changes
  useEffect(() => {
    if (mode === "edit" && accommodation) {
      // Intentional: syncing form state with prop changes for edit mode
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        company: accommodation.company,
        country: accommodation.country,
        locations: accommodation.locations || [],
        items: accommodation.items || [],
      });
    } else if (mode === "create") {
      setFormData({
        company: "",
        country: "",
        locations: [],
        items: [],
      });
    }
  }, [mode, accommodation]);

  // Handle add location
  const handleAddLocation = () => {
    if (!locationInput.trim()) {
      toast.error("Please enter a location");
      return;
    }
    if (formData.locations?.includes(locationInput.trim())) {
      toast.error("This location is already added");
      return;
    }

    setFormData({
      ...formData,
      locations: [...(formData.locations || []), locationInput.trim()],
    });
    setLocationInput("");
  };

  // Handle remove location
  const handleRemoveLocation = (index: number) => {
    setFormData({
      ...formData,
      locations: (formData.locations || []).filter((_, i) => i !== index),
    });
  };

  // Handle add item to form
  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      toast.error("Please enter an item name");
      return;
    }
    if (!newItem.commission || (typeof newItem.commission === 'string' && !newItem.commission.trim())) {
      toast.error("Please enter commission details");
      return;
    }

    setFormData({
      ...formData,
      items: [...(formData.items || []), { ...newItem }],
    });
    setNewItem({ name: "", commission: 0 });
  };

  // Handle remove item from form
  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: (formData.items || []).filter((_, i) => i !== index),
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.company?.trim()) {
      toast.error("Company name is required");
      return;
    }
    if (!formData.country?.trim()) {
      toast.error("Country is required");
      return;
    }
    if (!formData.locations || formData.locations.length === 0) {
      toast.error("At least one location is required");
      return;
    }
    if (!formData.items || formData.items.length === 0) {
      toast.error("At least one accommodation item is required");
      return;
    }

    const cleanedData: CreateAccommodationData = {
      company: formData.company.trim(),
      country: formData.country.trim(),
      locations: formData.locations,
      items: formData.items,
    };

    const success = await onSubmit(cleanedData);
    if (success) {
      onClose();
      resetForm();
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      company: "",
      country: "",
      locations: [],
      items: [],
    });
    setNewItem({ name: "", commission: "" });
    setLocationInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">
            {mode === "create" ? "Create New Accommodation" : "Edit Accommodation"}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
              e.preventDefault();
            }
          }}
          className="p-6 space-y-6"
        >
          {/* Basic Information */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Accommodation company name"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                >
                  <option value="">Select Country</option>
                  {FILTER_COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Add Location Form */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Locations</h3>
            <div className="p-4 mb-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="mb-3 text-sm font-medium text-gray-700">Add New Location</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Location (e.g., New York, London)"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={handleAddLocation}
                  className="flex items-center gap-1 bg-[#0A1F38] hover:bg-[#10192c] whitespace-nowrap"
                  disabled={!locationInput.trim()}
                >
                  <Plus size={16} />
                  Add
                </Button>
              </div>
            </div>

            {/* Locations List */}
            {formData.locations && formData.locations.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Added Locations ({formData.locations.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.locations.map((location, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full"
                    >
                      <span className="text-sm text-gray-900">{location}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLocation(idx)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="py-4 text-sm text-center text-gray-500">
                No locations added yet. Add locations using the form above.
              </p>
            )}
          </div>

          {/* Add Accommodation Item Form */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Accommodation Items</h3>
            <div className="p-4 mb-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="mb-3 text-sm font-medium text-gray-700">Add New Item</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input
                  placeholder="Item name (e.g., Single Room, Double Room)"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Commission details"
                    value={newItem.commission || ""}
                    onChange={(e) => setNewItem({ ...newItem, commission: e.target.value })}
                  />
                  <Button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center gap-1 bg-[#0A1F38] hover:bg-[#10192c] whitespace-nowrap"
                    disabled={!newItem.name.trim() || !newItem.commission}
                  >
                    <Plus size={16} />
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Items List */}
            {formData.items && formData.items.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Added Items ({formData.items.length})
                </p>
                <div className="space-y-2 overflow-y-auto max-h-60">
                  {formData.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Commission: {typeof item.commission === 'number' ? `$${item.commission.toFixed(2)}` : item.commission}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors ml-3"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="py-4 text-sm text-center text-gray-500">
                No items added yet. Add items using the form above.
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#0A1F38] hover:bg-[#10192c] text-white">
              {mode === "create" ? "Create Accommodation" : "Update Accommodation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
