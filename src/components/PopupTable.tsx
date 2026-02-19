import type { Popup } from "../types/popup.types";
import { Pencil, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "./ui/Button";
import { useAuth } from "../contexts/AuthContext";

interface PopupTableProps {
  popups: Popup[];
  onEdit: (popup: Popup) => void;
  onDelete: (id: string) => void;
  onView: (popup: Popup) => void;
  onToggleStatus: (id: string) => void;
}

const PopupTable = ({ popups, onEdit, onDelete, onView, onToggleStatus }: PopupTableProps) => {
  const { canDelete } = useAuth();
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-4 font-semibold text-left text-gray-700">Headline</th>
            <th className="p-4 font-semibold text-left text-gray-700">Offers</th>
            <th className="p-4 font-semibold text-left text-gray-700">Priority</th>
            <th className="p-4 font-semibold text-left text-gray-700">Status</th>
            <th className="p-4 font-semibold text-left text-gray-700">Date Range</th>
            <th className="p-4 font-semibold text-left text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {popups.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-500">
                No popups found. Create your first popup to get started.
              </td>
            </tr>
          ) : (
            popups.map((popup) => (
              <tr key={popup._id} className="transition-colors border-b hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium text-gray-800">{popup.headline}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-600">
                    {popup.offers.length > 0 ? (
                      <span>{popup.offers.length} offer(s)</span>
                    ) : (
                      <span className="text-gray-400">No offers</span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {popup.priority}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onToggleStatus(popup._id)}
                    className="flex items-center gap-1"
                  >
                    {popup.isActive ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-green-600" />
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-gray-400" />
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      </>
                    )}
                  </button>
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-600">
                    <div>{formatDate(popup.startDate)}</div>
                    {popup.endDate && (
                      <div className="text-xs text-gray-400">to {formatDate(popup.endDate)}</div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(popup)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(popup)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(popup._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PopupTable;
