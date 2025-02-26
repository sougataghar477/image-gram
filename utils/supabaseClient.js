import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jrmntldlwbuaaufewyqk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpybW50bGRsd2J1YWF1ZmV3eXFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDU4ODY3MCwiZXhwIjoyMDU2MTY0NjcwfQ.nhxjeg25x1yrIShKuKgYsURFwIfDFCIXeSLFvBeJlkQ";

export const supabase = createClient(supabaseUrl, supabaseKey);
