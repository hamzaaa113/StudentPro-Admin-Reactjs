import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { toast } from "../lib/toast";
import {
  validateCourse,
  addCourseToList,
  removeCourseByIndex,
  INSTITUTION_SECTORS,
  FILTER_COUNTRIES,
  FILTER_TERRITORIES,
  FILTER_GROUPS,
  COUNTRY_STATES,
  getCountryCode,
  getCountryName,
} from "../utils/helpers";
import type {
  Institution,
  CreateInstitutionData,
} from "../types/institution.types";
import { useAuth } from "../contexts/AuthContext";

interface InstitutionModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  institution?: Institution | null;
  onClose: () => void;
  onSubmit: (data: CreateInstitutionData) => Promise<boolean>;
}

export default function InstitutionModal({
  isOpen,
  mode,
  institution,
  onClose,
  onSubmit,
}: InstitutionModalProps) {
  const { canViewCommission } = useAuth();
  // Form states
  const [formData, setFormData] = useState<Partial<CreateInstitutionData>>({
    name: "",
    country: "",
    state: [],
    sector: "University",
    scholarship: "",
    promotion: "No",
    tat: "",
    group: "",
    url: "",
    global: false,
    course: [],
    territory: [],
    applicationMethod: "",
  });

  // Course form states
  const [newCourse, setNewCourse] = useState({ course: "", commission: "" });

  // Territory input state
  const [territoryInput, setTerritoryInput] = useState("");

  // State input state
  const [stateInput, setStateInput] = useState("");

  // Update form data when institution or mode changes
  useEffect(() => {
    if (mode === "edit" && institution) {
      // Intentional: syncing form state with prop changes for edit mode
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: institution.name,
        country: getCountryName(institution.country),
        state: Array.isArray(institution.state) ? institution.state : (institution.state ? [institution.state] : []),
        sector: institution.sector,
        scholarship: institution.scholarship || "",
        promotion: institution.promotion || "No",
        tat: institution.tat || "",
        group: institution.group || "",
        url: institution.url || "",
        global: institution.global || false,
        course: institution.course || [],
        territory: institution.territory?.map(t => getCountryName(t)) || [],
        parent: institution.parent || "",
        applicationMethod: institution.applicationMethod || "",
      });
    } else if (mode === "create") {
      setFormData({
        name: "",
        country: "",
        state: [],
        sector: "University",
        scholarship: "",
        promotion: "No",
        tat: "",
        group: "",
        url: "",
        global: false,
        course: [],
        territory: [],
        applicationMethod: "",
      });
    }
  }, [mode, institution]);

  // Handle add course to form
  const handleAddCourse = () => {
    const validation = validateCourse(newCourse.course, newCourse.commission);
    if (!validation.isValid) {
      toast.error(validation.error || "Invalid course data");
      return;
    }
    setFormData({
      ...formData,
      course: addCourseToList(formData.course || [], newCourse),
    });
    setNewCourse({ course: "", commission: "" });
  };

  // Handle remove course from form
  const handleRemoveCourse = (index: number) => {
    setFormData({
      ...formData,
      course: removeCourseByIndex(formData.course || [], index),
    });
  };

  // Handle add territory
  const handleAddTerritory = () => {
    if (!territoryInput.trim()) {
      toast.error("Please select a territory");
      return;
    }
    setFormData({
      ...formData,
      territory: [...(formData.territory || []), territoryInput.trim()],
    });
    setTerritoryInput("");
  };

  // Handle remove territory
  const handleRemoveTerritory = (index: number) => {
    setFormData({
      ...formData,
      territory: (formData.territory || []).filter((_, i) => i !== index),
    });
  };

  // Handle add state
  const handleAddState = () => {
    if (!stateInput.trim()) {
      toast.error("Please select a state");
      return;
    }
    if (formData.state?.includes(stateInput.trim())) {
      toast.error("State already added");
      return;
    }
    setFormData({
      ...formData,
      state: [...(formData.state || []), stateInput.trim()],
    });
    setStateInput("");
  };

  // Handle remove state
  const handleRemoveState = (index: number) => {
    setFormData({
      ...formData,
      state: (formData.state || []).filter((_, i) => i !== index),
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clean up the form data before submission
    const cleanedData = {
      ...formData,
      country: formData.country ? getCountryCode(formData.country.trim()) : "",
      state: formData.state || [],
      territory: formData.territory?.map(t => getCountryCode(t.trim())) || [],
      group: formData.group?.trim() || "",
      scholarship: formData.scholarship?.trim() || "",
      url: formData.url?.trim() || "",
    } as CreateInstitutionData;

    const success = await onSubmit(cleanedData);
    if (success) {
      onClose();
      resetForm();
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      country: "",
      state: [],
      sector: "University",
      scholarship: "",
      promotion: "No",
      tat: "",
      group: "",
      url: "",
      global: false,
      course: [],
      territory: [],
      applicationMethod: "",
    });
    setNewCourse({ course: "", commission: "" });
    setTerritoryInput("");
    setStateInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">
            {mode === "create" ? "Create New Institution" : "Edit Institution"}
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
            // Prevent Enter key from submitting the form
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
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Institution name"
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
                  onChange={(e) => setFormData({ ...formData, country: e.target.value, state: [] })}
                >
                  <option value="">Select Country</option>
                  {FILTER_COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              {/* State Section - Only show when country is selected and has states */}
              {formData.country && COUNTRY_STATES[formData.country] && (
                <div className="col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700">State</label>
                  <div className="p-4 mb-4 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="mb-3 text-sm font-medium text-gray-700">Add State</p>
                    <div className="flex gap-2">
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                        value={stateInput}
                        onChange={(e) => setStateInput(e.target.value)}
                      >
                        <option value="">Select State</option>
                        {COUNTRY_STATES[formData.country].map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        onClick={handleAddState}
                        className="flex items-center gap-1 bg-[#0A1F38] hover:bg-[#10192c] whitespace-nowrap"
                        disabled={!stateInput.trim()}
                      >
                        <Plus size={16} />
                        Add
                      </Button>
                    </div>
                  </div>

                  {formData.state && formData.state.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        Added States ({formData.state.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.state.map((state, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full"
                          >
                            {state}
                            <button
                              type="button"
                              onClick={() => handleRemoveState(idx)}
                              className="text-red-600 hover:text-red-800"
                              title="Remove state"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Sector <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  value={formData.sector}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sector: e.target.value as Institution["sector"],
                    })
                  }
                >
                  <option value="">Select sector</option>
                  {INSTITUTION_SECTORS.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Global</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  value={formData.global ? "true" : "false"}
                  onChange={(e) => setFormData({ ...formData, global: e.target.value === "true" })}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Group</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  value={formData.group || ""}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                >
                  <option value="">Select Group</option>
                  {FILTER_GROUPS.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Scholarship</label>
                <Input
                  value={formData.scholarship}
                  onChange={(e) => setFormData({ ...formData, scholarship: e.target.value })}
                  placeholder="Scholarship"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  100% Promotion
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  value={formData.promotion || "No"}
                  onChange={(e) => setFormData({ ...formData, promotion: e.target.value })}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Turn Around Time
                </label>
                <Input
                  value={formData.tat || ""}
                  onChange={(e) => setFormData({ ...formData, tat: e.target.value })}
                  placeholder="Enter turn around time"
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-700">Website URL</label>
                <Input
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Territory Section */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Territory</h3>
            <div className="p-4 mb-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="mb-3 text-sm font-medium text-gray-700">Add Territory</p>
              <div className="flex gap-2">
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  value={territoryInput}
                  onChange={(e) => setTerritoryInput(e.target.value)}
                >
                  <option value="">Select Territory</option>
                  {FILTER_TERRITORIES.map((territory) => (
                    <option key={territory} value={territory}>
                      {territory}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  onClick={handleAddTerritory}
                  className="flex items-center gap-1 bg-[#0A1F38] hover:bg-[#10192c]  whitespace-nowrap"
                  disabled={!territoryInput.trim()}
                >
                  <Plus size={16} />
                  Add
                </Button>
              </div>
            </div>

            {formData.territory && formData.territory.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Added Territories ({formData.territory.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.territory.map((territory, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full"
                    >
                      {territory}
                      <button
                        type="button"
                        onClick={() => handleRemoveTerritory(idx)}
                        className="text-red-600 hover:text-red-800"
                        title="Remove territory"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Application Method Section */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Application Method</h3>
            <div className="space-y-3">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Application Method (Link or Text)
                </label>
                <div className="flex gap-2">
                  <Input
                    value={formData.applicationMethod || ""}
                    onChange={(e) => setFormData({ ...formData, applicationMethod: e.target.value })}
                    placeholder="Enter application method URL or text"
                    className="flex-1"
                  />
                  {formData.applicationMethod && formData.applicationMethod.trim() && (
                    <Button
                      type="button"
                      onClick={() => setFormData({ ...formData, applicationMethod: "" })}
                      variant="outline"
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Clear application method"
                    >
                      <Trash2 size={16} />
                      Clear
                    </Button>
                  )}
                </div>
                {formData.applicationMethod && formData.applicationMethod.trim() && (
                  <p className="mt-2 text-sm text-gray-600">
                    Current: <span className="font-medium">{formData.applicationMethod}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Add Course Form */}
          <div className="p-4 mb-4 border border-gray-200 rounded-lg bg-gray-50">
            <p className="mb-3 text-sm font-medium text-gray-700">Add New Course</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input
                placeholder="Course name"
                value={newCourse.course}
                onChange={(e) => setNewCourse({ ...newCourse, course: e.target.value })}
              />
              <div className="flex gap-2">
                {canViewCommission && (
                  <Input
                    placeholder="Commission (e.g., 10%)"
                    value={newCourse.commission}
                    onChange={(e) => setNewCourse({ ...newCourse, commission: e.target.value })}
                  />
                )}
                <Button
                  type="button"
                  onClick={handleAddCourse}
                  className="flex items-center gap-1 bg-[#313647] hover:bg-[#10192c] whitespace-nowrap"
                  disabled={!newCourse.course.trim() || (canViewCommission && !newCourse.commission.trim())}
                >
                  <Plus size={16} />
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Course List */}
          {formData.course && formData.course.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Added Courses ({formData.course.length})
              </p>
              <div className="space-y-2 overflow-y-auto max-h-60">
                {formData.course.map((course, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{course.course}</p>
                      {canViewCommission && <p className="text-sm text-green-600">{course.commission}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCourse(idx)}
                      className="p-1 text-red-600 transition hover:text-red-800"
                      title="Remove course"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="py-4 text-sm text-center text-gray-500">
              No courses added yet. Add courses using the form above.
            </p>
          )}

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
              {mode === "create" ? "Create Institution" : "Update Institution"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
