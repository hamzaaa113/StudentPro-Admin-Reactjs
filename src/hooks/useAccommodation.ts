import { useState, useEffect, useCallback } from "react";
import type { Accommodation, CreateAccommodationData, UpdateAccommodationData } from "../types/accommodation";
import { accommodationService } from "../services/accommodationService";
import { toast } from "../lib/toast";

export const useAccommodation = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccommodations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await accommodationService.getAllAccommodations();
      setAccommodations(response.data);
    } catch {
      const errorMessage = "Failed to fetch accommodations";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCountries = useCallback(async () => {
    try {
      const response = await accommodationService.getCountries();
      setCountries(response.data);
    } catch {
      console.error("Failed to fetch countries");
    }
  }, []);

  const createAccommodation = async (data: CreateAccommodationData) => {
    try {
      await accommodationService.createAccommodation(data);
      toast.success("Accommodation created successfully");
      await fetchAccommodations();
      return true;
    } catch {
      toast.error("Failed to create accommodation");
      return false;
    }
  };

  const updateAccommodation = async (
    id: string,
    data: UpdateAccommodationData
  ) => {
    try {
      await accommodationService.updateAccommodation(id, data);
      toast.success("Accommodation updated successfully");
      await fetchAccommodations();
      return true;
    } catch {
      toast.error("Failed to update accommodation");
      return false;
    }
  };

  const deleteAccommodation = async (id: string) => {
    try {
      await accommodationService.deleteAccommodation(id);
      toast.success("Accommodation deleted successfully");
      await fetchAccommodations();
    } catch {
      toast.error("Failed to delete accommodation");
    }
  };

  useEffect(() => {
    fetchAccommodations();
    fetchCountries();
  }, [fetchAccommodations, fetchCountries]);

  return {
    accommodations,
    countries,
    loading,
    error,
    createAccommodation,
    updateAccommodation,
    deleteAccommodation,
    refetch: fetchAccommodations,
  };
};
