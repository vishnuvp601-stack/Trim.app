import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_CONVERSION_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    const { conversionId } = await request.json();

    if (!conversionId) {
      return NextResponse.json(
        { error: 'Missing conversionId' },
        { status: 400 }
      );
    }

    // Call the backend conversion worker
    const response = await fetch(`${BACKEND_URL}/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: conversionId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend conversion error:', errorData);
      return NextResponse.json(
        { error: 'Backend conversion failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Conversion trigger error:', error);
    return NextResponse.json(
      { error: 'Failed to trigger conversion' },
      { status: 500 }
    );
  }
}
