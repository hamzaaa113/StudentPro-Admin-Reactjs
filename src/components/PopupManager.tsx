import { useState, useEffect } from "react";
import { popupService } from "../services/popupService";
import type { Popup } from "../types/popup.types";
import PromotionalPopup from "./PromotionalPopup";

const POPUP_STORAGE_KEY = "studentpro_admin_closed_popups";
// const POPUP_CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

const PopupManager = () => {
  const [activePopups, setActivePopups] = useState<Popup[]>([]);
  const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const fetchAndShowPopups = async () => {
    try {
      const { popups } = await popupService.getActivePopups();
      
      if (popups.length === 0) {
        return;
      }

      // Temporarily disable localStorage check - show popups every time for testing
      // TODO: Re-enable after testing by uncommenting the code below
      /*
      // Get closed popups from localStorage
      const closedPopupsStr = localStorage.getItem(POPUP_STORAGE_KEY);
      const closedPopups: Record<string, number> = closedPopupsStr
        ? JSON.parse(closedPopupsStr)
        : {};

      // Filter out popups that were recently closed
      const now = Date.now();
      const popupsToShow = popups.filter((popup) => {
        const closedTime = closedPopups[popup._id];
        if (!closedTime) return true;
        
        // Show again if more than 24 hours have passed
        return now - closedTime > POPUP_CHECK_INTERVAL;
      });
      */

      const popupsToShow = popups; // Show all popups for testing

      if (popupsToShow.length > 0) {
        setActivePopups(popupsToShow);
        setCurrentPopupIndex(0);
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error fetching popups:", error);
    }
  };

  useEffect(() => {
    void (async () => {
      await fetchAndShowPopups();
    })();
  }, []);

  const handleClosePopup = () => {
    const currentPopup = activePopups[currentPopupIndex];
    
    // Save closed popup to localStorage
    const closedPopupsStr = localStorage.getItem(POPUP_STORAGE_KEY);
    const closedPopups: Record<string, number> = closedPopupsStr
      ? JSON.parse(closedPopupsStr)
      : {};
    
    closedPopups[currentPopup._id] = Date.now();
    localStorage.setItem(POPUP_STORAGE_KEY, JSON.stringify(closedPopups));

    // Show next popup if available
    if (currentPopupIndex < activePopups.length - 1) {
      setCurrentPopupIndex(currentPopupIndex + 1);
    } else {
      setShowPopup(false);
    }
  };

  if (!showPopup || activePopups.length === 0) {
    return null;
  }

  const currentPopup = activePopups[currentPopupIndex];

  return <PromotionalPopup popup={currentPopup} onClose={handleClosePopup} />;
};

export default PopupManager;
