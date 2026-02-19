import { useState, useEffect, useRef } from "react";
import { FileText, Plus, Edit2, Trash2, ExternalLink, X } from "lucide-react";
import { useForm } from "../hooks/useForm";
import type { Form } from "../types/form.types";
import { useAuth } from "../contexts/AuthContext";

const FormsDropdown = () => {
  const { canDelete } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newForm, setNewForm] = useState({ title: "", content: "" });
  const [editForm, setEditForm] = useState({ title: "", content: "" });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    forms,
    loading,
    fetchForms,
    createForm,
    updateForm,
    deleteForm,
  } = useForm();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAdding(false);
        setEditingId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchForms();
    }
  }, [isOpen, fetchForms]);

  const handleAddForm = async () => {
    if (!newForm.title.trim() || !newForm.content.trim()) {
      return;
    }

    const success = await createForm(newForm);
    if (success) {
      setNewForm({ title: "", content: "" });
      setIsAdding(false);
    }
  };

  const handleUpdateForm = async (id: string) => {
    if (!editForm.title.trim() || !editForm.content.trim()) {
      return;
    }

    const success = await updateForm(id, editForm);
    if (success) {
      setEditingId(null);
      setEditForm({ title: "", content: "" });
    }
  };

  const handleDeleteForm = async (id: string) => {
    if (!confirm("Are you sure you want to delete this form?")) return;

    await deleteForm(id);
  };

  const startEdit = (form: Form) => {
    setEditingId(form._id);
    setEditForm({
      title: form.title,
      content: form.content,
    });
  };

  const renderFormContent = (form: Form) => {
    if (form.isUrl) {
      return (
        <a
          href={form.content}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center flex-1 min-w-0 gap-1 text-blue-600 hover:text-blue-700 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="truncate">{form.title}</span>
          <ExternalLink size={14} className="flex-shrink-0" />
        </a>
      );
    }
    return (
      <span className="flex-1 min-w-0 text-gray-700 truncate">
        {form.title}
      </span>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-[#313647] hover:bg-[#ABDBC0] transition-colors relative"
        aria-label="Forms"
      >
        <FileText size={20} fill={isOpen ? "#313647" : "none"} />
        {forms.length > 0 && (
          <span className="absolute w-2 h-2 bg-blue-500 rounded-full top-1 right-1"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 flex flex-col mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg w-96 max-h-96">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
            <h3 className="flex items-center gap-2 font-semibold text-gray-800">
              <FileText size={18} />
              Forms
            </h3>
            <button
              onClick={() => {
                setIsAdding(!isAdding);
                setEditingId(null);
              }}
              className="p-1 transition-colors rounded hover:bg-gray-200"
              aria-label="Add form"
            >
              {isAdding ? <X size={18} /> : <Plus size={18} />}
            </button>
          </div>

          {/* Add New Form */}
          {isAdding && (
            <div className="p-3 border-b border-gray-200 bg-blue-50">
              <input
                type="text"
                placeholder="Title *"
                value={newForm.title}
                onChange={(e) =>
                  setNewForm({ ...newForm, title: e.target.value })
                }
                className="w-full px-3 py-1.5 border border-gray-300 rounded mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="Link or text *"
                value={newForm.content}
                onChange={(e) =>
                  setNewForm({ ...newForm, content: e.target.value })
                }
                className="w-full px-3 py-1.5 border border-gray-300 rounded mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddForm}
                  className="flex-1 px-3 py-1.5 bg-[#0A1F38] text-white rounded text-sm hover:bg-[#10192c] transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewForm({ title: "", content: "" });
                  }}
                  className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Forms List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : forms.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No forms yet. Click + to add one!
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {forms.map((form) => (
                  <div
                    key={form._id}
                    className="p-3 transition-colors hover:bg-gray-50"
                  >
                    {editingId === form._id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Title *"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <input
                          type="text"
                          placeholder="Link or text *"
                          value={editForm.content}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              content: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateForm(form._id)}
                            className="flex-1 px-2 py-1 text-sm text-white transition-colors bg-teal-600 rounded hover:bg-teal-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditForm({ title: "", content: "" });
                            }}
                            className="px-2 py-1 text-sm text-gray-700 transition-colors bg-gray-300 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          {renderFormContent(form)}
                          {!form.isUrl && (
                            <p className="mt-1 text-xs text-gray-500 truncate">
                              {form.content}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-shrink-0 gap-1">
                          <button
                            onClick={() => startEdit(form)}
                            className="p-1 text-blue-600 transition-colors rounded hover:bg-gray-200"
                            aria-label="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteForm(form._id)}
                              className="p-1 text-red-600 transition-colors rounded hover:bg-gray-200"
                              aria-label="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormsDropdown;
