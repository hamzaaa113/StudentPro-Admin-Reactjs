import api from "../api/axiosInstance";
import { API_ENDPOINTS } from "../api/endpoints";
import type {
    CreateVisaServiceData,
    UpdateVisaServiceData,
    VisaServiceFilters,
} from "../types/visaService.types";
import { AxiosError } from "axios";

class VisaServiceService {
    /**
     * Get all visa services with optional filters
     */
    async getAll(filters?: VisaServiceFilters) {
        try {
            const params = new URLSearchParams();
            if (filters?.country) {
                params.append("country", filters.country);
            }

            const url = `${API_ENDPOINTS.VISA_SERVICE.GET_ALL}${params.toString() ? `?${params.toString()}` : ""}`;

            const response = await api.get(url);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.message || "Failed to fetch visa services");
            }
            throw error;
        }
    }

    /**
     * Get visa service by ID
     */
    async getById(id: string) {
        try {
            const response = await api.get(API_ENDPOINTS.VISA_SERVICE.GET_BY_ID(id));
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.message || "Failed to fetch visa service");
            }
            throw error;
        }
    }

    /**
     * Get list of countries with visa services
     */
    async getCountries() {
        try {
            const response = await api.get(API_ENDPOINTS.VISA_SERVICE.GET_COUNTRIES);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.message || "Failed to fetch countries");
            }
            throw error;
        }
    }

    /**
     * Create new visa service
     */
    async create(data: CreateVisaServiceData) {
        try {
            const response = await api.post(API_ENDPOINTS.VISA_SERVICE.CREATE, data);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.message || "Failed to create visa service");
            }
            throw error;
        }
    }

    /**
     * Update visa service
     */
    async update(id: string, data: UpdateVisaServiceData) {
        try {
            const response = await api.put(
                API_ENDPOINTS.VISA_SERVICE.UPDATE(id),
                data
            );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.message || "Failed to update visa service");
            }
            throw error;
        }
    }

    /**
     * Delete visa service
     */
    async delete(id: string) {
        try {
            const response = await api.delete(API_ENDPOINTS.VISA_SERVICE.DELETE(id));
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.message || "Failed to delete visa service");
            }
            throw error;
        }
    }
}

export default new VisaServiceService();
