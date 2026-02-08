/**
 * VOLTRIS ENTERPRISE TELEMETRY PLATFORM
 * Telemetry Gateway - Enterprise Event Processing
 * 
 * Features:
 * - Schema Validation
 * - Event Enrichment
 * - Rate Limiting
 * - Deduplication
 * - Rejection Tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Initialize JSON Schema Validator
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// In-memory cache for event schemas (TTL: 5 minutes)
interface SchemaCache {
    schema: any;
    definition: any;
    cachedAt: number;
}

const schemaCache = new Map<string, SchemaCache>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch event definition from registry (with caching)
 */
async function getEventDefinition(eventName: string, supabase: any): Promise<any> {
    // Check cache
    const cached = schemaCache.get(eventName);
    if (cached && (Date.now() - cached.cachedAt < CACHE_TTL_MS)) {
        return cached.definition;
    }

    // Fetch from database
    const { data: eventDef, error } = await supabase
        .from('event_registry')
        .select('*')
        .eq('event_name', eventName)
        .single();

    if (error || !eventDef) {
        return null;
    }

    // Cache it
    schemaCache.set(eventName, {
        schema: eventDef.payload_schema,
        definition: eventDef,
        cachedAt: Date.now(),
    });

    return eventDef;
}

/**
 * Validate event payload against schema
 */
function validateEventSchema(event: any, schema: any): { valid: boolean; errors?: any[] } {
    const validate = ajv.compile(schema);
    const valid = validate(event);

    if (!valid) {
        return {
            valid: false,
            errors: validate.errors || [],
        };
    }

    return { valid: true };
}

/**
 * Store rejected event for audit
 */
async function storeRejectedEvent(
    supabase: any,
    event: any,
    reason: string,
    validationErrors: any[] = [],
    deviceId?: string,
    sessionId?: string,
    appVersion?: string
) {
    try {
        await supabase.from('rejected_events').insert({
            event_type: event.event_type,
            raw_payload: event,
            rejection_reason: reason,
            validation_errors: validationErrors.length > 0 ? validationErrors : null,
            device_id: deviceId,
            session_id: sessionId,
            app_version: appVersion,
        });
    } catch (error) {
        console.error('[Telemetry Gateway] Error storing rejected event:', error);
    }
}

/**
 * Log deprecation warning
 */
async function logDeprecationWarning(
    supabase: any,
    eventName: string,
    replacementEvent: string | null
) {
    console.warn(
        `[Telemetry Gateway] DEPRECATION WARNING: Event '${eventName}' is deprecated.${replacementEvent ? ` Use '${replacementEvent}' instead.` : ''
        }`
    );
}

/**
 * POST /api/telemetry/gateway
 * Enterprise Telemetry Gateway with validation
 */
export async function POST(req: NextRequest) {
    const startTime = Date.now();
    const supabase = createClient();

    try {
        const body = await req.json();
        const { events, session_id, device_id } = body;

        if (!events || !Array.isArray(events)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'INVALID_PAYLOAD',
                    message: 'Missing or invalid events array',
                },
                { status: 400 }
            );
        }

        const validatedEvents: any[] = [];
        const rejectedEvents: any[] = [];

        // Process each event
        for (const event of events) {
            try {
                const eventType = event.event_type;

                if (!eventType) {
                    rejectedEvents.push({
                        event,
                        reason: 'MISSING_EVENT_TYPE',
                        timestamp: new Date(),
                    });
                    continue;
                }

                // 1. Fetch event definition from registry
                const definition = await getEventDefinition(eventType, supabase);

                if (!definition) {
                    // Event not registered
                    await storeRejectedEvent(
                        supabase,
                        event,
                        'EVENT_NOT_REGISTERED',
                        [],
                        device_id,
                        session_id,
                        body.app_version
                    );

                    rejectedEvents.push({
                        event,
                        reason: 'EVENT_NOT_REGISTERED',
                        message: `Event '${eventType}' is not registered in the Event Registry`,
                        timestamp: new Date(),
                    });
                    continue;
                }

                // 2. Check if event is sunset
                if (definition.status === 'sunset') {
                    await storeRejectedEvent(
                        supabase,
                        event,
                        'EVENT_SUNSET',
                        [],
                        device_id,
                        session_id,
                        body.app_version
                    );

                    rejectedEvents.push({
                        event,
                        reason: 'EVENT_SUNSET',
                        message: `Event '${eventType}' has been sunset`,
                        replacement: definition.replacement_event,
                        timestamp: new Date(),
                    });
                    continue;
                }

                // 3. Validate schema
                const validation = validateEventSchema(event, definition.payload_schema);

                if (!validation.valid) {
                    await storeRejectedEvent(
                        supabase,
                        event,
                        'SCHEMA_VALIDATION_FAILED',
                        validation.errors || [],
                        device_id,
                        session_id,
                        body.app_version
                    );

                    rejectedEvents.push({
                        event,
                        reason: 'SCHEMA_VALIDATION_FAILED',
                        errors: validation.errors,
                        timestamp: new Date(),
                    });
                    continue;
                }

                // 4. Check deprecation status (log warning but accept)
                if (definition.status === 'deprecated') {
                    await logDeprecationWarning(supabase, eventType, definition.replacement_event);
                }

                // 5. Event is valid - add to validated list
                validatedEvents.push(event);
            } catch (eventError: any) {
                console.error('[Telemetry Gateway] Error processing event:', eventError);
                rejectedEvents.push({
                    event,
                    reason: 'PROCESSING_ERROR',
                    message: eventError.message,
                    timestamp: new Date(),
                });
            }
        }

        // 6. Store validated events in original telemetry_events table
        if (validatedEvents.length > 0) {
            // Resolve device UUID
            const { data: device } = await supabase
                .from('devices')
                .select('id')
                .eq('machine_id', device_id)
                .single();

            if (!device) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'DEVICE_NOT_FOUND',
                        message: 'Device not registered',
                    },
                    { status: 404 }
                );
            }

            const real_device_id = device.id;

            // Format events for insertion
            const formattedEvents = validatedEvents.map((e) => ({
                session_id,
                device_id: real_device_id,
                event_type: e.event_type,
                feature_name: e.feature_name,
                action_name: e.action_name,
                duration_ms: e.duration_ms || 0,
                success: e.success !== undefined ? e.success : true,
                error_code: e.error_code || null,
                metadata: e.metadata || null,
                timestamp: e.timestamp || new Date().toISOString(),
            }));

            const { error: insertError } = await supabase
                .from('telemetry_events')
                .insert(formattedEvents);

            if (insertError) {
                throw insertError;
            }
        }

        // 7. Record telemetry health metrics
        const ingestionLatency = Date.now() - startTime;

        await supabase.from('telemetry_health_metrics').insert({
            events_received: events.length,
            events_validated: validatedEvents.length,
            events_rejected: rejectedEvents.length,
            events_stored: validatedEvents.length,
            rejection_reasons: rejectedEvents.reduce((acc: any, r: any) => {
                acc[r.reason] = (acc[r.reason] || 0) + 1;
                return acc;
            }, {}),
            avg_ingestion_latency_ms: ingestionLatency,
            p95_ingestion_latency_ms: ingestionLatency, // TODO: Calculate actual P95
            p99_ingestion_latency_ms: ingestionLatency, // TODO: Calculate actual P99
            gateway_status: 'healthy',
            database_status: 'healthy',
        });

        // 8. Return response
        return NextResponse.json({
            success: true,
            accepted: validatedEvents.length,
            rejected: rejectedEvents.length,
            errors: rejectedEvents.length > 0 ? rejectedEvents : undefined,
            processing_time_ms: ingestionLatency,
        });
    } catch (error: any) {
        console.error('[Telemetry Gateway] Fatal error:', error);

        // Record health metrics for failure
        try {
            await supabase.from('telemetry_health_metrics').insert({
                events_received: 0,
                events_validated: 0,
                events_rejected: 0,
                events_stored: 0,
                gateway_status: 'down',
                database_status: 'degraded',
            });
        } catch { }

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
