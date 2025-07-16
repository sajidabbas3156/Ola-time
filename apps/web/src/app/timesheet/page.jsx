"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  FileText,
  Home,
  Settings,
  Download,
  Filter,
  Search,
  Plus,
  Edit3,
} from "lucide-react";

function TimesheetPage() {
  const { data: user, loading: userLoading } = useUser();
  const [timesheetData, setTimesheetData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch timesheet data
  const fetchTimesheetData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/timesheet?month=${currentMonth}&year=${currentYear}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch timesheet data");
      }
      const data = await response.json();
      setTimesheetData(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load timesheet data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTimesheetData();
    }
  }, [user, currentMonth, currentYear]);

  const navigateMonth = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const getEntryForEmployeeAndDate = (employeeId, date) => {
    if (!timesheetData?.timeEntries) return null;
    return timesheetData.timeEntries.find(
      (entry) => entry.employee_id === employeeId && entry.entry_date === date,
    );
  };

  const isHoliday = (date) => {
    if (!timesheetData?.holidays) return false;
    return timesheetData.holidays.some(
      (holiday) => holiday.holiday_date === date,
    );
  };

  const isTimeOff = (employeeId, date) => {
    if (!timesheetData?.timeOffRequests) return false;
    return timesheetData.timeOffRequests.some(
      (request) =>
        request.employee_id === employeeId &&
        date >= request.start_date &&
        date <= request.end_date,
    );
  };

  const formatHours = (hours) => {
    if (!hours || hours === 0) return "-";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const getCellBackground = (employeeId, date) => {
    if (isHoliday(date)) return "bg-red-50 border-red-200";
    if (isTimeOff(employeeId, date)) return "bg-yellow-50 border-yellow-200";
    const dayOfWeek = new Date(date).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return "bg-blue-50 border-blue-200"; // Weekend
    return "bg-white border-gray-200";
  };

  const filteredEmployees =
    timesheetData?.employees?.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.member_code.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">OLA</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">OLA</h1>
            <p className="text-gray-600">Time Clock Attendance</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <p className="text-gray-600 mb-6">
              Please sign in to access timesheets
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
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">OLA</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Monthly Timesheets
                </h1>
                <p className="text-sm text-gray-600">GRILL INN Restaurant</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <Home className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Home</span>
              </a>
              <button className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100">
                <Download className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Month Navigation & Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  {timesheetData?.monthName} {currentYear}
                </h2>
                <p className="text-sm text-gray-600">
                  {timesheetData?.days?.[0]?.date} -{" "}
                  {timesheetData?.days?.[timesheetData.days.length - 1]?.date}
                </p>
              </div>
              <button
                onClick={() => navigateMonth("next")}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-1" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Legend</h3>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
              <span className="text-gray-600">Public Holiday</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
              <span className="text-gray-600">Rest Day</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
              <span className="text-gray-600">Time Off</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="text-gray-600">Loading timesheet data...</div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="text-red-600">{error}</div>
            <button
              onClick={fetchTimesheetData}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="sticky left-0 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                      Employee
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                      Type
                    </th>
                    {timesheetData?.days?.map((day) => (
                      <th
                        key={day.date}
                        className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r min-w-[80px]"
                      >
                        <div>{day.dayName}</div>
                        <div className="font-normal">{day.dayNumber}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees
                    .map((employee) => [
                      // Payroll Hours Row
                      <tr
                        key={`${employee.id}-payroll`}
                        className="hover:bg-gray-50"
                      >
                        <td className="sticky left-0 bg-white px-4 py-3 border-r">
                          <div className="font-medium text-gray-900">
                            {employee.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employee.member_code}
                          </div>
                        </td>
                        <td className="px-2 py-3 text-sm text-gray-900 border-r">
                          Payroll Hours
                        </td>
                        {timesheetData?.days?.map((day) => {
                          const entry = getEntryForEmployeeAndDate(
                            employee.id,
                            day.date,
                          );
                          const totalHours = entry?.total_hours || 0;
                          return (
                            <td
                              key={day.date}
                              className={`px-2 py-3 text-center text-sm border-r ${getCellBackground(employee.id, day.date)}`}
                            >
                              {formatHours(totalHours)}
                            </td>
                          );
                        })}
                      </tr>,

                      // Regular Hours Row
                      <tr
                        key={`${employee.id}-regular`}
                        className="hover:bg-gray-50"
                      >
                        <td className="sticky left-0 bg-white px-4 py-3 border-r"></td>
                        <td className="px-2 py-3 text-sm text-gray-600 border-r">
                          Regular Hours
                        </td>
                        {timesheetData?.days?.map((day) => {
                          const entry = getEntryForEmployeeAndDate(
                            employee.id,
                            day.date,
                          );
                          return (
                            <td
                              key={day.date}
                              className={`px-2 py-3 text-center text-sm border-r ${getCellBackground(employee.id, day.date)}`}
                            >
                              {formatHours(entry?.regular_hours)}
                            </td>
                          );
                        })}
                      </tr>,

                      // Daily OT Row
                      <tr
                        key={`${employee.id}-daily-ot`}
                        className="hover:bg-gray-50"
                      >
                        <td className="sticky left-0 bg-white px-4 py-3 border-r"></td>
                        <td className="px-2 py-3 text-sm text-gray-600 border-r">
                          Daily OT
                        </td>
                        {timesheetData?.days?.map((day) => {
                          const entry = getEntryForEmployeeAndDate(
                            employee.id,
                            day.date,
                          );
                          return (
                            <td
                              key={day.date}
                              className={`px-2 py-3 text-center text-sm border-r ${getCellBackground(employee.id, day.date)}`}
                            >
                              {formatHours(entry?.daily_ot_hours)}
                            </td>
                          );
                        })}
                      </tr>,

                      // Public Holiday OT Row
                      <tr
                        key={`${employee.id}-holiday-ot`}
                        className="hover:bg-gray-50 border-b-2 border-gray-200"
                      >
                        <td className="sticky left-0 bg-white px-4 py-3 border-r"></td>
                        <td className="px-2 py-3 text-sm text-gray-600 border-r">
                          Public Holiday OT
                        </td>
                        {timesheetData?.days?.map((day) => {
                          const entry = getEntryForEmployeeAndDate(
                            employee.id,
                            day.date,
                          );
                          return (
                            <td
                              key={day.date}
                              className={`px-2 py-3 text-center text-sm border-r ${getCellBackground(employee.id, day.date)}`}
                            >
                              {formatHours(entry?.public_holiday_ot_hours)}
                            </td>
                          );
                        })}
                      </tr>,
                    ])
                    .flat()}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden">
              <div className="p-4">
                <div className="space-y-4">
                  {filteredEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="bg-gray-50 px-4 py-3 border-b">
                        <div className="font-medium text-gray-900">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.member_code}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {timesheetData?.days?.slice(0, 7).map((day) => {
                            const entry = getEntryForEmployeeAndDate(
                              employee.id,
                              day.date,
                            );
                            const totalHours = entry?.total_hours || 0;
                            return (
                              <div
                                key={day.date}
                                className={`p-3 rounded-md border ${getCellBackground(employee.id, day.date)}`}
                              >
                                <div className="text-xs font-medium text-gray-500">
                                  {day.dayName} {day.dayNumber}
                                </div>
                                <div className="text-sm font-medium text-gray-900 mt-1">
                                  {formatHours(totalHours)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {timesheetData?.days?.length > 7 && (
                          <button className="mt-3 text-sm text-blue-600 hover:text-blue-800">
                            View all days →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Work Schedule Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Work Schedule - GRILL INN
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Day</th>
                  <th className="text-left py-2 px-3">Start</th>
                  <th className="text-left py-2 px-3">End</th>
                  <th className="text-left py-2 px-3">Break(s)</th>
                  <th className="text-left py-2 px-3">Overtime Rules</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 px-3">Monday</td>
                  <td className="py-2 px-3">16:00</td>
                  <td className="py-2 px-3">00:00</td>
                  <td className="py-2 px-3">0h 00m</td>
                  <td className="py-2 px-3">Daily OT: 8h 00m</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Tuesday</td>
                  <td className="py-2 px-3">16:00</td>
                  <td className="py-2 px-3">00:00</td>
                  <td className="py-2 px-3">0h 00m</td>
                  <td className="py-2 px-3">Double OT: -</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Wednesday</td>
                  <td className="py-2 px-3">16:00</td>
                  <td className="py-2 px-3">00:00</td>
                  <td className="py-2 px-3">0h 00m</td>
                  <td className="py-2 px-3">Weekly OT: -</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Thursday</td>
                  <td className="py-2 px-3">16:00</td>
                  <td className="py-2 px-3">01:00</td>
                  <td className="py-2 px-3">0h 00m</td>
                  <td className="py-2 px-3">Rest day OT: Disabled</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Friday</td>
                  <td className="py-2 px-3">16:00</td>
                  <td className="py-2 px-3">01:00</td>
                  <td className="py-2 px-3">0h 00m</td>
                  <td className="py-2 px-3">Public Holiday OT: Enabled</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Saturday</td>
                  <td className="py-2 px-3">16:00</td>
                  <td className="py-2 px-3">01:00</td>
                  <td className="py-2 px-3">0h 00m</td>
                  <td className="py-2 px-3">-</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Sunday</td>
                  <td className="py-2 px-3">16:00</td>
                  <td className="py-2 px-3">00:00</td>
                  <td className="py-2 px-3">0h 00m</td>
                  <td className="py-2 px-3">Split Timesheet: 1:00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimesheetPage;
