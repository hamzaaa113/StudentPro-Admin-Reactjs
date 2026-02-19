const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-xl text-gray-600">Page Not Found</p>
      <a href="/" className="mt-6 text-blue-600 hover:underline">
        Go back home
      </a>
    </div>
  );
};

export default NotFound;
