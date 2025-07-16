import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import { Clock, LogOut, Calendar, Timer, Settings } from "lucide-react";

function MainComponent() {
  const { data: user, loading: userLoading } = useUser();
  const [timeEntries, setTimeEntries] = useState([]);
  const [activeEntry, setActiveEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch time entries
  const fetchTimeEntries = async () => {
    try {
      const response = await fetch("/api/time-entries");
      if (!response.ok) {
        throw new Error("Failed to fetch time entries");
      }
      const data = await response.json();
      setTimeEntries(data.entries);

      // Find active entry (no clock out time)
      const active = data.entries.find((entry) => !entry.clock_out_time);
      setActiveEntry(active);
    } catch (err) {
      console.error(err);
      setError("Failed to load time entries");
    }
  };

  useEffect(() => {
    if (user) {
      fetchTimeEntries();
    }
  }, [user]);

  const handleClockIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/time-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: "" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to clock in");
      }

      await fetchTimeEntries();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/time-entries/clock-out", {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to clock out");
      }

      await fetchTimeEntries();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getElapsedTime = () => {
    if (!activeEntry) return "00:00:00";

    const start = new Date(activeEntry.clock_in_time);
    const now = currentTime;
    const diff = now - start;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Redirect to landing page for non-authenticated users
    if (typeof window !== "undefined") {
      window.location.href = "/landing";
      return null;
    }

    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">OLA</h1>
            <p className="text-gray-600">Time Clock Attendance</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <p className="text-gray-600 mb-6">
              Please sign in to access your time clock
            </p>
            <a
              href="/account/signin"
              className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">OLA</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  OLA
                </h1>
                <p className="text-sm text-gray-600">Time Clock Attendance</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
              <a
                href="/admin"
                className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <Settings className="w-4 h-4 mr-1" />
                <span className="text-sm">Admin</span>
              </a>
              <a
                href="/timesheet"
                className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <Calendar className="w-4 h-4 mr-1" />
                <span className="text-sm">Timesheet</span>
              </a>
              <div className="hidden sm:block text-sm text-gray-600">
                Welcome, {user.name || user.email}
              </div>
              <a
                href="/account/logout"
                className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4 mr-1" />
                <span className="text-sm">Sign Out</span>
              </a>
            </div>
          </div>
          <div className="sm:hidden mt-2 text-xs text-gray-600">
            Welcome, {user.name || user.email}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Current Time Display */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-mono font-bold text-gray-900 mb-2">
              {formatTime(currentTime)}
            </div>
            <div className="text-gray-600 text-sm sm:text-base">
              {formatDate(currentTime)}
            </div>
          </div>
        </div>

        {/* Clock In/Out Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center">
            {activeEntry ? (
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-3">
                    <Timer className="w-4 h-4 mr-2" />
                    Currently Clocked In
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Started at {formatTime(activeEntry.clock_in_time)}
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-gray-900">
                    {getElapsedTime()}
                  </div>
                </div>
                <button
                  onClick={handleClockOut}
                  disabled={loading}
                  className="w-full sm:w-auto bg-red-600 text-white py-4 px-8 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
                >
                  {loading ? "Clocking Out..." : "Clock Out"}
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    Ready to start your shift?
                  </p>
                </div>
                <button
                  onClick={handleClockIn}
                  disabled={loading}
                  className="w-full sm:w-auto bg-green-600 text-white py-4 px-8 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
                >
                  {loading ? "Clocking In..." : "Clock In"}
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* Recent Time Entries */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Recent Time Entries
            </h2>
          </div>
          <div className="divide-y">
            {timeEntries.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No time entries yet. Clock in to get started!
              </div>
            ) : (
              timeEntries.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                >
                  <div>
                    <div className="font-medium text-gray-900 text-sm sm:text-base">
                      {formatDate(entry.clock_in_time)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatTime(entry.clock_in_time)} -{" "}
                      {entry.clock_out_time
                        ? formatTime(entry.clock_out_time)
                        : "In Progress"}
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="font-medium text-gray-900">
                      {entry.total_hours
                        ? `${entry.total_hours} hrs`
                        : "In Progress"}
                    </div>
                    {!entry.clock_out_time && (
                      <div className="text-xs text-green-600 font-medium">
                        Active
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
