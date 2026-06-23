-- =============================================================
-- VOOX Admin Security & RLS Policies
-- Admin Account: mahmedtahrr@gmail.com  |  Password: mahmedtahrr
--
-- Run this AFTER supabase_schema.sql in the Supabase SQL Editor.
-- =============================================================

-- ==========================================
-- 0. HELPER FUNCTION TO PREVENT RLS RECURSION
-- ==========================================
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- ========================
-- 1. CREATE PROFILES TABLE
-- ========================
create table if not exists profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null default 'VOOX OPERATIVE',
    email text,
    phone text,
    role text not null default 'customer' check (role in ('customer', 'admin')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table profiles enable row level security;

-- ============================
-- 2. PROFILES TABLE - POLICIES
-- ============================

drop policy if exists "Users can read own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Users can insert own profile" on profiles;
drop policy if exists "Admin can read all profiles" on profiles;
drop policy if exists "Admin can update all profiles" on profiles;
drop policy if exists "Admin can delete profiles" on profiles;

-- Allow users to read their own profile
create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

-- Allow users to update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Allow inserting own profile (on signup)
create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Admin can read ALL profiles
create policy "Admin can read all profiles"
  on profiles for select
  using (public.is_admin());

-- Admin can update ALL profiles
create policy "Admin can update all profiles"
  on profiles for update
  using (public.is_admin());

-- Admin can delete profiles
create policy "Admin can delete profiles"
  on profiles for delete
  using (public.is_admin());

-- ============================
-- 3. ORDERS TABLE - POLICIES
-- (Drop public policies first, then add admin-based ones)
-- ============================

-- Drop existing overly-permissive order policies if they exist
drop policy if exists "Allow public read orders" on orders;
drop policy if exists "Allow public write orders" on orders;
drop policy if exists "Allow public update orders" on orders;
drop policy if exists "Allow public delete orders" on orders;

-- Anyone can place an order (insert)
create policy "Anyone can create orders"
  on orders for insert
  with check (true);

-- Users can view their own orders
create policy "Users can read own orders"
  on orders for select
  using (user_id = auth.uid() or user_id is null);

-- Admin can read ALL orders
create policy "Admin can read all orders"
  on orders for select
  using (public.is_admin());

-- Admin can update ALL orders (change status, etc.)
create policy "Admin can update all orders"
  on orders for update
  using (public.is_admin());

-- Admin can delete orders
create policy "Admin can delete orders"
  on orders for delete
  using (public.is_admin());

-- ================================
-- 4. ORDER_ITEMS TABLE - POLICIES
-- ================================

drop policy if exists "Allow public read order_items" on order_items;
drop policy if exists "Allow public write order_items" on order_items;
drop policy if exists "Allow public update order_items" on order_items;
drop policy if exists "Allow public delete order_items" on order_items;

-- Anyone can insert order items (they are part of an order)
create policy "Anyone can create order_items"
  on order_items for insert
  with check (true);

-- Allow reading own order_items (via order)
create policy "Users can read own order_items"
  on order_items for select
  using (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or o.user_id is null)
    )
  );

-- Admin can read ALL order_items
create policy "Admin can read all order_items"
  on order_items for select
  using (public.is_admin());

-- Admin can update order_items
create policy "Admin can update order_items"
  on order_items for update
  using (public.is_admin());

-- Admin can delete order_items
create policy "Admin can delete order_items"
  on order_items for delete
  using (public.is_admin());

-- ===================================
-- 5. SHIPPING_ADDRESSES - POLICIES
-- ===================================

drop policy if exists "Allow public read shipping_addresses" on shipping_addresses;
drop policy if exists "Allow public write shipping_addresses" on shipping_addresses;
drop policy if exists "Allow public update shipping_addresses" on shipping_addresses;
drop policy if exists "Allow public delete shipping_addresses" on shipping_addresses;

-- Anyone can insert shipping address (guests + users)
create policy "Anyone can create shipping_addresses"
  on shipping_addresses for insert
  with check (true);

-- Users can read their own shipping addresses
create policy "Users can read own shipping_addresses"
  on shipping_addresses for select
  using (user_id = auth.uid() or user_id is null);

-- Admin can read ALL shipping addresses
create policy "Admin can read all shipping_addresses"
  on shipping_addresses for select
  using (public.is_admin());

-- Admin can update shipping addresses
create policy "Admin can update shipping_addresses"
  on shipping_addresses for update
  using (public.is_admin());

-- Admin can delete shipping addresses
create policy "Admin can delete shipping_addresses"
  on shipping_addresses for delete
  using (public.is_admin());

-- ==================================
-- 6. PRODUCTS TABLE - POLICIES
-- ==================================

drop policy if exists "Allow public write products" on products;
drop policy if exists "Allow public update products" on products;
drop policy if exists "Allow public delete products" on products;

-- Keep public read
-- Anyone can read products (already exists from schema: "Allow public read products")

-- Only Admin can create products
create policy "Admin can create products"
  on products for insert
  with check (public.is_admin());

-- Only Admin can update products
create policy "Admin can update products"
  on products for update
  using (public.is_admin());

-- Only Admin can delete products
create policy "Admin can delete products"
  on products for delete
  using (public.is_admin());

-- ==================================
-- 7. CATEGORIES TABLE - POLICIES
-- ==================================

drop policy if exists "Allow public write categories" on categories;
drop policy if exists "Allow public update categories" on categories;
drop policy if exists "Allow public delete categories" on categories;

-- Only Admin can create categories
create policy "Admin can create categories"
  on categories for insert
  with check (public.is_admin());

-- Only Admin can update categories
create policy "Admin can update categories"
  on categories for update
  using (public.is_admin());

-- Only Admin can delete categories
create policy "Admin can delete categories"
  on categories for delete
  using (public.is_admin());

-- ===================================
-- 8. PRODUCT_IMAGES TABLE - POLICIES
-- ===================================

drop policy if exists "Allow public write product_images" on product_images;
drop policy if exists "Allow public update product_images" on product_images;
drop policy if exists "Allow public delete product_images" on product_images;

create policy "Admin can create product_images"
  on product_images for insert
  with check (public.is_admin());

create policy "Admin can update product_images"
  on product_images for update
  using (public.is_admin());

create policy "Admin can delete product_images"
  on product_images for delete
  using (public.is_admin());

-- ===================================
-- 9. PRODUCT_SIZES TABLE - POLICIES
-- ===================================

drop policy if exists "Allow public write product_sizes" on product_sizes;
drop policy if exists "Allow public update product_sizes" on product_sizes;
drop policy if exists "Allow public delete product_sizes" on product_sizes;

create policy "Admin can create product_sizes"
  on product_sizes for insert
  with check (public.is_admin());

create policy "Admin can update product_sizes"
  on product_sizes for update
  using (public.is_admin());

create policy "Admin can delete product_sizes"
  on product_sizes for delete
  using (public.is_admin());

-- ===================================
-- 9.5. PROMO_CODES TABLE - POLICIES
-- ===================================
alter table promo_codes enable row level security;

drop policy if exists "Allow public read promo_codes" on promo_codes;
drop policy if exists "Admin can insert promo_codes" on promo_codes;
drop policy if exists "Admin can update promo_codes" on promo_codes;
drop policy if exists "Admin can delete promo_codes" on promo_codes;

create policy "Allow public read promo_codes"
  on promo_codes for select
  using (true);

create policy "Admin can insert promo_codes"
  on promo_codes for insert
  with check (public.is_admin());

create policy "Admin can update promo_codes"
  on promo_codes for update
  using (public.is_admin());

create policy "Admin can delete promo_codes"
  on promo_codes for delete
  using (public.is_admin());

-- =====================================
-- 10. SEED THE ADMIN ACCOUNT IN PROFILES
-- =====================================
-- NOTE: Run this AFTER creating the auth user (mahmedtahrr@gmail.com) manually
-- in Supabase Dashboard → Authentication → Users → Add User
-- Then replace 'YOUR-ADMIN-UUID-HERE' with the actual UUID from the auth.users table.

-- insert into profiles (id, full_name, email, phone, role)
-- values (
--   'YOUR-ADMIN-UUID-HERE',
--   'ENG. Mohamed Taher',
--   'mahmedtahrr@gmail.com',
--   '01276812022',
--   'admin'
-- )
-- on conflict (id) do update set role = 'admin';

-- =====================================
-- QUICK SETUP GUIDE
-- =====================================
-- 1. Run supabase_schema.sql first (creates tables + seeds data)
-- 2. Run this file (supabase_admin_rls.sql) to apply admin-level RLS
-- 3. Go to Supabase Dashboard → Authentication → Users
--    → Click "Add User" → email: mahmedtahrr@gmail.com | password: mahmedtahrr
-- 4. Copy the UUID of that new user
-- 5. Uncomment and run the INSERT above with the real UUID
-- 6. Done! Login with mahmedtahrr@gmail.com / mahmedtahrr to access admin panel
