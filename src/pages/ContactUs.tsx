import { Mail, Phone, MapPin } from "lucide-react";

const ContactUs = () => {
  const teamMembers = [
        {
      name: "Danish Bhatti",
      designation: "Sr. Admission Officer",
      phone: "+92 309 8849988",
      email: "partners@studentpro.com.pk",
      address: "38-A Block, Park lane, Shauq Chowk M.A Road Johar Town, Lahore",
      enquiryType: "B2B enquires",
      imagePlaceholder: "/placeholder-team-1.jpg",
    },
    {
      name: "Shafaqat Ali",
      designation: "Accounts & Admission Manager",
      phone: "+92 307 8849988",
      email: "marketing@studentpro.com.au",
      address: "38-A Block, Park lane, Shauq Chowk M.A Road, Johar Town, Lahore",
      enquiryType: "Commission enquires",
      imagePlaceholder: "/placeholder-team-2.jpg",
    },
  ];

  const offices = [
    {
      name: "SYDNEY",
      address: "Student Pro Education Consultancy, 116/15A Mary Street, Auburn, Sydney, NSW, 2144, Australia",
      phone: "+61 493 167017",
      mapUrl: "https://maps.google.com/maps?q=-33.85149816519999,151.03102330001053&hl=en&z=16&output=embed",
    },
    {
      name: "LAHORE",
      address: "38 A block, Park lane, Shouq Chowk M.A Road, Johar Town, Lahore, Pakistan",
      phone: "+92 306 8849988",
      mapUrl: "https://maps.google.com/maps?q=31.470360987246295,74.30192779544038&hl=en&z=16&output=embed",
    },
    {
      name: "FAISALABAD",
      address: "Amir Plaza, first floor, main collage road, Kohinoor City, Faisalabad, Pakistan",
      phone: "+92 310 0002808",
      mapUrl: "https://maps.google.com/maps?q=31.414281121892316,73.1143672000015&hl=en&z=16&output=embed",
    },
  ];

  return (
    <div className="p-4 space-y-8 md:p-6 lg:p-8">
      {/* Contact Us Section */}
      <section>
        <h1 className="text-3xl font-bold text-gray-800">Get in Touch</h1>
          <p className="mt-1 mb-6 text-gray-600">
            We’re here to guide you every step of the way
          </p>
        <div className="grid max-w-4xl gap-6 mx-auto md:grid-cols-2">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="overflow-hidden transition-shadow bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl"
            >
              {/* Profile Image */}
              <div className="relative flex items-center justify-center h-40 bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
                <div className="p-1 rounded-full bg-gradient-to-br from-blue-500 via-teal-500 to-green-500">
                  <div className="w-32 h-32 overflow-hidden bg-white rounded-full">
                    <img
                      src={index === 0 ? '/DanishBhatti.png' : '/ShafaqatAli.png'}
                      alt={member.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#0A1F38]">{member.name}</h3>
                  <p className="text-gray-600">{member.designation}</p>
                </div>

                {/* Highlighted Enquiry Type */}
                <div className="p-3 border-l-4 border-teal-600 rounded bg-teal-50">
                  <p className="font-semibold text-teal-800">
                    For {member.enquiryType} contact {member.name.split(' ')[0]}
                  </p>
                </div>

                {/* Contact Details */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Phone className="flex-shrink-0 mt-1 text-teal-600" size={18} />
                    <a
                      href={`tel:${member.phone}`}
                      className="text-gray-700 hover:text-teal-600 hover:underline"
                    >
                      {member.phone}
                    </a>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="flex-shrink-0 mt-1 text-teal-600" size={18} />
                    <a
                      href={`mailto:${member.email}`}
                      className="text-gray-700 break-all hover:text-teal-600 hover:underline"
                    >
                      {member.email}
                    </a>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="flex-shrink-0 mt-1 text-teal-600" size={18} />
                    <p className="text-gray-700">{member.address}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Offices Section */}
      <section>
        <h2 className="text-3xl font-bold text-[#0A1F38] mb-8">OUR OFFICES</h2>
        
        <div className="grid max-w-6xl gap-6 mx-auto md:grid-cols-2 lg:grid-cols-3">
          {offices.map((office, index) => (
            <div
              key={index}
              className="overflow-hidden transition-shadow bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl"
            >
              {/* Interactive Map */}
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

              {/* Location Details */}
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-bold text-[#0A1F38]">{office.name}</h3>
                
                <div className="flex items-start gap-3">
                  <MapPin className="flex-shrink-0 mt-1 text-teal-600" size={18} />
                  <p className="text-sm text-gray-700">{office.address}</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="flex-shrink-0 mt-1 text-teal-600" size={18} />
                  <a
                    href={`tel:${office.phone}`}
                    className="text-sm text-gray-700 hover:text-teal-600 hover:underline"
                  >
                    {office.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
