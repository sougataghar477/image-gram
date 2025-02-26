import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ornbkcmfdspkotoisljh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ybmJrY21mZHNwa290b2lzbGpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDMyMjMwOSwiZXhwIjoyMDU1ODk4MzA5fQ.P0JETFP6EVJruAvM98mjHWhJBKpgwZN2tenezeHRorg";

export const supabase = createClient(supabaseUrl, supabaseKey);
