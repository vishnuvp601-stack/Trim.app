import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const conversionId = request.nextUrl.searchParams.get('id');
    
    if (!conversionId) {
      return NextResponse.json(
        { error: 'Missing conversion ID' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_CONVERSION_URL || 'http://localhost:8080';
    const response = await fetch(`${backendUrl}/pdf/${conversionId}`);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to retrieve PDF URL' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error retrieving PDF URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
