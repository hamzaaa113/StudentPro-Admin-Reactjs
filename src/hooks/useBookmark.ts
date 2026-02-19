import { useState, useCallback } from "react";
import bookmarkService from "../services/bookmarkService";
import type {
  Bookmark,
  CreateBookmarkData,
  UpdateBookmarkData,
} from "../types/bookmark.types";
import toast from "react-hot-toast";

export const useBookmark = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's bookmarks
  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookmarkService.getMyBookmarks();
      if (response.success && Array.isArray(response.data)) {
        setBookmarks(response.data);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch bookmarks";
      setError(errorMessage);
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new bookmark
  const createBookmark = async (data: CreateBookmarkData): Promise<boolean> => {
    try {
      const response = await bookmarkService.create(data);
      if (response.success) {
        toast.success("Bookmark added successfully");
        await fetchBookmarks();
        return true;
      }
      return false;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create bookmark";
      console.error("Error creating bookmark:", error);
      toast.error(errorMessage);
      return false;
    }
  };

  // Update bookmark
  const updateBookmark = async (
    id: string,
    data: UpdateBookmarkData
  ): Promise<boolean> => {
    try {
      const response = await bookmarkService.update(id, data);
      if (response.success) {
        toast.success("Bookmark updated successfully");
        await fetchBookmarks();
        return true;
      }
      return false;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update bookmark";
      console.error("Error updating bookmark:", error);
      toast.error(errorMessage);
      return false;
    }
  };

  // Delete bookmark
  const deleteBookmark = async (id: string): Promise<boolean> => {
    try {
      const response = await bookmarkService.delete(id);
      if (response.success) {
        toast.success("Bookmark deleted successfully");
        await fetchBookmarks();
        return true;
      }
      return false;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete bookmark";
      console.error("Error deleting bookmark:", error);
      toast.error(errorMessage);
      return false;
    }
  };

  // Get bookmark by ID
  const getBookmarkById = async (id: string): Promise<Bookmark | null> => {
    try {
      const response = await bookmarkService.getById(id);
      if (response.success && response.data && !Array.isArray(response.data)) {
        return response.data;
      }
      return null;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch bookmark";
      console.error("Error fetching bookmark:", error);
      toast.error(errorMessage);
      return null;
    }
  };

  return {
    bookmarks,
    loading,
    error,
    fetchBookmarks,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    getBookmarkById,
  };
};
