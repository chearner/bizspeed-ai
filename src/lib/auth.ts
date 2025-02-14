import { writable } from 'svelte/store';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export const user = writable<User | null>(null);

// Initialize user state
supabase.auth.getSession().then(({ data: { session } }) => {
  user.set(session?.user ?? null);
});

// Listen for auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  user.set(session?.user ?? null);
});