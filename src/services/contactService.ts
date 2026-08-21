import axiosInstance from "../api/axiosInstance";
import { API_ENDPOINTS } from "../api/endpoints";
import type {
  TeamMember,
  Office,
  TeamMemberFormData,
  OfficeFormData,
} from "../types/contact.types";
import { AxiosError } from "axios";

const message = (error: unknown, fallback: string) => {
  if (error instanceof AxiosError) {
    return new Error(error.response?.data?.message || fallback);
  }
  return error;
};

class ContactService {
  // --- Team members ---

  /**
   * Get team members. The admin listing includes hidden members so they
   * can be toggled back on.
   */
  async getTeamMembers(includeInactive = true): Promise<TeamMember[]> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.TEAM.GET_ALL, {
        params: includeInactive ? { includeInactive: "true" } : undefined,
      });
      return response.data.data;
    } catch (error) {
      throw message(error, "Failed to fetch team members");
    }
  }

  async createTeamMember(data: Partial<TeamMemberFormData>): Promise<TeamMember> {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.TEAM.CREATE, data);
      return response.data.data;
    } catch (error) {
      throw message(error, "Failed to create team member");
    }
  }

  async updateTeamMember(
    id: string,
    data: Partial<TeamMemberFormData>
  ): Promise<TeamMember> {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.TEAM.UPDATE(id), data);
      return response.data.data;
    } catch (error) {
      throw message(error, "Failed to update team member");
    }
  }

  async deleteTeamMember(id: string): Promise<void> {
    try {
      await axiosInstance.delete(API_ENDPOINTS.TEAM.DELETE(id));
    } catch (error) {
      throw message(error, "Failed to delete team member");
    }
  }

  /**
   * Upload a profile photo and get back its Cloudinary URL. Cloudinary
   * squares and face-centres the image, so anything reasonable works.
   */
  async uploadPhoto(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await axiosInstance.post(
        API_ENDPOINTS.TEAM.UPLOAD_PHOTO,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60000,
        }
      );
      return response.data.data.url;
    } catch (error) {
      throw message(error, "Failed to upload photo");
    }
  }

  // --- Offices ---

  async getOffices(includeInactive = true): Promise<Office[]> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.OFFICES.GET_ALL, {
        params: includeInactive ? { includeInactive: "true" } : undefined,
      });
      return response.data.data;
    } catch (error) {
      throw message(error, "Failed to fetch offices");
    }
  }

  async createOffice(data: Partial<OfficeFormData>): Promise<Office> {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.OFFICES.CREATE, data);
      return response.data.data;
    } catch (error) {
      throw message(error, "Failed to create office");
    }
  }

  async updateOffice(id: string, data: Partial<OfficeFormData>): Promise<Office> {
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.OFFICES.UPDATE(id),
        data
      );
      return response.data.data;
    } catch (error) {
      throw message(error, "Failed to update office");
    }
  }

  async deleteOffice(id: string): Promise<void> {
    try {
      await axiosInstance.delete(API_ENDPOINTS.OFFICES.DELETE(id));
    } catch (error) {
      throw message(error, "Failed to delete office");
    }
  }
}

export default new ContactService();
