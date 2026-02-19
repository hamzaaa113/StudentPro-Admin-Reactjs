import axiosInstance from "../api/axiosInstance";
import { API_ENDPOINTS } from "../api/endpoints";
import type {
  Institution,
  InstitutionFilters,
  InstitutionsResponse,
  SingleInstitutionResponse,
  CreateInstitutionData,
  UpdateInstitutionData,
  AddCourseData,
  XLSXImportResponse,
  XLSXExportFilters,
} from "../types/institution.types";
import { AxiosError } from "axios";

class InstitutionService {
  /**
   * Get all institutions with optional filters and pagination
   */
  async getAllInstitutions(filters?: InstitutionFilters): Promise<InstitutionsResponse> {
    try {
      const response = await axiosInstance.get<InstitutionsResponse>(
        API_ENDPOINTS.INSTITUTIONS.GET_ALL,
        { params: { ...filters, _t: Date.now() } }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to fetch institutions");
      }
      throw error;
    }
  }

  /**
   * Get institution by ID
   */
  async getInstitutionById(id: string): Promise<Institution> {
    try {
      const response = await axiosInstance.get<SingleInstitutionResponse>(
        API_ENDPOINTS.INSTITUTIONS.GET_BY_ID(id)
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to fetch institution");
      }
      throw error;
    }
  }

  /**
   * Search institutions by name
   */
  async searchInstitutions(query: string): Promise<Institution[]> {
    try {
      const response = await axiosInstance.get<{
        success: boolean;
        count: number;
        data: Institution[];
      }>(API_ENDPOINTS.INSTITUTIONS.SEARCH(query));
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to search institutions");
      }
      throw error;
    }
  }

  /**
   * Get institutions by country
   */
  async getInstitutionsByCountry(country: string): Promise<Institution[]> {
    try {
      const response = await axiosInstance.get<{
        success: boolean;
        count: number;
        data: Institution[];
      }>(API_ENDPOINTS.INSTITUTIONS.BY_COUNTRY(country));
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to fetch institutions by country");
      }
      throw error;
    }
  }

  /**
   * Get institutions with scholarships
   */
  async getInstitutionsWithScholarships(): Promise<Institution[]> {
    try {
      const response = await axiosInstance.get<{
        success: boolean;
        count: number;
        data: Institution[];
      }>(API_ENDPOINTS.INSTITUTIONS.WITH_SCHOLARSHIPS);
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to fetch institutions with scholarships");
      }
      throw error;
    }
  }

  /**
   * Create new institution
   */
  async createInstitution(data: CreateInstitutionData): Promise<Institution> {
    try {
      const response = await axiosInstance.post<{
        success: boolean;
        message: string;
        data: Institution;
      }>(API_ENDPOINTS.INSTITUTIONS.CREATE, data);
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to create institution");
      }
      throw error;
    }
  }

  /**
   * Update institution
   */
  async updateInstitution(id: string, data: UpdateInstitutionData): Promise<Institution> {
    try {
      const response = await axiosInstance.put<{
        success: boolean;
        message: string;
        data: Institution;
      }>(API_ENDPOINTS.INSTITUTIONS.UPDATE(id), data);
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to update institution");
      }
      throw error;
    }
  }

  /**
   * Delete institution
   */
  async deleteInstitution(id: string): Promise<void> {
    try {
      await axiosInstance.delete(API_ENDPOINTS.INSTITUTIONS.DELETE(id));
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to delete institution");
      }
      throw error;
    }
  }

  /**
   * Add course to institution
   */
  async addCourse(id: string, courseData: AddCourseData): Promise<Institution> {
    try {
      const response = await axiosInstance.post<{
        success: boolean;
        message: string;
        data: Institution;
      }>(API_ENDPOINTS.INSTITUTIONS.ADD_COURSE(id), courseData);
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to add course");
      }
      throw error;
    }
  }

  /**
   * Remove course from institution
   */
  async removeCourse(id: string, courseIndex: number): Promise<Institution> {
    try {
      const response = await axiosInstance.delete<{
        success: boolean;
        message: string;
        data: Institution;
      }>(API_ENDPOINTS.INSTITUTIONS.REMOVE_COURSE(id, courseIndex));
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to remove course");
      }
      throw error;
    }
  }

  /**
   * Export institutions to XLSX
   * Note: The backend API should exclude MongoDB-specific fields (_id, __v, createdAt, updatedAt)
   * from the exported file to keep it clean for external use.
   * If the backend includes these fields, they need to be filtered on the backend side
   * before generating the XLSX file.
   */
  async exportToXLSX(filters?: XLSXExportFilters): Promise<Blob> {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.INSTITUTIONS.EXPORT_XLSX,
        {
          params: filters,
          responseType: 'blob', // Important for file download
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to export institutions");
      }
      throw error;
    }
  }

  /**
   * Import institutions from XLSX file
   */
  async importFromXLSX(file: File, onProgress?: (progress: number) => void): Promise<XLSXImportResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post<XLSXImportResponse>(
        API_ENDPOINTS.INSTITUTIONS.IMPORT_XLSX,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 300000, // 5 minutes timeout for large imports
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(percentCompleted);
            }
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to import institutions");
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
        'Name': 'Example University',
        'Country': 'USA',
        'State': 'California; New York',
        'Type': 'University',
        'Territory': 'US; UK; CA',
        'Promoted': 'featured; top',
        'Scholarship': 'yes',
        'Promotion': 'Special offer',
        'Group': 'UC System',
        'URL': 'https://example.edu',
        'Parent': '',
        'Global': 'Yes',
        'Course': 'MBA 10% | PhD 15%'
      },
      {
        'Name': 'Sample College',
        'Country': 'Canada',
        'State': 'Ontario',
        'Type': 'College',
        'Territory': 'CA',
        'Promoted': '',
        'Scholarship': 'no',
        'Promotion': '',
        'Group': '',
        'URL': 'https://sample.ca',
        'Parent': '',
        'Global': 'No',
        'Course': 'Business 8%'
      }
    ];

    // Convert to CSV format as a simple template
    const headers = Object.keys(templateData[0]);
    const csvContent = [
      headers.join(','),
      ...templateData.map(row =>
        headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'institutions_template.xlsx');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export default new InstitutionService();