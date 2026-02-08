/**
 * VOLTRIS ENTERPRISE TELEMETRY PLATFORM
 * Event Registry Service API
 * 
 * Provides access to the Event Registry for schema validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/telemetry/registry/:eventName
 * Fetch event definition from registry
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { eventName: string } }
) {
    try {
        const { eventName } = params;

        const supabase = createClient();

        // Fetch event definition
        const { data: eventDef, error } = await supabase
            .from('event_registry')
            .select('*')
            .eq('event_name', eventName)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // Event not found
                return NextResponse.json(
                    {
                        success: false,
                        error: 'EVENT_NOT_REGISTERED',
                        message: `Event '${eventName}' is not registered in the Event Registry`,
                    },
                    { status: 404 }
                );
            }

            throw error;
        }

        // Check if event is sunset
        if (eventDef.status === 'sunset') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'EVENT_SUNSET',
                    message: `Event '${eventName}' has been sunset`,
                    replacement_event: eventDef.replacement_event,
                },
                { status: 410 }
            );
        }

        return NextResponse.json({
            success: true,
            event: eventDef,
            is_deprecated: eventDef.status === 'deprecated',
        });
    } catch (error: any) {
        console.error('[Event Registry] Error fetching event:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'SERVER_ERROR',
                message: error.message,
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/telemetry/registry
 * Register a new event (Admin only)
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const supabase = createClient();

        // TODO: Add auth check for admin role
        // For now, allowing service_role to create events

        const {
            event_name,
            event_version,
            schema_version,
            owner_system,
            module_name,
            feature_name,
            description,
            criticality_level,
            retention_days,
            contains_pii,
            payload_schema,
            example_payload,
        } = body;

        // Validate required fields
        if (!event_name || !event_version || !owner_system || !module_name || !feature_name || !description || !criticality_level || !payload_schema) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'MISSING_REQUIRED_FIELDS',
                    message: 'Missing required fields for event registration',
                },
                { status: 400 }
            );
        }

        // Insert event definition
        const { data: newEvent, error } = await supabase
            .from('event_registry')
            .insert({
                event_name,
                event_version,
                schema_version: schema_version || '1.0.0',
                owner_system,
                module_name,
                feature_name,
                description,
                criticality_level,
                retention_days: retention_days || 90,
                contains_pii: contains_pii || false,
                payload_schema,
                example_payload,
                status: 'active',
                created_by: 'system', // TODO: Get from auth context
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                // Unique violation
                return NextResponse.json(
                    {
                        success: false,
                        error: 'EVENT_ALREADY_EXISTS',
                        message: `Event '${event_name}' already exists in the registry`,
                    },
                    { status: 409 }
                );
            }

            throw error;
        }

        return NextResponse.json({
            success: true,
            event: newEvent,
        });
    } catch (error: any) {
        console.error('[Event Registry] Error registering event:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'SERVER_ERROR',
                message: error.message,
            },
            { status: 500 }
        );
    }
}
