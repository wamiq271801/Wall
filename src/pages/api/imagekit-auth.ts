import CryptoJS from 'crypto-js';
import crypto from 'crypto';

export async function GET() {
  return await handleAuth();
}

export async function POST() {
  return await handleAuth();
}

async function handleAuth() {
  try {
    const privateKey = import.meta.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = import.meta.env.IMAGEKIT_PUBLIC_KEY;
    
    if (!privateKey || !publicKey) {
      throw new Error('ImageKit credentials not configured');
    }

    // Generate authentication parameters
    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 60 * 30; // 30 minutes
    const signature = CryptoJS.HmacSHA1(`${token}${expire}`, privateKey)
      .toString(CryptoJS.enc.Hex);
    
    return new Response(
      JSON.stringify({
        token,
        expire,
        signature,
        publicKey
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        } 
      }
    );
  } catch (error) {
    console.error('ImageKit auth error:', error);
    return new Response(
      JSON.stringify({ error: 'Authentication failed' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
  }
}

// Note: This function is designed for a serverless environment.
// It won't work in the browser environment.
