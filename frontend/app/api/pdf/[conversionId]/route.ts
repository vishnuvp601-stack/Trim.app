import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { conversionId: string } }
) {
  try {
    const { conversionId } = params;
    const backendUrl = process.env.BACKEND_CONVERSION_URL || 'http://localhost:8080';

    // Call the backend PDF endpoint
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
