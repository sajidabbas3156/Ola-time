import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// Get all holidays
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const year = url.searchParams.get('year') || new Date().getFullYear();

    const holidays = await sql`
      SELECT * FROM holidays 
      WHERE EXTRACT(YEAR FROM holiday_date) = ${year}
      AND is_active = true
      ORDER BY holiday_date ASC
    `;

    return Response.json({ holidays });
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return Response.json({ error: "Failed to fetch holidays" }, { status: 500 });
  }
}

// Create a new holiday
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { holiday_date, name } = body;

    if (!holiday_date || !name) {
      return Response.json({ error: "Holiday date and name are required" }, { status: 400 });
    }

    const [holiday] = await sql`
      INSERT INTO holidays (holiday_date, name)
      VALUES (${holiday_date}, ${name})
      RETURNING *
    `;

    return Response.json({ holiday });
  } catch (error) {
    console.error("Error creating holiday:", error);
    return Response.json({ error: "Failed to create holiday" }, { status: 500 });
  }
}

// Delete a holiday
export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return Response.json({ error: "Holiday ID is required" }, { status: 400 });
    }

    await sql`
      UPDATE holidays 
      SET is_active = false
      WHERE id = ${id}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting holiday:", error);
    return Response.json({ error: "Failed to delete holiday" }, { status: 500 });
  }
}