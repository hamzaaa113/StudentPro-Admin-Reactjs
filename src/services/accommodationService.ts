import axiosInstance from "../api/axiosInstance";
import type { Accommodation, CreateAccommodationData, UpdateAccommodationData } from "../types/accommodation";

class AccommodationService {
  private endpoint = "/accommodation";

  async getAllAccommodations() {
    const response = await axiosInstance.get<{ data: Accommodation[] }>(
      this.endpoint
    );
    return response.data;
  }

  async getAccommodationById(id: string) {
    const response = await axiosInstance.get<{ data: Accommodation }>(
      `${this.endpoint}/${id}`
    );
    return response.data;
  }

  async createAccommodation(data: CreateAccommodationData) {
    const response = await axiosInstance.post<{ data: Accommodation }>(
      this.endpoint,
      data
    );
    return response.data;
  }

  async updateAccommodation(id: string, data: UpdateAccommodationData) {
    const response = await axiosInstance.put<{ data: Accommodation }>(
      `${this.endpoint}/${id}`,
      data
    );
    return response.data;
  }

  async deleteAccommodation(id: string) {
    const response = await axiosInstance.delete<{ message: string }>(
      `${this.endpoint}/${id}`
    );
    return response.data;
  }

  async getCountries() {
    const response = await axiosInstance.get<{ data: string[] }>(
      `${this.endpoint}/countries`
    );
    return response.data;
  }
}

export const accommodationService = new AccommodationService();
