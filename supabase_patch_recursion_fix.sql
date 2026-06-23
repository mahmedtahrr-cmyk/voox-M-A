-- =============================================================
-- VOOX RLS RECURSION FIX PATCH
-- =============================================================
-- Run this file in the Supabase SQL Editor to fix the 500 Server Error
-- and the "infinite recursion" issues without deleting your data.
-- =============================================================

-- ==========================================
-- 1. HELPER FUNCTION TO PREVENT RLS RECURSION
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

-- ==========================================
-- 2. FIX PROFILES TABLE
-- ==========================================
drop policy if exists "Users can read own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Users can insert own profile" on profiles;
drop policy if exists "Admin can read all profiles" on profiles;
drop policy if exists "Admin can update all profiles" on profiles;
drop policy if exists "Admin can delete profiles" on profiles;

create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Admin can read all profiles" on profiles for select using (public.is_admin());
create policy "Admin can update all profiles" on profiles for update using (public.is_admin());
create policy "Admin can delete profiles" on profiles for delete using (public.is_admin());

-- ==========================================
-- 3. FIX ORDERS TABLE
-- ==========================================
drop policy if exists "Admin can read all orders" on orders;
drop policy if exists "Admin can update all orders" on orders;
drop policy if exists "Admin can delete orders" on orders;

create policy "Admin can read all orders" on orders for select using (public.is_admin());
create policy "Admin can update all orders" on orders for update using (public.is_admin());
create policy "Admin can delete orders" on orders for delete using (public.is_admin());

-- ==========================================
-- 4. FIX ORDER_ITEMS TABLE
-- ==========================================
drop policy if exists "Admin can read all order_items" on order_items;
drop policy if exists "Admin can update order_items" on order_items;
drop policy if exists "Admin can delete order_items" on order_items;

create policy "Admin can read all order_items" on order_items for select using (public.is_admin());
create policy "Admin can update order_items" on order_items for update using (public.is_admin());
create policy "Admin can delete order_items" on order_items for delete using (public.is_admin());

-- ==========================================
-- 5. FIX SHIPPING_ADDRESSES TABLE
-- ==========================================
drop policy if exists "Admin can read all shipping_addresses" on shipping_addresses;
drop policy if exists "Admin can update shipping_addresses" on shipping_addresses;
drop policy if exists "Admin can delete shipping_addresses" on shipping_addresses;

create policy "Admin can read all shipping_addresses" on shipping_addresses for select using (public.is_admin());
create policy "Admin can update shipping_addresses" on shipping_addresses for update using (public.is_admin());
create policy "Admin can delete shipping_addresses" on shipping_addresses for delete using (public.is_admin());

-- ==========================================
-- 6. FIX PRODUCTS TABLE
-- ==========================================
drop policy if exists "Admin can create products" on products;
drop policy if exists "Admin can update products" on products;
drop policy if exists "Admin can delete products" on products;

create policy "Admin can create products" on products for insert with check (public.is_admin());
create policy "Admin can update products" on products for update using (public.is_admin());
create policy "Admin can delete products" on products for delete using (public.is_admin());

-- ==========================================
-- 7. FIX CATEGORIES TABLE
-- ==========================================
drop policy if exists "Admin can create categories" on categories;
drop policy if exists "Admin can update categories" on categories;
drop policy if exists "Admin can delete categories" on categories;

create policy "Admin can create categories" on categories for insert with check (public.is_admin());
create policy "Admin can update categories" on categories for update using (public.is_admin());
create policy "Admin can delete categories" on categories for delete using (public.is_admin());

-- ==========================================
-- 8. FIX PRODUCT_IMAGES TABLE
-- ==========================================
drop policy if exists "Admin can create product_images" on product_images;
drop policy if exists "Admin can update product_images" on product_images;
drop policy if exists "Admin can delete product_images" on product_images;

create policy "Admin can create product_images" on product_images for insert with check (public.is_admin());
create policy "Admin can update product_images" on product_images for update using (public.is_admin());
create policy "Admin can delete product_images" on product_images for delete using (public.is_admin());

-- ==========================================
-- 9. FIX PRODUCT_SIZES TABLE
-- ==========================================
drop policy if exists "Admin can create product_sizes" on product_sizes;
drop policy if exists "Admin can update product_sizes" on product_sizes;
drop policy if exists "Admin can delete product_sizes" on product_sizes;

create policy "Admin can create product_sizes" on product_sizes for insert with check (public.is_admin());
create policy "Admin can update product_sizes" on product_sizes for update using (public.is_admin());
create policy "Admin can delete product_sizes" on product_sizes for delete using (public.is_admin());

-- ==========================================
-- 10. FIX PROMO_CODES TABLE
-- ==========================================
create table if not exists promo_codes (
    id uuid primary key default uuid_generate_v4(),
    code text not null unique,
    type text not null check (type in ('percentage', 'fixed')),
    value numeric(10, 2) not null,
    min_order_value numeric(10, 2) not null default 0.00,
    active boolean not null default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table promo_codes enable row level security;

drop policy if exists "Allow public read promo_codes" on promo_codes;
drop policy if exists "Admin can insert promo_codes" on promo_codes;
drop policy if exists "Admin can update promo_codes" on promo_codes;
drop policy if exists "Admin can delete promo_codes" on promo_codes;

create policy "Admin can insert promo_codes" on promo_codes for insert with check (public.is_admin());
create policy "Admin can update promo_codes" on promo_codes for update using (public.is_admin());
create policy "Admin can delete promo_codes" on promo_codes for delete using (public.is_admin());
