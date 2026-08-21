import { useState } from "react";
import { Mail, Phone, MapPin, User, Plus, Edit2, Trash2, EyeOff } from "lucide-react";
import { useContact } from "../hooks/useContact";
import { useAuth } from "../contexts/AuthContext";
import type { TeamMember, Office } from "../types/contact.types";
import TeamMemberModal from "../components/TeamMemberModal";
import OfficeModal from "../components/OfficeModal";
import { Button } from "../components/ui/Button";

const ContactUs = () => {
  const { canDelete: isSuperAdmin } = useAuth();
  const {
    teamMembers,
    offices,
    loading,
    error,
    saveTeamMember,
    deleteTeamMember,
    uploadPhoto,
    saveOffice,
    deleteOffice,
  } = useContact();

  const [memberModal, setMemberModal] = useState<{
    open: boolean;
    member?: TeamMember;
  }>({ open: false });
  const [officeModal, setOfficeModal] = useState<{
    open: boolean;
    office?: Office;
  }>({ open: false });

  const handleDeleteMember = async (member: TeamMember) => {
    if (!confirm(`Remove ${member.name} from the Contact Us page?`)) return;
    await deleteTeamMember(member._id);
  };

  const handleDeleteOffice = async (office: Office) => {
    if (!confirm(`Remove the ${office.name} office?`)) return;
    await deleteOffice(office._id);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <p className="text-gray-500">Loading contact details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8 md:p-6 lg:p-8">
      {/* Contact Us Section */}
      <section>
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Get in Touch</h1>
            <p className="mt-1 text-gray-600">
              We’re here to guide you every step of the way
            </p>
          </div>
          {isSuperAdmin && (
            <Button
              onClick={() => setMemberModal({ open: true })}
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              Add Team Member
            </Button>
          )}
        </div>

        {teamMembers.length === 0 ? (
          <p className="text-gray-500">
            No team members yet.
            {isSuperAdmin && " Use “Add Team Member” to create one."}
          </p>
        ) : (
          <div className="grid max-w-4xl gap-6 mx-auto md:grid-cols-2">
            {teamMembers.map((member) => (
              <div
                key={member._id}
                className={`relative overflow-hidden transition-shadow bg-white border rounded-lg shadow-md hover:shadow-xl ${
                  member.isActive ? "border-gray-200" : "border-dashed border-gray-300 opacity-60"
                }`}
              >
                {/* Admin controls */}
                {isSuperAdmin && (
                  <div className="absolute z-10 flex gap-1 top-2 right-2">
                    <button
                      onClick={() => setMemberModal({ open: true, member })}
                      className="p-1.5 text-blue-600 bg-white/90 rounded shadow-sm transition-colors hover:bg-white"
                      aria-label={`Edit ${member.name}`}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member)}
                      className="p-1.5 text-red-600 bg-white/90 rounded shadow-sm transition-colors hover:bg-white"
                      aria-label={`Delete ${member.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}

                {!member.isActive && (
                  <div className="absolute z-10 flex items-center gap-1 px-2 py-1 text-xs text-gray-600 rounded top-2 left-2 bg-white/90">
                    <EyeOff size={12} /> Hidden
                  </div>
                )}

                {/* Profile Image */}
                <div className="relative flex items-center justify-center h-40 bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
                  <div className="p-1 rounded-full bg-gradient-to-br from-blue-500 via-teal-500 to-green-500">
                    <div className="flex items-center justify-center w-32 h-32 overflow-hidden bg-white rounded-full">
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          loading="lazy"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <User className="text-gray-300" size={56} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[#0A1F38]">
                      {member.name}
                    </h3>
                    <p className="text-gray-600">{member.designation}</p>
                  </div>

                  {member.enquiryType && (
                    <div className="p-3 border-l-4 border-teal-600 rounded bg-teal-50">
                      <p className="font-semibold text-teal-800">
                        For {member.enquiryType} contact{" "}
                        {member.name.split(" ")[0]}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {member.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="flex-shrink-0 mt-1 text-teal-600" size={18} />
                        <a
                          href={`tel:${member.phone}`}
                          className="text-gray-700 hover:text-teal-600 hover:underline"
                        >
                          {member.phone}
                        </a>
                      </div>
                    )}

                    {member.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="flex-shrink-0 mt-1 text-teal-600" size={18} />
                        <a
                          href={`mailto:${member.email}`}
                          className="text-gray-700 break-all hover:text-teal-600 hover:underline"
                        >
                          {member.email}
                        </a>
                      </div>
                    )}

                    {member.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="flex-shrink-0 mt-1 text-teal-600" size={18} />
                        <p className="text-gray-700">{member.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Our Offices Section */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <h2 className="text-3xl font-bold text-[#0A1F38]">OUR OFFICES</h2>
          {isSuperAdmin && (
            <Button
              onClick={() => setOfficeModal({ open: true })}
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              Add Office
            </Button>
          )}
        </div>

        {offices.length === 0 ? (
          <p className="text-gray-500">
            No offices yet.
            {isSuperAdmin && " Use “Add Office” to create one."}
          </p>
        ) : (
          <div className="grid max-w-6xl gap-6 mx-auto md:grid-cols-2 lg:grid-cols-3">
            {offices.map((office) => (
              <div
                key={office._id}
                className={`relative overflow-hidden transition-shadow bg-white border rounded-lg shadow-md hover:shadow-xl ${
                  office.isActive ? "border-gray-200" : "border-dashed border-gray-300 opacity-60"
                }`}
              >
                {isSuperAdmin && (
                  <div className="absolute z-10 flex gap-1 top-2 right-2">
                    <button
                      onClick={() => setOfficeModal({ open: true, office })}
                      className="p-1.5 text-blue-600 bg-white/90 rounded shadow-sm transition-colors hover:bg-white"
                      aria-label={`Edit ${office.name}`}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteOffice(office)}
                      className="p-1.5 text-red-600 bg-white/90 rounded shadow-sm transition-colors hover:bg-white"
                      aria-label={`Delete ${office.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}

                {!office.isActive && (
                  <div className="absolute z-10 flex items-center gap-1 px-2 py-1 text-xs text-gray-600 rounded top-2 left-2 bg-white/90">
                    <EyeOff size={12} /> Hidden
                  </div>
                )}

                {office.mapUrl && (
                  <div className="h-64">
                    <iframe
                      src={office.mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map of ${office.name}`}
                    ></iframe>
                  </div>
                )}

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-[#0A1F38]">
                    {office.name}
                  </h3>

                  <div className="flex items-start gap-3">
                    <MapPin className="flex-shrink-0 mt-1 text-teal-600" size={18} />
                    <p className="text-sm text-gray-700">{office.address}</p>
                  </div>

                  {office.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="flex-shrink-0 mt-1 text-teal-600" size={18} />
                      <a
                        href={`tel:${office.phone}`}
                        className="text-sm text-gray-700 hover:text-teal-600 hover:underline"
                      >
                        {office.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      {memberModal.open && (
        <TeamMemberModal
          key={memberModal.member?._id ?? "new"}
          onClose={() => setMemberModal({ open: false })}
          onSubmit={(data) =>
            saveTeamMember(memberModal.member?._id ?? null, data)
          }
          onUploadPhoto={uploadPhoto}
          member={memberModal.member}
          mode={memberModal.member ? "edit" : "create"}
        />
      )}

      {officeModal.open && (
        <OfficeModal
          key={officeModal.office?._id ?? "new"}
          onClose={() => setOfficeModal({ open: false })}
          onSubmit={(data) => saveOffice(officeModal.office?._id ?? null, data)}
          office={officeModal.office}
          mode={officeModal.office ? "edit" : "create"}
        />
      )}
    </div>
  );
};

export default ContactUs;
