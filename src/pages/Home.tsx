import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="rounded-lg bg-white p-8 shadow">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Student Pro CRM</h1>

        {user && (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">Your Profile</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">
                    {user.first_name} {user.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-medium text-gray-900">{user.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Country</p>
                  <p className="font-medium text-gray-900">{user.country}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Region</p>
                  <p className="font-medium text-gray-900">{user.region}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : user.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email Verified</p>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      user.email_verified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.email_verified ? "Verified" : "Not Verified"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
              <h3 className="text-lg font-semibold text-blue-900">Getting Started</h3>
              <p className="mt-2 text-blue-800">
                Welcome to Student Pro CRM! You can now access all features based on your role.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
