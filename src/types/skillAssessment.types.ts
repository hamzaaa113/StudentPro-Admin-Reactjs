export interface SkillAssessment {
  _id: string;
  occupationGroups: string;
  pathwaysStreams: string;
  standardFeeAUD?: string;
  priorityFeeAUD?: string;
  standardProcessingTime?: string;
  assessingBodyName?: string;
  assessingBodyLink?: string;
  priorityAvailable?: string;
  documentsChecklist?: string;
  officialLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SkillAssessmentFilters {
  occupationGroups?: string;
  pathwaysStreams?: string;
  page?: number;
  pageSize?: number;
}

export interface SkillAssessmentsResponse {
  success: boolean;
  count: number;
  data: SkillAssessment[];
}

export interface SingleSkillAssessmentResponse {
  success: boolean;
  data: SkillAssessment;
}

export interface CreateSkillAssessmentData {
  occupationGroups: string;
  pathwaysStreams: string;
  standardFeeAUD?: string;
  priorityFeeAUD?: string;
  standardProcessingTime?: string;
  assessingBodyName?: string;
  assessingBodyLink?: string;
  priorityAvailable?: string;
  documentsChecklist?: string;
  officialLink?: string;
}

export type UpdateSkillAssessmentData = Partial<CreateSkillAssessmentData>;

export interface OccupationGroupsResponse {
  success: boolean;
  data: string[];
}

export interface PathwaysStreamsResponse {
  success: boolean;
  data: string[];
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
  data: SkillAssessment[];
  errors?: Array<{
    row: number;
    error: string;
    data: Record<string, unknown>;
  }>;
}

export interface XLSXExportFilters {
  occupationGroups?: string;
  pathwaysStreams?: string;
}
