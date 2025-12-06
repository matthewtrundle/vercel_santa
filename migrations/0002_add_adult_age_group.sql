-- Add 'adult' value to age_group enum
ALTER TYPE "age_group" ADD VALUE IF NOT EXISTS 'adult';
