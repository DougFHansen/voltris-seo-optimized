import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const { username } = await request.json();

        if (!username) {
            return NextResponse.json({ error: 'Username required' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Look up email by login/username
        const { data, error } = await supabase
            .from('profiles')
            .select('email')
            .eq('login', username)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ email: data.email });
    } catch (error: any) {
        console.error('[GET-EMAIL] error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
