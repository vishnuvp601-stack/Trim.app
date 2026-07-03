import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType } = await request.json();

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'Missing fileName or fileType' },
        { status: 400 }
      );
    }

    // Create record in conversions table with 'pending' status
    const { data: conversionData, error: dbError } = await supabase
      .from('conversions')
      .insert({
        status: 'pending',
        original_filename: fileName,
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to create conversion record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      conversionId: conversionData.id,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
