-- Migration: Add images jsonb array to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS images jsonb DEFAULT '[]'::jsonb;
