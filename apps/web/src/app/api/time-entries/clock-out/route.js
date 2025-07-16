import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// Clock out - update the active time entry
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the active time entry (no clock out time)
    const activeEntry = await sql`
      SELECT * FROM time_entries 
      WHERE user_id = ${session.user.id} AND clock_out_time IS NULL
      ORDER BY clock_in_time DESC
      LIMIT 1
    `;

    if (activeEntry.length === 0) {
      return Response.json(
        { error: "No active time entry found" },
        { status: 400 },
      );
    }

    const entry = activeEntry[0];
    const clockOutTime = new Date();
    const clockInTime = new Date(entry.clock_in_time);
    const totalHours = (clockOutTime - clockInTime) / (1000 * 60 * 60); // Convert to hours

    // Calculate different hour types based on business rules
    const regularHours = Math.min(totalHours, 8); // Regular hours capped at 8
    const dailyOtHours = Math.max(0, totalHours - 8); // Daily OT after 8 hours

    // Check if it's a weekend (rest day)
    const dayOfWeek = clockInTime.getDay();
    const isRestDay = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday

    // Check if it's a public holiday
    const entryDate =
      entry.entry_date || clockInTime.toISOString().split("T")[0];
    const holidays = await sql`
      SELECT * FROM holidays 
      WHERE holiday_date = ${entryDate} AND is_active = true
    `;
    const isPublicHoliday = holidays.length > 0;

    const [updatedEntry] = await sql`
      UPDATE time_entries 
      SET clock_out_time = ${clockOutTime.toISOString()}, 
          total_hours = ${totalHours.toFixed(2)},
          regular_hours = ${isRestDay || isPublicHoliday ? 0 : regularHours.toFixed(2)},
          daily_ot_hours = ${isRestDay || isPublicHoliday ? 0 : dailyOtHours.toFixed(2)},
          rest_day_ot_hours = ${isRestDay && !isPublicHoliday ? totalHours.toFixed(2) : 0},
          public_holiday_ot_hours = ${isPublicHoliday ? totalHours.toFixed(2) : 0},
          is_rest_day = ${isRestDay},
          is_public_holiday = ${isPublicHoliday},
          updated_at = NOW()
      WHERE id = ${entry.id}
      RETURNING *
    `;

    return Response.json({ entry: updatedEntry });
  } catch (error) {
    console.error("Error clocking out:", error);
    return Response.json({ error: "Failed to clock out" }, { status: 500 });
  }
}
