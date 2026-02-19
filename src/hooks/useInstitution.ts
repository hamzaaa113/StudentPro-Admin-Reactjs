import { useState, useEffect, useCallback } from "react";
import institutionService from "../services/institutionService";
import type {
  Institution,
  InstitutionFilters,
  CreateInstitutionData,
  UpdateInstitutionData,
  AddCourseData,
  XLSXImportResponse,
  XLSXExportFilters,
} from "../types/institution.types";
import toast from "react-hot-toast";

export const useInstitutions = (initialFilters?: InstitutionFilters) => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InstitutionFilters>({
    page: 1,
    pageSize: 15,
    ...initialFilters,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 15,
    total: 0,
    totalPages: 0,
  });

  // XLSX states
  const [importing, setImporting] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);

  /**
   * Fetch institutions with current filters
   */
  const fetchInstitutions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await institutionService.getAllInstitutions(filters);
      setInstitutions(response.data);
      setPagination({
        page: response.page,
        pageSize: response.pageSize,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch institutions";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Update filters and reset to page 1
   * Note: This replaces the current filters with newFilters (except for page/pageSize defaults)
   * This ensures that if a filter is removed from newFilters, it is also removed from state
   */
  const updateFilters = useCallback((newFilters: Partial<InstitutionFilters>) => {
    setFilters((prev) => ({
      page: 1,
      pageSize: newFilters.pageSize || prev.pageSize || 15,
      ...newFilters,
    } as InstitutionFilters));
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({ page: 1, pageSize: 15 });
  }, []);

  /**
   * Change page
   */
  const changePage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  /**
   * Create new institution
   */
  const createInstitution = async (data: CreateInstitutionData): Promise<boolean> => {
    try {
      await institutionService.createInstitution(data);
      toast.success("Institution created successfully");
      await fetchInstitutions();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create institution";
      toast.error(errorMessage);
      return false;
    }
  };

  /**
   * Update institution
   */
  const updateInstitution = async (id: string, data: UpdateInstitutionData): Promise<boolean> => {
    try {
      await institutionService.updateInstitution(id, data);
      toast.success("Institution updated successfully");
      await fetchInstitutions();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update institution";
      toast.error(errorMessage);
      return false;
    }
  };

  /**
   * Delete institution
   */
  const deleteInstitution = async (id: string): Promise<boolean> => {
    try {
      await institutionService.deleteInstitution(id);
      toast.success("Institution deleted successfully");
      await fetchInstitutions();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete institution";
      toast.error(errorMessage);
      return false;
    }
  };

  /**
   * Add course to institution
   */
  const addCourse = async (id: string, courseData: AddCourseData): Promise<boolean> => {
    try {
      await institutionService.addCourse(id, courseData);
      toast.success("Course added successfully");
      await fetchInstitutions();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add course";
      toast.error(errorMessage);
      return false;
    }
  };

  /**
   * Remove course from institution
   */
  const removeCourse = async (id: string, courseIndex: number): Promise<boolean> => {
    try {
      await institutionService.removeCourse(id, courseIndex);
      toast.success("Course removed successfully");
      await fetchInstitutions();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to remove course";
      toast.error(errorMessage);
      return false;
    }
  };

  /**
   * Search institutions
   */
  const searchInstitutions = async (query: string): Promise<Institution[]> => {
    try {
      return await institutionService.searchInstitutions(query);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to search institutions";
      toast.error(errorMessage);
      return [];
    }
  };

  /**
   * Export institutions to XLSX
   */
  const exportToXLSX = async (exportFilters?: XLSXExportFilters): Promise<boolean> => {
    setExporting(true);
    try {
      // Convert InstitutionFilters to XLSXExportFilters if needed
      const filtersToUse: XLSXExportFilters = exportFilters || {
        name: filters.name,
        country: filters.country,
        state: filters.state,
        sector: filters.sector,
        global: filters.global,
        scholarship: filters.scholarship,
        group: filters.group,
        territory: Array.isArray(filters.territory)
          ? filters.territory.join(',')
          : filters.territory,
      };

      const blob = await institutionService.exportToXLSX(filtersToUse);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `institutions_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Institutions exported successfully");
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to export institutions";
      toast.error(errorMessage);
      return false;
    } finally {
      setExporting(false);
    }
  };

  /**
   * Import institutions from XLSX
   */
  const importFromXLSX = async (file: File): Promise<XLSXImportResponse | null> => {
    setImporting(true);
    try {
      const result = await institutionService.importFromXLSX(file);

      // Show success message with summary
      const { summary } = result;
      toast.success(
        `Import completed! Created: ${summary.created}, Updated: ${summary.updated}, Skipped: ${summary.skipped}`,
        { duration: 5000 }
      );

      // Show errors if any
      if (result.errors && result.errors.length > 0) {
        toast.error(`${result.errors.length} rows had errors. Check the import result for details.`, {
          duration: 5000,
        });
      }

      // Refresh the institutions list
      await fetchInstitutions();

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to import institutions";
      toast.error(errorMessage);
      return null;
    } finally {
      setImporting(false);
    }
  };

  /**
   * Download XLSX template
   */
  const downloadTemplate = () => {
    try {
      institutionService.downloadTemplate();
      toast.success("Template downloaded successfully");
    } catch {
      toast.error("Failed to download template");
    }
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchInstitutions();
  }, [fetchInstitutions]);

  return {
    institutions,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    clearFilters,
    changePage,
    refetch: fetchInstitutions,
    createInstitution,
    updateInstitution,
    deleteInstitution,
    addCourse,
    removeCourse,
    searchInstitutions,

    // XLSX operations
    exportToXLSX,
    importFromXLSX,
    downloadTemplate,
    importing,
    exporting,
  };
};