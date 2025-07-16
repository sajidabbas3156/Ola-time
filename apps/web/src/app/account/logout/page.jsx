import useAuth from "@/utils/useAuth";

function MainComponent() {
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">OLA</h1>
          <p className="text-gray-600">Time Clock Attendance</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Sign Out</h2>
          
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to sign out?
          </p>

          <button
            onClick={handleSignOut}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;