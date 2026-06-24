-- =============================================================
-- VOOX123 - COMPLETE DATABASE MIGRATION
-- Run this ONCE in Supabase SQL Editor after creating the project
-- =============================================================

-- 0. Helper function to prevent RLS recursion
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 1. Create PROFILES Table (linked to auth.users)
create table if not exists profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null default 'VOOX OPERATIVE',
    email text,
    phone text,
    role text not null default 'customer' check (role in ('customer', 'admin')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table profiles enable row level security;

-- 2. Create CATEGORIES Table
create table if not exists categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create PRODUCTS Table
create table if not exists products (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text not null unique,
    description text,
    price numeric(10, 2) not null,
    discount_price numeric(10, 2),
    category_id uuid references categories(id) on delete set null,
    stock integer not null default 0,
    gender text not null default 'unisex',
    featured boolean not null default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create PRODUCT_IMAGES Table
create table if not exists product_images (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references products(id) on delete cascade not null,
    image_url text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create PRODUCT_SIZES Table
create table if not exists product_sizes (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references products(id) on delete cascade not null,
    size text not null,
    quantity integer not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(product_id, size)
);

-- 6. Create SHIPPING_ADDRESSES Table
create table if not exists shipping_addresses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid,
    full_name text not null,
    phone text not null,
    phone2 text,
    governorate text not null,
    city text not null,
    address text not null,
    landmark text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Create PROMO_CODES Table
create table if not exists promo_codes (
    id uuid primary key default gen_random_uuid(),
    code text not null unique,
    type text not null check (type in ('percentage', 'fixed')),
    value numeric(10, 2) not null,
    min_order_value numeric(10, 2) not null default 0.00,
    active boolean not null default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Create ORDERS Table
create table if not exists orders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid,
    shipping_address_id uuid references shipping_addresses(id) on delete set null,
    status text not null default 'pending',
    payment_method text not null default 'cash',
    subtotal numeric(10, 2) not null default 0.00,
    shipping_price numeric(10, 2) not null default 0.00,
    discount_amount numeric(10, 2) not null default 0.00,
    promo_code text,
    total_price numeric(10, 2) not null default 0.00,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Create ORDER_ITEMS Table
create table if not exists order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid references orders(id) on delete cascade not null,
    product_id uuid references products(id) on delete set null,
    product_title text not null,
    size text not null,
    quantity integer not null default 1,
    price numeric(10, 2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ========================
-- RLS POLICIES
-- ========================

alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_sizes enable row level security;
alter table shipping_addresses enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table promo_codes enable row level security;

-- PROFILES policies
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

-- CATEGORIES policies
drop policy if exists "Allow public read categories" on categories;
drop policy if exists "Admin can create categories" on categories;
drop policy if exists "Admin can update categories" on categories;
drop policy if exists "Admin can delete categories" on categories;

create policy "Allow public read categories" on categories for select using (true);
create policy "Admin can create categories" on categories for insert with check (public.is_admin());
create policy "Admin can update categories" on categories for update using (public.is_admin());
create policy "Admin can delete categories" on categories for delete using (public.is_admin());

-- PRODUCTS policies
drop policy if exists "Allow public read products" on products;
drop policy if exists "Admin can create products" on products;
drop policy if exists "Admin can update products" on products;
drop policy if exists "Admin can delete products" on products;

create policy "Allow public read products" on products for select using (true);
create policy "Admin can create products" on products for insert with check (public.is_admin());
create policy "Admin can update products" on products for update using (public.is_admin());
create policy "Admin can delete products" on products for delete using (public.is_admin());

-- PRODUCT_IMAGES policies
drop policy if exists "Allow public read product_images" on product_images;
drop policy if exists "Admin can create product_images" on product_images;
drop policy if exists "Admin can update product_images" on product_images;
drop policy if exists "Admin can delete product_images" on product_images;

create policy "Allow public read product_images" on product_images for select using (true);
create policy "Admin can create product_images" on product_images for insert with check (public.is_admin());
create policy "Admin can update product_images" on product_images for update using (public.is_admin());
create policy "Admin can delete product_images" on product_images for delete using (public.is_admin());

-- PRODUCT_SIZES policies
drop policy if exists "Allow public read product_sizes" on product_sizes;
drop policy if exists "Admin can create product_sizes" on product_sizes;
drop policy if exists "Admin can update product_sizes" on product_sizes;
drop policy if exists "Admin can delete product_sizes" on product_sizes;

create policy "Allow public read product_sizes" on product_sizes for select using (true);
create policy "Admin can create product_sizes" on product_sizes for insert with check (public.is_admin());
create policy "Admin can update product_sizes" on product_sizes for update using (public.is_admin());
create policy "Admin can delete product_sizes" on product_sizes for delete using (public.is_admin());

-- SHIPPING_ADDRESSES policies
drop policy if exists "Allow public read shipping_addresses" on shipping_addresses;
drop policy if exists "Admin can read all shipping_addresses" on shipping_addresses;
drop policy if exists "Admin can update shipping_addresses" on shipping_addresses;
drop policy if exists "Admin can delete shipping_addresses" on shipping_addresses;

create policy "Anyone can create shipping_addresses" on shipping_addresses for insert with check (true);
create policy "Users can read own shipping_addresses" on shipping_addresses for select using (user_id = auth.uid() or user_id is null);
create policy "Admin can read all shipping_addresses" on shipping_addresses for select using (public.is_admin());
create policy "Admin can update shipping_addresses" on shipping_addresses for update using (public.is_admin());
create policy "Admin can delete shipping_addresses" on shipping_addresses for delete using (public.is_admin());

-- ORDERS policies
drop policy if exists "Allow public read orders" on orders;
drop policy if exists "Allow public write orders" on orders;
drop policy if exists "Allow public update orders" on orders;
drop policy if exists "Allow public delete orders" on orders;
drop policy if exists "Admin can read all orders" on orders;
drop policy if exists "Admin can update all orders" on orders;
drop policy if exists "Admin can delete orders" on orders;

create policy "Anyone can create orders" on orders for insert with check (true);
create policy "Users can read own orders" on orders for select using (user_id = auth.uid() or user_id is null);
create policy "Admin can read all orders" on orders for select using (public.is_admin());
create policy "Admin can update all orders" on orders for update using (public.is_admin());
create policy "Admin can delete orders" on orders for delete using (public.is_admin());

-- ORDER_ITEMS policies
drop policy if exists "Allow public read order_items" on order_items;
drop policy if exists "Allow public write order_items" on order_items;
drop policy if exists "Allow public update order_items" on order_items;
drop policy if exists "Allow public delete order_items" on order_items;
drop policy if exists "Admin can read all order_items" on order_items;
drop policy if exists "Admin can update order_items" on order_items;
drop policy if exists "Admin can delete order_items" on order_items;

create policy "Anyone can create order_items" on order_items for insert with check (true);
create policy "Users can read own order_items" on order_items for select using (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or o.user_id is null)
    )
  );
create policy "Admin can read all order_items" on order_items for select using (public.is_admin());
create policy "Admin can update order_items" on order_items for update using (public.is_admin());
create policy "Admin can delete order_items" on order_items for delete using (public.is_admin());

-- PROMO_CODES policies
drop policy if exists "Allow public read promo_codes" on promo_codes;
drop policy if exists "Admin can insert promo_codes" on promo_codes;
drop policy if exists "Admin can update promo_codes" on promo_codes;
drop policy if exists "Admin can delete promo_codes" on promo_codes;

create policy "Allow public read promo_codes" on promo_codes for select using (true);
create policy "Admin can insert promo_codes" on promo_codes for insert with check (public.is_admin());
create policy "Admin can update promo_codes" on promo_codes for update using (public.is_admin());
create policy "Admin can delete promo_codes" on promo_codes for delete using (public.is_admin());

-- ========================
-- SEED DATA
-- ========================

insert into categories (id, name, slug) values
('cccc1111-1111-4111-8111-111111111111', 'HOODIES', 'hoodies'),
('cccc2222-2222-4222-8222-222222222222', 'T-SHIRTS', 't-shirts'),
('cccc3333-3333-4333-8333-333333333333', 'JACKETS', 'jackets'),
('cccc4444-4444-4444-8444-444444444444', 'PANTS', 'pants'),
('cccc5555-5555-4555-8555-555555555555', 'ACCESSORIES', 'accessories')
on conflict (id) do nothing;

insert into products (id, title, slug, description, price, category_id, stock, gender, featured) values
('11111111-1111-4111-8111-111111111111', 'VOID HOODIE', 'void-hoodie', 'Cyberpunk oversized high-collar fleece-lined heavy cotton hoodie featuring matte tactical details, magnetic lock straps, and drop-shoulder ergonomic fit.', 1299.00, 'cccc1111-1111-4111-8111-111111111111', 12, 'unisex', true),
('22222222-2222-4222-8222-222222222222', 'GLITCH T-SHIRT', 'glitch-t-shirt', 'High-density techwear streetwear graphic tee on luxury combed cotton featuring luminescent soundwave glitch prints.', 899.00, 'cccc2222-2222-4222-8222-222222222222', 18, 'unisex', true),
('33333333-3333-4333-8333-333333333333', 'SHADOW HOODIE', 'shadow-hoodie', 'Our signature technical drop. Minimal sleek core print paired with active red neon circular light reflections and carbon-fiber panel lining.', 1499.00, 'cccc1111-1111-4111-8111-111111111111', 8, 'unisex', true),
('44444444-4444-4444-8444-444444444444', 'TECH JACKET', 'tech-jacket', 'Waterproof high-neck shell shell jacket engineered with carbon weave reinforcement, micro-crimped scarlet thermal linings, and magnetic quick-access pockets.', 1899.00, 'cccc3333-3333-4333-8333-333333333333', 6, 'unisex', true),
('55555555-5555-4555-8555-555555555555', 'CARGO PANTS', 'cargo-pants', 'Asymmetrical utility flight pants made of wear-resistant ripstop webbing with heavy buckles, crimson pull straps, and modular layout structures.', 1099.00, 'cccc4444-4444-4444-8444-444444444444', 14, 'unisex', true)
on conflict (id) do nothing;

insert into product_images (id, product_id, image_url) values
('11111111-1111-4111-8111-999999999991', '11111111-1111-4111-8111-111111111111', '/images/void_hoodie_1779875252715.png'),
('22222222-2222-4222-8222-999999999991', '22222222-2222-4222-8222-222222222222', '/images/glitch_tshirt_1779875272702.png'),
('33333333-3333-4333-8333-999999999991', '33333333-3333-4333-8333-333333333333', '/images/hero_hoodie_1779875229508.png'),
('44444444-4444-4444-8444-999999999991', '44444444-4444-4444-8444-444444444444', '/images/tech_jacket_1779875291017.png'),
('55555555-5555-4555-8555-999999999991', '55555555-5555-4555-8555-555555555555', '/images/cargo_pants_1779875313014.png')
on conflict (id) do nothing;

insert into product_sizes (product_id, size, quantity) values
('11111111-1111-4111-8111-111111111111', 'S', 4),
('11111111-1111-4111-8111-111111111111', 'M', 5),
('11111111-1111-4111-8111-111111111111', 'L', 3),
('22222222-2222-4222-8222-222222222222', 'S', 6),
('22222222-2222-4222-8222-222222222222', 'M', 6),
('22222222-2222-4222-8222-222222222222', 'L', 6),
('33333333-3333-4333-8333-333333333333', 'M', 4),
('33333333-3333-4333-8333-333333333333', 'L', 3),
('33333333-3333-4333-8333-333333333333', 'XL', 1),
('44444444-4444-4444-8444-444444444444', 'S', 2),
('44444444-4444-4444-8444-444444444444', 'M', 2),
('44444444-4444-4444-8444-444444444444', 'L', 2),
('55555555-5555-4555-8555-555555555555', 'M', 5),
('55555555-5555-4555-8555-555555555555', 'L', 6),
('55555555-5555-4555-8555-555555555555', 'XL', 3)
on conflict (product_id, size) do nothing;
