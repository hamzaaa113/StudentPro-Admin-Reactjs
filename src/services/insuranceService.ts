import api from "../api/axiosInstance";
import { API_ENDPOINTS } from "../api/endpoints";
import type {
    CreateHealthInsuranceData,
    UpdateHealthInsuranceData,
    HealthInsuranceFilters,
} from "../types/insurance.types";
import { AxiosError } from "axios";

class HealthInsuranceService {
    /**
     * Get all health insurance companies with optional filters
     */
    async getAll(filters?: HealthInsuranceFilters) {
        try {
            const params = new URLSearchParams();
            if (filters?.country) {
                params.append("country", filters.country);
            }

            const url = `${API_ENDPOINTS.HEALTH_INSURANCE.GET_ALL}${params.toString() ? `?${params.toString()}` : ""
                }`;

            const response = await api.get(url);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.message || "Failed to fetch health insurances");
            }
            throw error;
        }
    }

    /**
     * Get health insurance by ID
     */
    async getById(id: string) {
        try {
            const response = await api.get(API_ENDPOINTS.HEALTH_INSURANCE.GET_BY_ID(id));
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.message || "Failed to fetch health insurance");
            }
            throw error;
        }
    }

    /**
     * Get list of countries with health insurance companies
     */
    async getCountries() {
        try {
            const response = await api.get(API_ENDPOINTS.HEALTH_INSURANCE.GET_COUNTRIES);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.message || "Failed to fetch countries");
            }
            throw error;
        }
    }

    /**
     * Create new health insurance company
     */
    async create(data: CreateHealthInsuranceData) {
        try {
            const response = await api.post(API_ENDPOINTS.HEALTH_INSURANCE.CREATE, data);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.message || "Failed to create health insurance");
            }
            throw error;
        }
    }

    /**
     * Update health insurance company
     */
    async update(id: string, data: UpdateHealthInsuranceData) {
        try {
            const response = await api.put(
                API_ENDPOINTS.HEALTH_INSURANCE.UPDATE(id),
                data
            );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.message || "Failed to update health insurance");
            }
            throw error;
        }
    }

    /**
     * Delete health insurance company
     */
    async delete(id: string) {
        try {
            const response = await api.delete(API_ENDPOINTS.HEALTH_INSURANCE.DELETE(id));
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.message || "Failed to delete health insurance");
            }
            throw error;
        }
    }
}

export default new HealthInsuranceService();
