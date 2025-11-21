#!/usr/bin/env node

/**
 * Environment Configuration Checker
 * Run this script to verify your environment variables are properly configured
 */

require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking CodeCoach Environment Configuration...\n');

// Check Node environment
console.log('📦 Node Environment:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set (defaults to development)'}`);
console.log('');

// Check Supabase configuration
console.log('🔐 Supabase Configuration:');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl) {
  console.log(`   ✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl.substring(0, 30)}...`);
} else {
  console.log('   ❌ NEXT_PUBLIC_SUPABASE_URL: NOT SET');
}

if (supabaseKey) {
  console.log(`   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey.substring(0, 20)}...`);
} else {
  console.log('   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY: NOT SET');
}
console.log('');

// Check OpenRouter API Key
console.log('🤖 OpenRouter API Configuration:');
const apiKey = process.env.OPENROUTER_API_KEY;

if (apiKey) {
  const keys = apiKey.split(',').map(k => k.trim()).filter(k => k.length > 0);
  console.log(`   ✅ OPENROUTER_API_KEY: ${keys.length} key(s) configured`);
  
  keys.forEach((key, index) => {
    const masked = key.length > 8 
      ? `${key.substring(0, 4)}...${key.substring(key.length - 4)}`
      : '****';
    console.log(`      Key ${index + 1}: ${masked}`);
  });
  
  // Validate key format
  const invalidKeys = keys.filter(k => !k.startsWith('sk-'));
  if (invalidKeys.length > 0) {
    console.log('   ⚠️  Warning: Some keys may not have the correct format (should start with "sk-")');
  }
} else {
  console.log('   ❌ OPENROUTER_API_KEY: NOT SET');
  console.log('   ⚠️  This is required for the application to work!');
}
console.log('');

// Summary
console.log('📋 Summary:');
const allConfigured = supabaseUrl && supabaseKey && apiKey;

if (allConfigured) {
  console.log('   ✅ All required environment variables are configured!');
  console.log('   You can start the development server with: npm run dev');
} else {
  console.log('   ❌ Some environment variables are missing.');
  console.log('   Please check your .env.local file and ensure all required variables are set.');
  console.log('');
  console.log('   Required variables:');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL');
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('   - OPENROUTER_API_KEY');
  console.log('');
  console.log('   See .env.example for the expected format.');
}
console.log('');

// Exit with appropriate code
process.exit(allConfigured ? 0 : 1);
