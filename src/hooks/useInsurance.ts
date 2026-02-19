import { useState, useEffect } from "react";
import healthInsuranceService from "../services/insuranceService";
import type {
    HealthInsurance,
    CreateHealthInsuranceData,
    UpdateHealthInsuranceData,
    HealthInsuranceFilters,
} from "../types/insurance.types";
import toast from "react-hot-toast";

export const useHealthInsurance = () => {
    const [healthInsurances, setHealthInsurances] = useState<HealthInsurance[]>([]);
    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState<string[]>([]);

    // Fetch all health insurance companies
    const fetchHealthInsurances = async (filters?: HealthInsuranceFilters) => {
        setLoading(true);
        try {
            const response = await healthInsuranceService.getAll(filters);
            if (response.success) {
                setHealthInsurances(response.data);
            }
        } catch (error: unknown) {
            console.error("Error fetching health insurances:", error);
            toast.error(error instanceof Error ? error.message : "Failed to fetch health insurances");
        } finally {
            setLoading(false);
        }
    };

    // Fetch countries list
    const fetchCountries = async () => {
        try {
            const response = await healthInsuranceService.getCountries();
            if (response.success) {
                setCountries(response.data);
            }
        } catch (error: unknown) {
            console.error("Error fetching countries:", error);
        }
    };

    // Create new health insurance
    const createHealthInsurance = async (data: CreateHealthInsuranceData) => {
        try {
            const response = await healthInsuranceService.create(data);
            if (response.success) {
                toast.success("Health insurance created successfully");
                await fetchHealthInsurances();
                return true;
            }
            return false;
        } catch (error: unknown) {
            console.error("Error creating health insurance:", error);
            toast.error(error instanceof Error ? error.message : "Failed to create health insurance");
            return false;
        }
    };

    // Update health insurance
    const updateHealthInsurance = async (
        id: string,
        data: UpdateHealthInsuranceData
    ) => {
        try {
            const response = await healthInsuranceService.update(id, data);
            if (response.success) {
                toast.success("Health insurance updated successfully");
                await fetchHealthInsurances();
                return true;
            }
            return false;
        } catch (error: unknown) {
            console.error("Error updating health insurance:", error);
            toast.error(error instanceof Error ? error.message : "Failed to update health insurance");
            return false;
        }
    };

    // Delete health insurance
    const deleteHealthInsurance = async (id: string) => {
        try {
            const response = await healthInsuranceService.delete(id);
            if (response.success) {
                toast.success("Health insurance deleted successfully");
                await fetchHealthInsurances();
                return true;
            }
            return false;
        } catch (error: unknown) {
            console.error("Error deleting health insurance:", error);
            toast.error(error instanceof Error ? error.message : "Failed to delete health insurance");
            return false;
        }
    };

    // Load data on mount
    useEffect(() => {
        fetchHealthInsurances();
        fetchCountries();
    }, []);

    return {
        healthInsurances,
        loading,
        countries,
        fetchHealthInsurances,
        createHealthInsurance,
        updateHealthInsurance,
        deleteHealthInsurance,
    };
};
