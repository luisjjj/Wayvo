-- Migration 002: Make phone nullable for email auth users
-- Run this AFTER 001_initial_schema.sql

ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;
