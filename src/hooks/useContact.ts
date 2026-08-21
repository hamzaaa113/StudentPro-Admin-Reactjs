import { useState, useEffect, useCallback } from "react";
import contactService from "../services/contactService";
import type {
  TeamMember,
  Office,
  TeamMemberFormData,
  OfficeFormData,
} from "../types/contact.types";
import toast from "react-hot-toast";

export const useContact = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContact = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [members, officeList] = await Promise.all([
        contactService.getTeamMembers(),
        contactService.getOffices(),
      ]);
      setTeamMembers(members);
      setOffices(officeList);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load contact details";
      setError(errorMessage);
      console.error("Error fetching contact details:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  // --- Team members ---

  const saveTeamMember = useCallback(
    async (
      id: string | null,
      data: Partial<TeamMemberFormData>
    ): Promise<boolean> => {
      try {
        if (id) {
          const updated = await contactService.updateTeamMember(id, data);
          setTeamMembers((prev) =>
            prev.map((m) => (m._id === id ? updated : m))
          );
          toast.success("Team member updated");
        } else {
          const created = await contactService.createTeamMember(data);
          setTeamMembers((prev) =>
            [...prev, created].sort((a, b) => a.order - b.order)
          );
          toast.success("Team member added");
        }
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save");
        return false;
      }
    },
    []
  );

  const deleteTeamMember = useCallback(async (id: string): Promise<boolean> => {
    try {
      await contactService.deleteTeamMember(id);
      setTeamMembers((prev) => prev.filter((m) => m._id !== id));
      toast.success("Team member removed");
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
      return false;
    }
  }, []);

  const uploadPhoto = useCallback(async (file: File): Promise<string | null> => {
    try {
      return await contactService.uploadPhoto(file);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload photo");
      return null;
    }
  }, []);

  // --- Offices ---

  const saveOffice = useCallback(
    async (id: string | null, data: Partial<OfficeFormData>): Promise<boolean> => {
      try {
        if (id) {
          const updated = await contactService.updateOffice(id, data);
          setOffices((prev) => prev.map((o) => (o._id === id ? updated : o)));
          toast.success("Office updated");
        } else {
          const created = await contactService.createOffice(data);
          setOffices((prev) =>
            [...prev, created].sort((a, b) => a.order - b.order)
          );
          toast.success("Office added");
        }
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to save");
        return false;
      }
    },
    []
  );

  const deleteOffice = useCallback(async (id: string): Promise<boolean> => {
    try {
      await contactService.deleteOffice(id);
      setOffices((prev) => prev.filter((o) => o._id !== id));
      toast.success("Office removed");
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
      return false;
    }
  }, []);

  return {
    teamMembers,
    offices,
    loading,
    error,
    refetch: fetchContact,
    saveTeamMember,
    deleteTeamMember,
    uploadPhoto,
    saveOffice,
    deleteOffice,
  };
};
