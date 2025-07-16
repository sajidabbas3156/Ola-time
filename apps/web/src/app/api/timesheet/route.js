import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// Get timesheet data for a specific month
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const month = parseInt(url.searchParams.get('month')) || new Date().getMonth() + 1;
    const year = parseInt(url.searchParams.get('year')) || new Date().getFullYear();

    // Get all employees
    const employees = await sql`
      SELECT * FROM employees 
      WHERE is_active = true
      ORDER BY name ASC
    `;

    // Get holidays for the month
    const holidays = await sql`
      SELECT * FROM holidays 
      WHERE EXTRACT(YEAR FROM holiday_date) = ${year}
      AND EXTRACT(MONTH FROM holiday_date) = ${month}
      AND is_active = true
      ORDER BY holiday_date ASC
    `;

    // Get time off requests for the month
    const timeOffRequests = await sql`
      SELECT * FROM time_off_requests 
      WHERE status = 'approved'
      AND (
        (EXTRACT(YEAR FROM start_date) = ${year} AND EXTRACT(MONTH FROM start_date) = ${month})
        OR (EXTRACT(YEAR FROM end_date) = ${year} AND EXTRACT(MONTH FROM end_date) = ${month})
        OR (start_date <= ${year}-${month}-01 AND end_date >= ${year}-${month}-31)
      )
    `;

    // Get time entries for the month
    const timeEntries = await sql`
      SELECT te.*, e.name as employee_name, e.member_code
      FROM time_entries te
      LEFT JOIN employees e ON te.employee_id = e.id
      WHERE EXTRACT(YEAR FROM te.entry_date) = ${year}
      AND EXTRACT(MONTH FROM te.entry_date) = ${month}
      ORDER BY te.entry_date ASC, e.name ASC
    `;

    // Generate days for the month
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dateString = date.toISOString().split('T')[0];
      
      days.push({
        date: dateString,
        dayNumber: day.toString().padStart(2, '0'),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isHoliday: holidays.some(h => h.holiday_date === dateString)
      });
    }

    // Get month name
    const monthName = new Date(year, month - 1, 1).toLocaleDateString('en-US', { 
      month: 'long' 
    });

    // Calculate overtime and categorize hours for each entry
    const processedTimeEntries = timeEntries.map(entry => {
      if (!entry.total_hours) return entry;

      const totalHours = parseFloat(entry.total_hours);
      const entryDate = new Date(entry.entry_date);
      const isWeekend = entryDate.getDay() === 0 || entryDate.getDay() === 6;
      const isHoliday = holidays.some(h => h.holiday_date === entry.entry_date);
      
      let regularHours = 0;
      let dailyOtHours = 0;
      let restDayOtHours = 0;
      let publicHolidayOtHours = 0;

      if (isHoliday) {
        // All hours on public holidays are public holiday OT
        publicHolidayOtHours = totalHours;
      } else if (isWeekend) {
        // All hours on weekends are rest day OT
        restDayOtHours = totalHours;
      } else {
        // Regular weekday
        if (totalHours <= 8) {
          regularHours = totalHours;
        } else {
          regularHours = 8;
          dailyOtHours = totalHours - 8;
        }
      }

      return {
        ...entry,
        regular_hours: regularHours,
        daily_ot_hours: dailyOtHours,
        rest_day_ot_hours: restDayOtHours,
        public_holiday_ot_hours: publicHolidayOtHours,
        is_rest_day: isWeekend,
        is_public_holiday: isHoliday
      };
    });

    return Response.json({
      employees,
      timeEntries: processedTimeEntries,
      holidays,
      timeOffRequests,
      days,
      monthName,
      month,
      year,
      daysInMonth
    });

  } catch (error) {
    console.error("Error fetching timesheet data:", error);
    return Response.json({ error: "Failed to fetch timesheet data" }, { status: 500 });
  }
}