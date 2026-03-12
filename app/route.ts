// app/route.js
export const runtime = 'edge';

export async function GET(request: { url: string | URL; }) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new Response('Hello Darkness My Old Friend', { status: 400 });
    }

    try {
        const response = await fetch(imageUrl);

        // Create a streaming response with the correct headers
        return new Response(response.body, {
            status: response.status,
            headers: {
                'Access-Control-Allow-Origin': 'https://bisa.work', // Replace with your domain
                'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
                'Content-Disposition': 'attachment',
                'Cache-Control': 'public, max-age=31536000, immutable', // Cache heavily to save transit
            },
        });
    } catch (error) {
        return new Response('Proxy Error', { status: 500 });
    }
}