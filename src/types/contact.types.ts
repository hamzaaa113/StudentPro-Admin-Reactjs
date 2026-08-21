export interface TeamMember {
  _id: string;
  name: string;
  designation: string;
  phone: string;
  email: string;
  address: string;
  enquiryType: string;
  photoUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Office {
  _id: string;
  name: string;
  address: string;
  phone: string;
  mapUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TeamMemberFormData = Omit<
  TeamMember,
  "_id" | "createdAt" | "updatedAt"
>;

export type OfficeFormData = Omit<Office, "_id" | "createdAt" | "updatedAt">;
