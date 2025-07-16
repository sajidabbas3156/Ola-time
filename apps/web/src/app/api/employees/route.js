import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// Get all employees
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employees = await sql`
      SELECT * FROM employees 
      WHERE is_active = true
      ORDER BY name ASC
    `;

    return Response.json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return Response.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

// Create a new employee
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, member_code, user_id } = body;

    if (!name || !member_code) {
      return Response.json({ error: "Name and member code are required" }, { status: 400 });
    }

    const [employee] = await sql`
      INSERT INTO employees (name, member_code, user_id)
      VALUES (${name}, ${member_code}, ${user_id || null})
      RETURNING *
    `;

    return Response.json({ employee });
  } catch (error) {
    console.error("Error creating employee:", error);
    if (error.message.includes('duplicate key')) {
      return Response.json({ error: "Member code already exists" }, { status: 400 });
    }
    return Response.json({ error: "Failed to create employee" }, { status: 500 });
  }
}