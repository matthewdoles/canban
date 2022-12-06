import { createClient } from '@supabase/supabase-js';

const url = process.env.REACT_APP_SUPABASE_URL as string;
const key = process.env.REACT_APP_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, key);
