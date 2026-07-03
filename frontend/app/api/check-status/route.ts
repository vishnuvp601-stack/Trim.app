import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversionId = searchParams.get('id');

    if (!conversionId) {
      return NextResponse.json(
        { error: 'Missing conversion ID' },
        { status: 400 }
      );
    }

    // Fetch the conversion record from database
    const { data, error } = await supabase
      .from('conversions')
      .select('status')
      .eq('id', conversionId)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch conversion status' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Conversion not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: data.status,
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
