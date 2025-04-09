import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { createClient } from '@supabase/supabase-js';


export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from("users") // replace with your actual table name
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return data;
}
