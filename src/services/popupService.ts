import axiosInstance from "../api/axiosInstance";
import type { Popup, CreatePopupData, UpdatePopupData } from "../types/popup.types";

class PopupService {
  private endpoint = "/popup";

  async getAllPopups() {
    const response = await axiosInstance.get<{ popups: Popup[]; total: number }>(
      this.endpoint
    );
    return response.data;
  }

  async getActivePopups() {
    const response = await axiosInstance.get<{ popups: Popup[]; total: number }>(
      `${this.endpoint}/active`
    );
    return response.data;
  }

  async getPopupById(id: string) {
    const response = await axiosInstance.get<{ popup: Popup }>(
      `${this.endpoint}/${id}`
    );
    return response.data;
  }

  async createPopup(data: CreatePopupData) {
    const response = await axiosInstance.post<{ message: string; popup: Popup }>(
      this.endpoint,
      data
    );
    return response.data;
  }

  async updatePopup(id: string, data: UpdatePopupData) {
    const response = await axiosInstance.put<{ message: string; popup: Popup }>(
      `${this.endpoint}/${id}`,
      data
    );
    return response.data;
  }

  async deletePopup(id: string) {
    const response = await axiosInstance.delete<{ message: string }>(
      `${this.endpoint}/${id}`
    );
    return response.data;
  }

  async togglePopupStatus(id: string) {
    const response = await axiosInstance.patch<{ message: string; popup: Popup }>(
      `${this.endpoint}/${id}/toggle`
    );
    return response.data;
  }
}

export const popupService = new PopupService();
