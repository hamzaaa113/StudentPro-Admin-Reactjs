export interface AccommodationItem {
  name: string;
  commission: string | number;
  _id?: string;
}

export interface Accommodation {
  _id: string;
  locations: string[];
  company: string;
  country: string;
  items: AccommodationItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAccommodationData {
  locations: string[];
  company: string;
  country: string;
  items: AccommodationItem[];
}

export interface UpdateAccommodationData {
  locations?: string[];
  company?: string;
  country?: string;
  items?: AccommodationItem[];
}
