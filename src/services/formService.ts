import axiosInstance from "../api/axiosInstance";
import { API_ENDPOINTS } from "../api/endpoints";
import type { Form, CreateFormData, UpdateFormData } from "../types/form.types";
import { AxiosError } from "axios";

class FormService {
  /**
   * Get all forms
   */
  async getAllForms(): Promise<{ success: boolean; data: Form[]; total: number }> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.FORMS.GET_ALL);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to fetch forms");
      }
      throw error;
    }
  }

  /**
   * Get form by ID
   */
  async getFormById(id: string): Promise<Form> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.FORMS.GET(id));
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to fetch form");
      }
      throw error;
    }
  }

  /**
   * Create new form
   */
  async createForm(data: CreateFormData): Promise<Form> {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.FORMS.CREATE, data);
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to create form");
      }
      throw error;
    }
  }

  /**
   * Update form
   */
  async updateForm(id: string, data: UpdateFormData): Promise<Form> {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.FORMS.UPDATE(id), data);
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to update form");
      }
      throw error;
    }
  }

  /**
   * Delete form
   */
  async deleteForm(id: string): Promise<void> {
    try {
      await axiosInstance.delete(API_ENDPOINTS.FORMS.DELETE(id));
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to delete form");
      }
      throw error;
    }
  }
}

export default new FormService();
