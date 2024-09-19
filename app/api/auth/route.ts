import { NextResponse } from 'next/server';
import { pool } from '../../lib/db';


export async function POST(request: Request) {
  const { cookie } = await request.json();
  if (!cookie) {
    return NextResponse.json({ isValid: false }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM users WHERE hashedCookies = $1',
      [cookie]
    );    
    client.release();
    return NextResponse.json({ isValid: result.rows.length > 0 });
  } catch (error) {
    console.error('Error checking cookie in API:', error);
    return NextResponse.json({ isValid: false }, { status: 500 });
  }
}
