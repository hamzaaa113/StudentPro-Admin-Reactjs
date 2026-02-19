import { useState, useEffect, useRef } from "react";
import { Bookmark, Plus, Edit2, Trash2, ExternalLink, X } from "lucide-react";
import { useBookmark } from "../hooks/useBookmark";
import type { Bookmark as BookmarkType } from "../types/bookmark.types";

const BookmarkDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newBookmark, setNewBookmark] = useState({ bookmarked: "", title: "" });
  const [editBookmark, setEditBookmark] = useState({ bookmarked: "", title: "" });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    bookmarks,
    loading,
    fetchBookmarks,
    createBookmark,
    updateBookmark,
    deleteBookmark,
  } = useBookmark();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAdding(false);
        setEditingId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchBookmarks();
    }
  }, [isOpen, fetchBookmarks]);

  const handleAddBookmark = async () => {
    if (!newBookmark.bookmarked.trim()) return;

    const success = await createBookmark(newBookmark);
    if (success) {
      setNewBookmark({ bookmarked: "", title: "" });
      setIsAdding(false);
    }
  };

  const handleUpdateBookmark = async (id: string) => {
    if (!editBookmark.bookmarked.trim()) return;

    const success = await updateBookmark(id, editBookmark);
    if (success) {
      setEditingId(null);
      setEditBookmark({ bookmarked: "", title: "" });
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bookmark?")) return;

    await deleteBookmark(id);
  };

  const startEdit = (bookmark: BookmarkType) => {
    setEditingId(bookmark._id);
    setEditBookmark({
      bookmarked: bookmark.bookmarked,
      title: bookmark.title,
    });
  };

  const renderBookmarkContent = (bookmark: BookmarkType) => {
    if (bookmark.isUrl) {
      return (
        <a
          href={bookmark.bookmarked}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center flex-1 min-w-0 gap-1 text-blue-600 hover:text-blue-700 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="truncate">
            {bookmark.title || bookmark.bookmarked}
          </span>
          <ExternalLink size={14} className="flex-shrink-0" />
        </a>
      );
    }
    return (
      <span className="flex-1 min-w-0 text-gray-700 truncate">
        {bookmark.title || bookmark.bookmarked}
      </span>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-[#313647] hover:bg-[#ABDBC0] transition-colors relative"
        aria-label="Bookmarks"
      >
        <Bookmark size={20} fill={isOpen ? "#313647" : "none"} />
        {bookmarks.length > 0 && (
          <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 flex flex-col mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg w-80 max-h-96">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
            <h3 className="flex items-center gap-2 font-semibold text-gray-800">
              <Bookmark size={18} />
              My Bookmarks
            </h3>
            <button
              onClick={() => {
                setIsAdding(!isAdding);
                setEditingId(null);
              }}
              className="p-1 transition-colors rounded hover:bg-gray-200"
              aria-label="Add bookmark"
            >
              {isAdding ? <X size={18} /> : <Plus size={18} />}
            </button>
          </div>

          {/* Add New Bookmark Form */}
          {isAdding && (
            <div className="p-3 border-b border-gray-200 bg-blue-50">
              <input
                type="text"
                placeholder="Title (optional)"
                value={newBookmark.title}
                onChange={(e) =>
                  setNewBookmark({ ...newBookmark, title: e.target.value })
                }
                className="w-full px-3 py-1.5 border border-gray-300 rounded mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="text"
                placeholder="Enter link or text"
                value={newBookmark.bookmarked}
                onChange={(e) =>
                  setNewBookmark({ ...newBookmark, bookmarked: e.target.value })
                }
                className="w-full px-3 py-1.5 border border-gray-300 rounded mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddBookmark}
                  className="flex-1 px-3 py-1.5 bg-[#0A1F38] text-white rounded text-sm hover:bg-[#10192c] transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewBookmark({ bookmarked: "", title: "" });
                  }}
                  className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Bookmarks List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : bookmarks.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No bookmarks yet. Click + to add one!
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark._id}
                    className="p-3 transition-colors hover:bg-gray-50"
                  >
                    {editingId === bookmark._id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Title (optional)"
                          value={editBookmark.title}
                          onChange={(e) =>
                            setEditBookmark({ ...editBookmark, title: e.target.value })
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <input
                          type="text"
                          placeholder="Enter link or text"
                          value={editBookmark.bookmarked}
                          onChange={(e) =>
                            setEditBookmark({
                              ...editBookmark,
                              bookmarked: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateBookmark(bookmark._id)}
                            className="flex-1 px-2 py-1 text-sm text-white transition-colors bg-teal-600 rounded hover:bg-teal-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditBookmark({ bookmarked: "", title: "" });
                            }}
                            className="px-2 py-1 text-sm text-gray-700 transition-colors bg-gray-300 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          {renderBookmarkContent(bookmark)}
                          {bookmark.title && !bookmark.isUrl && (
                            <p className="mt-1 text-xs text-gray-500 truncate">
                              {bookmark.bookmarked}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-shrink-0 gap-1">
                          <button
                            onClick={() => startEdit(bookmark)}
                            className="p-1 text-blue-600 transition-colors rounded hover:bg-gray-200"
                            aria-label="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteBookmark(bookmark._id)}
                            className="p-1 text-red-600 transition-colors rounded hover:bg-gray-200"
                            aria-label="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarkDropdown;
