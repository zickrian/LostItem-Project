/**
 * Script untuk memverifikasi environment variables
 * Jalankan: npm run verify-env
 */

// Load environment variables from .env.local
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
console.log(`📂 Looking for: ${envPath}\n`);

if (fs.existsSync(envPath)) {
  console.log('✅ .env.local found! Loading variables...\n');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  envContent.split(/\r?\n/).forEach((line, index) => {
    // Skip empty lines and comments
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    
    // Match KEY=VALUE pattern
    const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/i);
    if (match) {
      const key = match[1];
      const value = match[2];
      if (!process.env[key]) {
        process.env[key] = value;
        // Debug: uncomment to see what's being loaded
        // console.log(`  Loaded: ${key}=${value.substring(0, 20)}...`);
      }
    }
  });
} else {
  console.log('❌ .env.local file not found!');
  console.log('📝 Please create .env.local from .env.example\n');
}

const requiredServerEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
];

const requiredClientEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
];

const optionalEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'SUPABASE_SERVICE_ROLE_KEY',
];

console.log('🔍 Verifying Environment Variables...\n');

let hasError = false;

// Check required server-side variables
console.log('� Required Server-Side Variables (AMAN - tidak terekspos ke browser):');
requiredServerEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: ${value.substring(0, 30)}...`);
  } else {
    console.log(`  ❌ ${varName}: NOT FOUND`);
    hasError = true;
  }
});

// Check required client-side variables
console.log('\n🌐 Required Client-Side Variables (terekspos ke browser):');
requiredClientEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: ${value.substring(0, 30)}...`);
  } else {
    console.log(`  ❌ ${varName}: NOT FOUND`);
    hasError = true;
  }
});

console.log('\n📋 Optional Variables:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    const preview = varName.includes('SECRET') || varName.includes('SERVICE_ROLE') 
      ? '***HIDDEN***' 
      : value.substring(0, 30) + '...';
    console.log(`  ✅ ${varName}: ${preview}`);
  } else {
    console.log(`  ⚠️  ${varName}: NOT FOUND (optional)`);
  }
});

console.log('\n' + '='.repeat(50));

if (hasError) {
  console.log('\n❌ ERROR: Missing required environment variables!');
  console.log('\n📝 Steps to fix:');
  console.log('1. Copy .env.example to .env.local');
  console.log('2. Fill in your Supabase and Google OAuth credentials');
  console.log('3. Restart your development server\n');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are set!');
  console.log('✨ You can now run: npm run dev\n');
  process.exit(0);
}
