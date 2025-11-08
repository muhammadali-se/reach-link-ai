import { supabase } from '../lib/supabase';
import { FormData } from '../types';

export interface Post {
  id: string;
  user_id: string;
  mode: 'generate' | 'optimize' | 'fill';
  tone: 'neutral' | 'viral' | 'professional' | 'concise';
  original_input: string;
  generated_results: string[];
  created_at: string;
  updated_at: string;
}

export const savePost = async (
  formData: FormData,
  results: string[]
): Promise<{ data: Post | null; error: any }> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('User not authenticated') };
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      mode: formData.mode,
      tone: formData.tone,
      original_input: formData.input,
      generated_results: results,
    })
    .select()
    .maybeSingle();

  return { data, error };
};

export const getUserPosts = async (
  limit: number = 10,
  offset: number = 0
): Promise<{ data: Post[] | null; error: any }> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  return { data, error };
};

export const getPostById = async (
  id: string
): Promise<{ data: Post | null; error: any }> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  return { data, error };
};

export const deletePost = async (
  id: string
): Promise<{ error: any }> => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  return { error };
};

export const updatePost = async (
  id: string,
  updates: Partial<Pick<Post, 'original_input' | 'generated_results'>>
): Promise<{ data: Post | null; error: any }> => {
  const { data, error } = await supabase
    .from('posts')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  return { data, error };
};
