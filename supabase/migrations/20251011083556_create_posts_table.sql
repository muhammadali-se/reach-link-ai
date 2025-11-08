/*
  # Create Posts History Table

  1. New Tables
    - `posts`
      - `id` (uuid, primary key) - Unique identifier for each post
      - `user_id` (uuid) - Reference to auth.users
      - `mode` (text) - Mode used: 'generate' or 'optimize'
      - `tone` (text) - Tone selected: 'neutral', 'viral', 'professional', or 'concise'
      - `original_input` (text) - User's original input/topic
      - `generated_results` (jsonb) - Array of generated post variations
      - `created_at` (timestamptz) - Timestamp when post was created
      - `updated_at` (timestamptz) - Timestamp when post was last updated

  2. Security
    - Enable RLS on `posts` table
    - Add policy for users to read their own posts
    - Add policy for users to insert their own posts
    - Add policy for users to update their own posts
    - Add policy for users to delete their own posts

  3. Indexes
    - Index on `user_id` for faster queries
    - Index on `created_at` for sorting
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode text NOT NULL CHECK (mode IN ('generate', 'optimize')),
  tone text NOT NULL CHECK (tone IN ('neutral', 'viral', 'professional', 'concise')),
  original_input text NOT NULL,
  generated_results jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own posts"
  ON posts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts(user_id);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);