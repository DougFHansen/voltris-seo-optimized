declare module 'web-push' {
    export interface PushSubscription {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
    }

    export interface SendResult {
        statusCode: number;
        body: string;
        headers: Record<string, string>;
    }

    export interface RequestOptions {
        headers?: Record<string, string>;
        gcmAPIKey?: string;
        vapidDetails?: {
            subject: string;
            publicKey: string;
            privateKey: string;
        };
        TTL?: number;
        contentEncoding?: string;
        proxy?: string;
    }

    export function setVapidDetails(subject: string, publicKey: string, privateKey: string): void;
    export function sendNotification(
        subscription: PushSubscription,
        payload?: string | Buffer,
        options?: RequestOptions
    ): Promise<SendResult>;
    export function generateVAPIDKeys(): { publicKey: string; privateKey: string };
}
