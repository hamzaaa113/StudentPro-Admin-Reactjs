import { useState, useEffect, useCallback } from "react";
import type { Popup, CreatePopupData, UpdatePopupData } from "../types/popup.types";
import { popupService } from "../services/popupService";
import { toast } from "../lib/toast";

export const usePopup = () => {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [activePopups, setActivePopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPopups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await popupService.getAllPopups();
      setPopups(response.popups);
    } catch {
      const errorMessage = "Failed to fetch popups";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActivePopups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await popupService.getActivePopups();
      setActivePopups(response.popups);
    } catch {
      const errorMessage = "Failed to fetch active popups";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPopup = useCallback(async (data: CreatePopupData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await popupService.createPopup(data);
      toast.success(response.message || "Popup created successfully");
      await fetchPopups();
      return response.popup;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create popup";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPopups]);

  const updatePopup = useCallback(async (id: string, data: UpdatePopupData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await popupService.updatePopup(id, data);
      toast.success(response.message || "Popup updated successfully");
      await fetchPopups();
      return response.popup;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update popup";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPopups]);

  const deletePopup = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await popupService.deletePopup(id);
      toast.success(response.message || "Popup deleted successfully");
      await fetchPopups();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete popup";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPopups]);

  const togglePopupStatus = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await popupService.togglePopupStatus(id);
      toast.success(response.message || "Popup status updated successfully");
      await fetchPopups();
      return response.popup;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to toggle popup status";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchPopups]);

  useEffect(() => {
    fetchPopups();
  }, [fetchPopups]);

  return {
    popups,
    activePopups,
    loading,
    error,
    fetchPopups,
    fetchActivePopups,
    createPopup,
    updatePopup,
    deletePopup,
    togglePopupStatus,
  };
};
