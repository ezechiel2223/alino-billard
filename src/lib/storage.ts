import { supabase, isSupabaseConfigured } from './supabase';

export async function uploadImage(file: File, folder = 'uploads'): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) {
    console.error(error);
    return null;
  }
  const { data } = supabase.storage.from('images').getPublicUrl(path);
  return data.publicUrl;
}
