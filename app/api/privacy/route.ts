/**
 * VOLTRIS ENTERPRISE TELEMETRY PLATFORM
 * Privacy & Compliance Service API
 * 
 * LGPD/GDPR compliant data management:
 * - User data deletion requests
 * - Data retention automation
 * - Access audit logging
 * - Pseudonymization
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/privacy/delete-request
 * Request deletion of user data (LGPD/GDPR Right to be Forgotten)
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { device_id, company_id, scope, requested_by } = body;

        if (!device_id && !company_id) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'MISSING_IDENTIFIER',
                    message: 'Either device_id or company_id must be provided',
                },
                { status: 400 }
            );
        }

        const supabase = createClient();

        // Create deletion request
        const { data: request, error } = await supabase
            .from('user_deletion_requests')
            .insert({
                device_id,
                company_id,
                requested_by: requested_by || 'user',
                deletion_scope: scope || {
                    events: true,
                    profile: true,
                    sessions: true,
                    journeys: true,
                },
                status: 'pending',
            })
            .select()
            .single();

        if (error) throw error;

        // Process deletion asynchronously
        processDataDeletion(request.id, device_id, company_id, request.deletion_scope);

        return NextResponse.json({
            success: true,
            request_id: request.id,
            status: 'pending',
            message: 'Deletion request created. Processing will complete within 30 days as required by LGPD/GDPR.',
        });
    } catch (error: any) {
        console.error('[Privacy] Delete request error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'REQUEST_FAILED',
                message: error.message,
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/privacy/delete-request/:id
 * Check status of deletion request
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const requestId = searchParams.get('id');

        if (!requestId) {
            return NextResponse.json(
                { success: false, error: 'MISSING_REQUEST_ID' },
                { status: 400 }
            );
        }

        const supabase = createClient();

        const { data: request, error } = await supabase
            .from('user_deletion_requests')
            .select('*')
            .eq('id', requestId)
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            request,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: 'FETCH_FAILED',
                message: error.message,
            },
            { status: 500 }
        );
    }
}

/**
 * Process data deletion (async)
 */
async function processDataDeletion(
    requestId: string,
    deviceId?: string,
    companyId?: string,
    scope?: any
) {
    try {
        const supabase = createClient();

        // Update status to processing
        await supabase
            .from('user_deletion_requests')
            .update({ status: 'processing', processed_at: new Date().toISOString() })
            .eq('id', requestId);

        const deletedRecords: any = {};

        // Delete telemetry events
        if (scope?.events) {
            const { count } = await supabase
                .from('telemetry_events')
                .delete()
                .eq('device_id', deviceId);
            deletedRecords.telemetry_events = count || 0;
        }

        // Delete sessions
        if (scope?.sessions) {
            const { count } = await supabase
                .from('sessions')
                .delete()
                .eq('device_id', deviceId);
            deletedRecords.sessions = count || 0;
        }

        // Delete user journeys
        if (scope?.journeys) {
            const { count } = await supabase
                .from('user_journeys')
                .delete()
                .eq('device_id', deviceId);
            deletedRecords.user_journeys = count || 0;
        }

        // Delete device profile
        if (scope?.profile) {
            const { count } = await supabase
                .from('device_profiles')
                .delete()
                .eq('device_id', deviceId);
            deletedRecords.device_profiles = count || 0;

            if (companyId) {
                await supabase
                    .from('companies')
                    .delete()
                    .eq('id', companyId);
                deletedRecords.companies = 1;
            }
        }

        // Mark as completed
        await supabase
            .from('user_deletion_requests')
            .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
                deleted_records: deletedRecords,
            })
            .eq('id', requestId);

        console.log(`[Privacy] Deletion request ${requestId} completed:`, deletedRecords);
    } catch (error) {
        console.error('[Privacy] Deletion processing error:', error);

        // Mark as failed
        const supabase = createClient();
        await supabase
            .from('user_deletion_requests')
            .update({ status: 'failed' })
            .eq('id', requestId);
    }
}

/**
 * POST /api/privacy/audit-access
 * Log access to telemetry data (compliance requirement)
 */
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { user_id, access_type, resource_type, resource_id, query_filters, rows_accessed } = body;

        const supabase = createClient();

        // Get client info
        const ip_address = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
        const user_agent = req.headers.get('user-agent') || '';

        // Log access
        await supabase.from('telemetry_access_audit').insert({
            user_id,
            access_type,
            resource_type,
            resource_id,
            query_filters,
            rows_accessed,
            ip_address,
            user_agent,
        });

        return NextResponse.json({
            success: true,
            message: 'Access logged',
        });
    } catch (error: any) {
        console.error('[Privacy] Audit log error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'AUDIT_FAILED',
                message: error.message,
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/privacy/retention-cleanup
 * Run data retention cleanup based on policies
 */
export async function DELETE(req: NextRequest) {
    try {
        const supabase = createClient();

        // Get all retention policies
        const { data: policies, error } = await supabase
            .from('data_retention_policies')
            .select('*')
            .eq('auto_delete', true);

        if (error) throw error;

        const results = [];

        for (const policy of policies) {
            // Calculate cutoff date
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - policy.retention_days);

            // Delete old events of this type
            const { count } = await supabase
                .from('telemetry_events')
                .delete()
                .eq('event_type', policy.event_type)
                .lt('timestamp', cutoffDate.toISOString());

            results.push({
                event_type: policy.event_type,
                deleted_count: count || 0,
                cutoff_date: cutoffDate,
            });

            // Update policy
            await supabase
                .from('data_retention_policies')
                .update({
                    last_cleanup_at: new Date().toISOString(),
                    next_cleanup_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                })
                .eq('id', policy.id);
        }

        return NextResponse.json({
            success: true,
            results,
            total_deleted: results.reduce((sum, r) => sum + r.deleted_count, 0),
        });
    } catch (error: any) {
        console.error('[Privacy] Retention cleanup error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'CLEANUP_FAILED',
                message: error.message,
            },
            { status: 500 }
        );
    }
}

/**
 * Pseudonymization utility
 */
export function pseudonymize(identifier: string, salt: string): string {
    return crypto
        .createHash('sha256')
        .update(identifier + salt)
        .digest('hex')
        .substring(0, 16);
}

/**
 * Export user data (LGPD/GDPR Data Portability Right)
 */
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { device_id } = body;

        if (!device_id) {
            return NextResponse.json(
                { success: false, error: 'MISSING_DEVICE_ID' },
                { status: 400 }
            );
        }

        const supabase = createClient();

        // Collect all user data
        const userData: any = {};

        // Device profile
        const { data: profile } = await supabase
            .from('device_profiles')
            .select('*')
            .eq('device_id', device_id)
            .single();
        userData.profile = profile;

        // Sessions
        const { data: sessions } = await supabase
            .from('sessions')
            .select('*')
            .eq('device_id', device_id);
        userData.sessions = sessions;

        // Events
        const { data: events } = await supabase
            .from('telemetry_events')
            .select('*')
            .eq('device_id', device_id)
            .order('timestamp', { ascending: false })
            .limit(10000); // Limit for performance
        userData.events = events;

        // Journeys
        const { data: journeys } = await supabase
            .from('user_journeys')
            .select('*')
            .eq('device_id', device_id);
        userData.journeys = journeys;

        return NextResponse.json({
            success: true,
            data: userData,
            export_date: new Date().toISOString(),
            data_counts: {
                events: events?.length || 0,
                sessions: sessions?.length || 0,
                journeys: journeys?.length || 0,
            },
        });
    } catch (error: any) {
        console.error('[Privacy] Data export error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'EXPORT_FAILED',
                message: error.message,
            },
            { status: 500 }
        );
    }
}
