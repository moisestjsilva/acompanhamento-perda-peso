// Test environment variables
require('dotenv').config();

console.log('Environment variables test:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('NODE_ENV:', process.env.NODE_ENV);