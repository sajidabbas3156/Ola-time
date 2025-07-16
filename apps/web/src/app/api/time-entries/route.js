import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// Get all time entries for the current user
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entries = await sql`
      SELECT * FROM time_entries 
      WHERE user_id = ${session.user.id}
      ORDER BY clock_in_time DESC
    `;

    return Response.json({ entries });
  } catch (error) {
    console.error("Error fetching time entries:", error);
    return Response.json(
      { error: "Failed to fetch time entries" },
      { status: 500 },
    );
  }
}

// Create a new time entry (clock in)
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notes } = body;

    // Check if user is already clocked in
    const activeEntry = await sql`
      SELECT * FROM time_entries 
      WHERE user_id = ${session.user.id} AND clock_out_time IS NULL
      ORDER BY clock_in_time DESC
      LIMIT 1
    `;

    if (activeEntry.length > 0) {
      return Response.json({ error: "Already clocked in" }, { status: 400 });
    }

    // Try to find employee record for this user
    const employee = await sql`
      SELECT id FROM employees WHERE user_id = ${session.user.id} LIMIT 1
    `;

    const employeeId = employee.length > 0 ? employee[0].id : null;
    const currentDate = new Date().toISOString().split("T")[0];

    const [entry] = await sql`
      INSERT INTO time_entries (user_id, employee_id, clock_in_time, entry_date, notes)
      VALUES (${session.user.id}, ${employeeId}, NOW(), ${currentDate}, ${notes || ""})
      RETURNING *
    `;

    return Response.json({ entry });
  } catch (error) {
    console.error("Error creating time entry:", error);
    return Response.json({ error: "Failed to clock in" }, { status: 500 });
  }
}
