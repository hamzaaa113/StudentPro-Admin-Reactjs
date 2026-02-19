import axiosInstance from "../api/axiosInstance";
import { API_ENDPOINTS } from "../api/endpoints";
import type {
  SkillAssessment,
  SkillAssessmentFilters,
  SkillAssessmentsResponse,
  SingleSkillAssessmentResponse,
  CreateSkillAssessmentData,
  UpdateSkillAssessmentData,
  OccupationGroupsResponse,
  PathwaysStreamsResponse,
  XLSXImportResponse,
  XLSXExportFilters,
} from "../types/skillAssessment.types";
import { AxiosError } from "axios";
import * as XLSX from "xlsx";

class SkillAssessmentService {
  /**
   * Get all skill assessments with optional filters
   */
  async getAllSkillAssessments(
    filters?: SkillAssessmentFilters
  ): Promise<SkillAssessmentsResponse> {
    try {
      const response = await axiosInstance.get<SkillAssessmentsResponse>(
        API_ENDPOINTS.SKILL_ASSESSMENT.GET_ALL,
        { params: { ...filters, _t: Date.now() } }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to fetch skill assessments");
      }
      throw error;
    }
  }

  /**
   * Get skill assessment by ID
   */
  async getSkillAssessmentById(id: string): Promise<SkillAssessment> {
    try {
      const response = await axiosInstance.get<SingleSkillAssessmentResponse>(
        API_ENDPOINTS.SKILL_ASSESSMENT.GET_BY_ID(id)
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to fetch skill assessment");
      }
      throw error;
    }
  }

  /**
   * Get unique occupation groups
   */
  async getOccupationGroups(): Promise<string[]> {
    try {
      const response = await axiosInstance.get<OccupationGroupsResponse>(
        API_ENDPOINTS.SKILL_ASSESSMENT.GET_OCCUPATION_GROUPS
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to fetch occupation groups");
      }
      throw error;
    }
  }

  /**
   * Get unique pathways/streams
   */
  async getPathwaysStreams(): Promise<string[]> {
    try {
      const response = await axiosInstance.get<PathwaysStreamsResponse>(
        API_ENDPOINTS.SKILL_ASSESSMENT.GET_PATHWAYS_STREAMS
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to fetch pathways/streams");
      }
      throw error;
    }
  }

  /**
   * Create new skill assessment
   */
  async createSkillAssessment(data: CreateSkillAssessmentData): Promise<SkillAssessment> {
    try {
      const response = await axiosInstance.post<SingleSkillAssessmentResponse>(
        API_ENDPOINTS.SKILL_ASSESSMENT.CREATE,
        data
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to create skill assessment");
      }
      throw error;
    }
  }

  /**
   * Update skill assessment
   */
  async updateSkillAssessment(
    id: string,
    data: UpdateSkillAssessmentData
  ): Promise<SkillAssessment> {
    try {
      const response = await axiosInstance.put<SingleSkillAssessmentResponse>(
        API_ENDPOINTS.SKILL_ASSESSMENT.UPDATE(id),
        data
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to update skill assessment");
      }
      throw error;
    }
  }

  /**
   * Delete skill assessment
   */
  async deleteSkillAssessment(id: string): Promise<void> {
    try {
      await axiosInstance.delete(API_ENDPOINTS.SKILL_ASSESSMENT.DELETE(id));
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to delete skill assessment");
      }
      throw error;
    }
  }

  /**
   * Export skill assessments to XLSX
   */
  async exportToXLSX(filters?: XLSXExportFilters): Promise<Blob> {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.SKILL_ASSESSMENT.EXPORT_XLSX, {
        params: filters,
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to export skill assessments");
      }
      throw error;
    }
  }

  /**
   * Import skill assessments from XLSX file
   */
  async importFromXLSX(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<XLSXImportResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post<XLSXImportResponse>(
        API_ENDPOINTS.SKILL_ASSESSMENT.IMPORT_XLSX,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(percentCompleted);
            }
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to import skill assessments");
      }
      throw error;
    }
  }

  /**
   * Download XLSX template
   */
  downloadTemplate(): void {
    // Create a simple data structure for Excel template
    const templateData = [
      {
        occupationGroups: "Example Group",
        pathwaysStreams: "Example Stream",
        standardFeeAUD: "$500",
        priorityFeeAUD: "$750",
        standardProcessingTime: "4-6 weeks",
        assessingBodyName: "Example Assessing Body",
        assessingBodyLink: "https://example.com/assessing-body",
        priorityAvailable: "Yes",
        documentsChecklist: "Document 1, Document 2",
        officialLink: "https://example.com",
      },
    ];

    // Create worksheet from data
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Set column widths
    ws["!cols"] = [
      { wch: 30 }, // occupationGroups
      { wch: 30 }, // pathwaysStreams
      { wch: 15 }, // standardFeeAUD
      { wch: 15 }, // priorityFeeAUD
      { wch: 20 }, // standardProcessingTime
      { wch: 25 }, // assessingBodyName
      { wch: 40 }, // assessingBodyLink
      { wch: 15 }, // priorityAvailable
      { wch: 40 }, // documentsChecklist
      { wch: 50 }, // officialLink
    ];

    // Create workbook and add worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Skill Assessments Template");

    // Generate and download file
    XLSX.writeFile(wb, `skill-assessments-template-${Date.now()}.xlsx`);
  }
}

export default new SkillAssessmentService();
