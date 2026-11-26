// Netlify scheduled function: pings the backend every 10 minutes so Render's free tier
// doesn't put it to sleep (it does after ~15 minutes without traffic). Waking up takes
// longer than Netlify's proxy waits, so the first visitor after a quiet spell got 504s
// for the doctors list, reviews and geolocation.
//
// It hits the API's root route, which answers without touching the database.
// Scheduled functions only run on the published production deploy.

const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || 'https://doctor-webapp-backend-zxn3.onrender.com';

export default async () => {
  const started = Date.now();
  try {
    // Scheduled functions are cut off at 30s. Even if a cold start takes longer than
    // that, the request has already woken the server.
    const res = await fetch(`${BACKEND_ORIGIN}/`, { signal: AbortSignal.timeout(25_000) });
    console.log(`backend ping: ${res.status} in ${Date.now() - started}ms`);
  } catch (error) {
    console.warn(`backend ping failed after ${Date.now() - started}ms: ${error.message}`);
  }
};

export const config = {
  schedule: '*/10 * * * *',
};
