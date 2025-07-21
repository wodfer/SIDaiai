import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://mecrdveeocgjsmmigdzb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lY3JkdmVlb2NnanNtbWlnZHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzQzMTMsImV4cCI6MjA2ODMxMDMxM30.680kENo8XJW9LglpSuX-gKfvbhcJpAI9tQ1HI4Cdn1c';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };