// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ctzzjfasmnimbskpphuy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0enpqZmFzbW5pbWJza3BwaHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyMjk4NjIsImV4cCI6MjA2MzgwNTg2Mn0.0l7Nb0sbw_o8UdO7IKk4ip-DjJ06YqRho1qdpNdMBKs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);