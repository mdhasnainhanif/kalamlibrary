const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load env variables manually from .env.local
const envLocalPath = path.join(__dirname, '../.env.local');
const envPath = path.join(__dirname, '../.env');

const loadEnv = (filePath) => {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf-8');
  const env = {};
  content.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, val] = line.split('=', 2);
      env[key.trim()] = val.trim().replace(/^['"]|['"]$/g, '');
    }
  });
  return env;
};

const env = { ...loadEnv(envPath), ...loadEnv(envLocalPath) };

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Service Key Exists:", !!supabaseServiceKey);
if (supabaseServiceKey) {
  console.log("First 10 chars of Service Key:", supabaseServiceKey.substring(0, 10));
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testInsert() {
  const { error } = await supabaseAdmin
    .from('contact_submissions')
    .insert({
      name: 'Test Admin',
      email: 'test@admin.com',
      subject: 'Test Subject',
      message: 'Test Message'
    });
  
  if (error) {
    console.error("Test insert failed with error:", error);
  } else {
    console.log("Test insert succeeded!");
  }
}

testInsert();
