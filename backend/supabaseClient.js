const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://fpyvbjutsnskwfmjuaxe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZweXZianV0c25za3dmbWp1YXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMzU2OTMsImV4cCI6MjA4NTYxMTY5M30.cbAP6UNXpa_uR2ZWe_ADVA4NPDAu_XAgY4L7JbPh7Ps"
);

module.exports = supabase;