export interface Course {
  course: string;
  commission: string;
}

export interface Institution {
  _id: string;
  name: string;
  country: string;
  state: string[];
  sector: "University" | "College" | "Private School" | "Government School" | "English School" | "Institute";
  territory: string[];
  tat?: string;
  scholarship?: string;
  promotion?: string;
  group?: string;
  url?: string;
  parent?: string;
  global: boolean;
  course: Course[];
  applicationMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionFilters {
  country?: string;
  state?: string;
  sector?: string;
  global?: boolean;
  scholarship?: string;
  group?: string;
  promotion?: string;
  hundredPercentPromotion?: string;
  territory?: string | string[];
  name?: string;
  page?: number;
  pageSize?: number;
}

export interface InstitutionsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: Institution[];
}

export interface SingleInstitutionResponse {
  success: boolean;
  data: Institution;
}

export interface CreateInstitutionData {
  name: string;
  country: string;
  state: string[];
  sector: Institution["sector"];
  territory?: string[];
  tat?: string;
  scholarship?: string;
  promotion?: string;
  group?: string;
  url?: string;
  parent?: string;
  global?: boolean;
  course?: Course[];
  applicationMethod?: string;
}

export type UpdateInstitutionData = Partial<CreateInstitutionData>;

export interface AddCourseData {
  course: string;
  commission: string;
}

export interface XLSXImportResponse {
  success: boolean;
  message: string;
  summary: {
    totalRows: number;
    created: number;
    updated: number;
    skipped: number;
    errors: number;
  };
  data: Institution[];
  errors?: Array<{
    row: number;
    error: string;
    data: Record<string, unknown>;
  }>;
}

export interface XLSXImportOptions {
  skipDuplicates?: boolean;
  updateExisting?: boolean;
}

export interface XLSXExportFilters {
  country?: string;
  state?: string;
  sector?: string;
  global?: boolean;
  scholarship?: string;
  group?: string;
  promotion?: string;
  territory?: string | string[];
  name?: string;
}