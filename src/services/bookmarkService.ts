import api from "../api/axiosInstance";
import { API_ENDPOINTS } from "../api/endpoints";
import type {
  CreateBookmarkData,
  UpdateBookmarkData,
  BookmarkResponse,
} from "../types/bookmark.types";
import { AxiosError } from "axios";

class BookmarkService {
  /**
   * Get all bookmarks for the current user
   */
  async getMyBookmarks(): Promise<BookmarkResponse> {
    try {
      const response = await api.get(API_ENDPOINTS.BOOKMARKS.LIST);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch bookmarks"
        );
      }
      throw error;
    }
  }

  /**
   * Get all bookmarks (Admin only)
   */
  async getAll(): Promise<BookmarkResponse> {
    try {
      const response = await api.get(API_ENDPOINTS.BOOKMARKS.GET_ALL);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch all bookmarks"
        );
      }
      throw error;
    }
  }

  /**
   * Get bookmark by ID
   */
  async getById(id: string): Promise<BookmarkResponse> {
    try {
      const response = await api.get(API_ENDPOINTS.BOOKMARKS.GET(id));
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch bookmark"
        );
      }
      throw error;
    }
  }

  /**
   * Create a new bookmark
   */
  async create(data: CreateBookmarkData): Promise<BookmarkResponse> {
    try {
      const response = await api.post(API_ENDPOINTS.BOOKMARKS.CREATE, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || "Failed to create bookmark"
        );
      }
      throw error;
    }
  }

  /**
   * Update an existing bookmark
   */
  async update(
    id: string,
    data: UpdateBookmarkData
  ): Promise<BookmarkResponse> {
    try {
      const response = await api.put(API_ENDPOINTS.BOOKMARKS.UPDATE(id), data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || "Failed to update bookmark"
        );
      }
      throw error;
    }
  }

  /**
   * Delete a bookmark
   */
  async delete(id: string): Promise<BookmarkResponse> {
    try {
      const response = await api.delete(API_ENDPOINTS.BOOKMARKS.DELETE(id));
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || "Failed to delete bookmark"
        );
      }
      throw error;
    }
  }
}

export default new BookmarkService();
