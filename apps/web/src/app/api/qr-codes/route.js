import sql from '@/app/api/utils/sql';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employee_id');

    if (employeeId) {
      // Get specific employee QR code data
      const employee = await sql`
        SELECT id, name, member_code 
        FROM employees 
        WHERE id = ${employeeId} AND is_active = true
      `;

      if (employee.length === 0) {
        return Response.json({ error: 'Employee not found' }, { status: 404 });
      }

      const qrData = {
        employee_id: employee[0].id,
        member_code: employee[0].member_code,
        name: employee[0].name,
        action: 'clock',
        timestamp: new Date().toISOString()
      };

      return Response.json({
        employee: employee[0],
        qr_data: JSON.stringify(qrData),
        qr_text: `Employee: ${employee[0].name} (${employee[0].member_code})`
      });
    } else {
      // Get all employees for QR code generation
      const employees = await sql`
        SELECT id, name, member_code, is_active
        FROM employees 
        WHERE is_active = true
        ORDER BY name
      `;

      const qrCodes = employees.map(employee => ({
        employee,
        qr_data: JSON.stringify({
          employee_id: employee.id,
          member_code: employee.member_code,
          name: employee.name,
          action: 'clock',
          timestamp: new Date().toISOString()
        }),
        qr_text: `Employee: ${employee.name} (${employee.member_code})`
      }));

      return Response.json(qrCodes);
    }
  } catch (error) {
    console.error('Error generating QR codes:', error);
    return Response.json({ error: 'Failed to generate QR codes' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { employee_ids, location_name } = body;

    if (!employee_ids || !Array.isArray(employee_ids)) {
      return Response.json({ error: 'employee_ids array is required' }, { status: 400 });
    }

    // Get employees
    const employees = await sql`
      SELECT id, name, member_code 
      FROM employees 
      WHERE id = ANY(${employee_ids}) AND is_active = true
    `;

    if (employees.length === 0) {
      return Response.json({ error: 'No valid employees found' }, { status: 404 });
    }

    // Generate QR codes for multiple employees
    const qrCodes = employees.map(employee => {
      const qrData = {
        employee_id: employee.id,
        member_code: employee.member_code,
        name: employee.name,
        action: 'clock',
        location: location_name || 'Default Location',
        timestamp: new Date().toISOString()
      };

      return {
        employee,
        qr_data: JSON.stringify(qrData),
        qr_text: `${employee.name} (${employee.member_code})${location_name ? ` - ${location_name}` : ''}`
      };
    });

    return Response.json({
      success: true,
      qr_codes: qrCodes,
      count: qrCodes.length
    });
  } catch (error) {
    console.error('Error creating QR codes:', error);
    return Response.json({ error: 'Failed to create QR codes' }, { status: 500 });
  }
}