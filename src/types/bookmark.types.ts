// Bookmark Types
export interface Bookmark {
  _id: string;
  user_id: string;
  bookmarked: string;
  isUrl: boolean;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookmarkData {
  bookmarked: string;
  title?: string;
}

export interface UpdateBookmarkData {
  bookmarked?: string;
  title?: string;
}

export interface BookmarkResponse {
  success: boolean;
  message?: string;
  data?: Bookmark | Bookmark[];
  total?: number;
}
