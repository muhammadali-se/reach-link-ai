/*
  # Update Posts Mode Constraint

  1. Changes
    - Update the mode column constraint to include 'fill' mode
    - This allows users to store posts that use the fill gaps feature

  2. Notes
    - Safely drops and recreates the constraint
    - No data loss as we're just adding an allowed value
*/

ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_mode_check;

ALTER TABLE posts ADD CONSTRAINT posts_mode_check CHECK (mode IN ('generate', 'optimize', 'fill'));