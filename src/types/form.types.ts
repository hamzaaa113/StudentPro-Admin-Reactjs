export interface Form {
  _id: string;
  title: string;
  content: string;
  isUrl: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFormData {
  title: string;
  content: string;
}

export interface UpdateFormData {
  title?: string;
  content?: string;
}
