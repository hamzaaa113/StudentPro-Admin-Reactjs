export interface Popup {
  _id: string;
  headline: string;
  offers: string[];
  photoUrl?: string;
  isActive: boolean;
  priority: number;
  startDate: string;
  endDate?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreatePopupData {
  headline: string;
  offers: string[];
  photoUrl?: string;
  isActive?: boolean;
  priority?: number;
  startDate?: string;
  endDate?: string;
}

export interface UpdatePopupData {
  headline?: string;
  offers?: string[];
  photoUrl?: string;
  isActive?: boolean;
  priority?: number;
  startDate?: string;
  endDate?: string;
}
