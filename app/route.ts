export const runtime = 'edge';

const ALLOWED_ORIGINS = [
    'https://bisa.work',
    'http://localhost:3000'
];

export async function GET(request: { url: string | URL; headers: { get: (arg0: string) => any; }; }) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    // 1. Get the origin from the request headers
    const origin = request.headers.get('origin');

    // 2. Determine if we should allow this origin
    const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    if (!imageUrl) {
        return new Response('iu em nhứt', { status: 400 });
    }

    try {
        const response = await fetch(imageUrl);

        // 3. Extract filename from URL (optional but helpful)
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1] || 'download';

        return new Response(response.body, {
            status: response.status,
            headers: {
                'Access-Control-Allow-Origin': corsOrigin,
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        return new Response('Proxy Error', { status: 500 });
    }
}

// Handle CORS Preflight requests
export async function OPTIONS(request: { headers: { get: (arg0: string) => any; }; }) {
    const origin = request.headers.get('origin');
    const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': corsOrigin,
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}