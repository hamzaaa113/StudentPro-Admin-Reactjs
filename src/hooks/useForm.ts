import { useState, useCallback } from "react";
import formService from "../services/formService";
import type { Form, CreateFormData, UpdateFormData } from "../types/form.types";
import toast from "react-hot-toast";

export const useForm = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all forms
   */
  const fetchForms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await formService.getAllForms();
      setForms(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch forms";
      setError(errorMessage);
      console.error("Error fetching forms:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create new form
   */
  const createForm = useCallback(async (data: CreateFormData): Promise<boolean> => {
    try {
      const newForm = await formService.createForm(data);
      setForms((prev) => [newForm, ...prev]);
      toast.success("Form created successfully");
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create form";
      toast.error(errorMessage);
      return false;
    }
  }, []);

  /**
   * Update form
   */
  const updateForm = useCallback(
    async (id: string, data: UpdateFormData): Promise<boolean> => {
      try {
        const updatedForm = await formService.updateForm(id, data);
        setForms((prev) =>
          prev.map((form) => (form._id === id ? updatedForm : form))
        );
        toast.success("Form updated successfully");
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update form";
        toast.error(errorMessage);
        return false;
      }
    },
    []
  );

  /**
   * Delete form
   */
  const deleteForm = useCallback(async (id: string): Promise<boolean> => {
    try {
      await formService.deleteForm(id);
      setForms((prev) => prev.filter((form) => form._id !== id));
      toast.success("Form deleted successfully");
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete form";
      toast.error(errorMessage);
      return false;
    }
  }, []);

  return {
    forms,
    loading,
    error,
    fetchForms,
    createForm,
    updateForm,
    deleteForm,
  };
};
