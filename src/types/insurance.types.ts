// Health Insurance Types
export interface HealthInsuranceItem {
    name: string;
    commission: string;
}

export interface HealthInsurance {
    _id: string;
    company: string;
    country: string;
    items: HealthInsuranceItem[];
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateHealthInsuranceData {
    company: string;
    country: string;
    items: HealthInsuranceItem[];
}

export interface UpdateHealthInsuranceData {
    company?: string;
    country?: string;
    items?: HealthInsuranceItem[];
}

export interface HealthInsuranceFilters {
    country?: string;
}
