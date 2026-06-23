-- VOOX Futuristic 3D Fashion E-Commerce Database Schema
-- Run this script in the SQL Editor of your Supabase project (https://supabase.com) to create the tables.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create CATEGORIES Table
create table if not exists categories (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    slug text not null unique,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create PRODUCTS Table
create table if not exists products (
    id uuid primary key default uuid_generate_v4(),
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

-- 3. Create PRODUCT_IMAGES Table
create table if not exists product_images (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references products(id) on delete cascade not null,
    image_url text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create PRODUCT_SIZES Table
create table if not exists product_sizes (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references products(id) on delete cascade not null,
    size text not null,
    quantity integer not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(product_id, size)
);

-- 5. Create SHIPPING_ADDRESSES Table
create table if not exists shipping_addresses (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid, -- Can be linked to auth.users if logged in, or null for guests
    full_name text not null,
    phone text not null,
    phone2 text,
    governorate text not null,
    city text not null,
    address text not null,
    landmark text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5.5. Create PROMO_CODES Table
create table if not exists promo_codes (
    id uuid primary key default uuid_generate_v4(),
    code text not null unique,
    type text not null check (type in ('percentage', 'fixed')),
    value numeric(10, 2) not null,
    min_order_value numeric(10, 2) not null default 0.00,
    active boolean not null default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Create ORDERS Table
create table if not exists orders (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid, -- Can be linked to auth.users if logged in, or null for guests
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

-- 7. Create ORDER_ITEMS Table
create table if not exists order_items (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references orders(id) on delete cascade not null,
    product_id uuid references products(id) on delete set null,
    product_title text not null,
    size text not null,
    quantity integer not null default 1,
    price numeric(10, 2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- --- SEED DATA ---

-- Seed Categories
insert into categories (id, name, slug) values
('cccc1111-1111-4111-8111-111111111111', 'HOODIES', 'hoodies'),
('cccc2222-2222-4222-8222-222222222222', 'T-SHIRTS', 't-shirts'),
('cccc3333-3333-4333-8333-333333333333', 'JACKETS', 'jackets'),
('cccc4444-4444-4444-8444-444444444444', 'PANTS', 'pants'),
('cccc5555-5555-4555-8555-555555555555', 'ACCESSORIES', 'accessories')
on conflict (id) do nothing;

-- Seed Products
insert into products (id, title, slug, description, price, category_id, stock, gender, featured) values
('11111111-1111-4111-8111-111111111111', 'VOID HOODIE', 'void-hoodie', 'Cyberpunk oversized high-collar fleece-lined heavy cotton hoodie featuring matte tactical details, magnetic lock straps, and drop-shoulder ergonomic fit.', 1299.00, 'cccc1111-1111-4111-8111-111111111111', 12, 'unisex', true),
('22222222-2222-4222-8222-222222222222', 'GLITCH T-SHIRT', 'glitch-t-shirt', 'High-density techwear streetwear graphic tee on luxury combed cotton featuring luminescent soundwave glitch prints.', 899.00, 'cccc2222-2222-4222-8222-222222222222', 18, 'unisex', true),
('33333333-3333-4333-8333-333333333333', 'SHADOW HOODIE', 'shadow-hoodie', 'Our signature technical drop. Minimal sleek core print paired with active red neon circular light reflections and carbon-fiber panel lining.', 1499.00, 'cccc1111-1111-4111-8111-111111111111', 8, 'unisex', true),
('44444444-4444-4444-8444-444444444444', 'TECH JACKET', 'tech-jacket', 'Waterproof high-neck shell shell jacket engineered with carbon weave reinforcement, micro-crimped scarlet thermal linings, and magnetic quick-access pockets.', 1899.00, 'cccc3333-3333-4333-8333-333333333333', 6, 'unisex', true),
('55555555-5555-4555-8555-555555555555', 'CARGO PANTS', 'cargo-pants', 'Asymmetrical utility flight pants made of wear-resistant ripstop webbing with heavy buckles, crimson pull straps, and modular layout structures.', 1099.00, 'cccc4444-4444-4444-8444-444444444444', 14, 'unisex', true)
on conflict (id) do nothing;

-- Seed Product Images
insert into product_images (id, product_id, image_url) values
('11111111-1111-4111-8111-999999999991', '11111111-1111-4111-8111-111111111111', '/src/assets/images/void_hoodie_1779875252715.png'),
('22222222-2222-4222-8222-999999999991', '22222222-2222-4222-8222-222222222222', '/src/assets/images/glitch_tshirt_1779875272702.png'),
('33333333-3333-4333-8333-999999999991', '33333333-3333-4333-8333-333333333333', '/src/assets/images/hero_hoodie_1779875229508.png'),
('44444444-4444-4444-8444-999999999991', '44444444-4444-4444-8444-444444444444', '/src/assets/images/tech_jacket_1779875291017.png'),
('55555555-5555-4555-8555-999999999991', '55555555-5555-4555-8555-555555555555', '/src/assets/images/cargo_pants_1779875313014.png')
on conflict (id) do nothing;

-- Seed Product Sizes
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

-- --- SECURITY & ROW-LEVEL SECURITY (RLS) POLICIES ---
-- For a fast prototype/development, we can either disable RLS or enable public RLS policies.
-- Let's enable RLS on all tables and add public access policies so anyone can read/write during development.

alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_sizes enable row level security;
alter table shipping_addresses enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Policies for CATEGORIES (Anyone can read, Admin can write/delete - for development we allow anyone to insert/update too)
create policy "Allow public read categories" on categories for select using (true);
create policy "Allow public write categories" on categories for insert with check (true);
create policy "Allow public update categories" on categories for update using (true);
create policy "Allow public delete categories" on categories for delete using (true);

-- Policies for PRODUCTS
create policy "Allow public read products" on products for select using (true);
create policy "Allow public write products" on products for insert with check (true);
create policy "Allow public update products" on products for update using (true);
create policy "Allow public delete products" on products for delete using (true);

-- Policies for PRODUCT_IMAGES
create policy "Allow public read product_images" on product_images for select using (true);
create policy "Allow public write product_images" on product_images for insert with check (true);
create policy "Allow public update product_images" on product_images for update using (true);
create policy "Allow public delete product_images" on product_images for delete using (true);

-- Policies for PRODUCT_SIZES
create policy "Allow public read product_sizes" on product_sizes for select using (true);
create policy "Allow public write product_sizes" on product_sizes for insert with check (true);
create policy "Allow public update product_sizes" on product_sizes for update using (true);
create policy "Allow public delete product_sizes" on product_sizes for delete using (true);

-- Policies for SHIPPING_ADDRESSES
create policy "Allow public read shipping_addresses" on shipping_addresses for select using (true);
create policy "Allow public write shipping_addresses" on shipping_addresses for insert with check (true);
create policy "Allow public update shipping_addresses" on shipping_addresses for update using (true);
create policy "Allow public delete shipping_addresses" on shipping_addresses for delete using (true);

-- Policies for ORDERS
create policy "Allow public read orders" on orders for select using (true);
create policy "Allow public write orders" on orders for insert with check (true);
create policy "Allow public update orders" on orders for update using (true);
create policy "Allow public delete orders" on orders for delete using (true);

-- Policies for ORDER_ITEMS
create policy "Allow public read order_items" on order_items for select using (true);
create policy "Allow public write order_items" on order_items for insert with check (true);
create policy "Allow public update order_items" on order_items for update using (true);
create policy "Allow public delete order_items" on order_items for delete using (true);

-- 8. Policies for PROMO_CODES
alter table promo_codes enable row level security;
create policy "Allow public read promo_codes" on promo_codes for select using (true);
create policy "Allow public write promo_codes" on promo_codes for insert with check (true);
create policy "Allow public update promo_codes" on promo_codes for update using (true);
create policy "Allow public delete promo_codes" on promo_codes for delete using (true);
