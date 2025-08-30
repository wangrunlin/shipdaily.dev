import type { APIRoute } from 'astro';
import { githubAPI } from '../../lib/github';

export const GET: APIRoute = async ({ request }) => {
  try {
    const stats = await githubAPI.getShipDailyStats();
    
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });
  } catch (error) {
    console.error('API error:', error);
    
    return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};