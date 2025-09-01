import { createClient } from '@supabase/supabase-js';

// Reemplaza con tus credenciales de Supabase
const supabaseUrl = "https://goxmcxcwlwwuenotdjtn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdveG1jeGN3bHd3dWVub3RkanRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3ODY5NTQsImV4cCI6MjA3MDM2Mjk1NH0.pMZhiDqoSalL90TrR4gP3DRSS81YCjACDOzXb9etmnw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
