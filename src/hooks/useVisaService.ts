import { useState, useEffect } from "react";
import visaServiceService from "../services/visaService";
import type {
    VisaService,
    CreateVisaServiceData,
    UpdateVisaServiceData,
    VisaServiceFilters,
} from "../types/visaService.types";
import toast from "react-hot-toast";

export const useVisaService = () => {
    const [visaServices, setVisaServices] = useState<VisaService[]>([]);
    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState<string[]>([]);

    // Fetch all visa services
    const fetchVisaServices = async (filters?: VisaServiceFilters) => {
        setLoading(true);
        try {
            const response = await visaServiceService.getAll(filters);
            if (response.success) {
                setVisaServices(response.data);
            }
        } catch (error: unknown) {
            console.error("Error fetching visa services:", error);
            toast.error(error instanceof Error ? error.message : "Failed to fetch visa services");
        } finally {
            setLoading(false);
        }
    };

    // Fetch countries list
    const fetchCountries = async () => {
        try {
            const response = await visaServiceService.getCountries();
            if (response.success) {
                setCountries(response.data);
            }
        } catch (error: unknown) {
            console.error("Error fetching countries:", error);
        }
    };

    // Create new visa service
    const createVisaService = async (data: CreateVisaServiceData) => {
        try {
            const response = await visaServiceService.create(data);
            if (response.success) {
                toast.success("Visa service created successfully");
                await fetchVisaServices();
                return true;
            }
            return false;
        } catch (error: unknown) {
            console.error("Error creating visa service:", error);
            toast.error(error instanceof Error ? error.message : "Failed to create visa service");
            return false;
        }
    };

    // Update visa service
    const updateVisaService = async (
        id: string,
        data: UpdateVisaServiceData
    ) => {
        try {
            const response = await visaServiceService.update(id, data);
            if (response.success) {
                toast.success("Visa service updated successfully");
                await fetchVisaServices();
                return true;
            }
            return false;
        } catch (error: unknown) {
            console.error("Error updating visa service:", error);
            toast.error(error instanceof Error ? error.message : "Failed to update visa service");
            return false;
        }
    };

    // Delete visa service
    const deleteVisaService = async (id: string) => {
        try {
            const response = await visaServiceService.delete(id);
            if (response.success) {
                toast.success("Visa service deleted successfully");
                await fetchVisaServices();
                return true;
            }
            return false;
        } catch (error: unknown) {
            console.error("Error deleting visa service:", error);
            toast.error(error instanceof Error ? error.message : "Failed to delete visa service");
            return false;
        }
    };

    // Load data on mount
    useEffect(() => {
        fetchVisaServices();
        fetchCountries();
    }, []);

    return {
        visaServices,
        loading,
        countries,
        fetchVisaServices,
        createVisaService,
        updateVisaService,
        deleteVisaService,
    };
};
