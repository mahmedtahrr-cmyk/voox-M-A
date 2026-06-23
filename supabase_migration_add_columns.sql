-- =============================================================
-- VOOX DATABASE MIGRATION - Add missing columns to orders table
-- Run this in the Supabase SQL Editor
-- =============================================================

-- Add missing columns to orders table (safe with IF NOT EXISTS)
alter table orders
  add column if not exists subtotal numeric(10, 2) not null default 0.00,
  add column if not exists shipping_price numeric(10, 2) not null default 0.00,
  add column if not exists discount_amount numeric(10, 2) not null default 0.00,
  add column if not exists promo_code text,
  add column if not exists notes text;

-- Also ensure shipping_addresses has all needed columns
alter table shipping_addresses
  add column if not exists phone2 text,
  add column if not exists governorate text,  
  add column if not exists city text,
  add column if not exists address text,
  add column if not exists landmark text;

-- Confirm
select column_name, data_type
from information_schema.columns
where table_name = 'orders'
order by ordinal_position;
