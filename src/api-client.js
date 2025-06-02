import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://afdjdcimdzvkaajjbogr.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmZGpkY2ltZHp2a2Fhampib2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTM3NTEsImV4cCI6MjA2MzIyOTc1MX0.znQ2LIAxgaEC2Y6gUVe3Wgrbjg7qnqdl-9snWrZ-P-0";
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;