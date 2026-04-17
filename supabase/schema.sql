-- AIRA Platform – Supabase orders table
-- Run this in your Supabase SQL Editor

create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_no        text not null unique,
  event_date      date not null,
  customer_name   text not null,
  phone_number    text not null,
  city            text not null,
  address         text not null,
  event_type      text not null check (event_type in ('Birthday','Marriage','Housewarming','Others')),
  budget_min      numeric not null,
  budget_max      numeric not null,
  quantity_min    integer not null,
  quantity_max    integer not null,
  buffer          boolean not null default false,
  buffer_quantity integer,
  customization   boolean not null default false,
  item_category   text not null check (item_category in ('Lifestyle','Eatable','Accessories','Artifact','Toy','Combo','Others')),
  payment_mode    text not null check (payment_mode in ('Cash','UPI','Bank Transfer','Card','Cheque')),
  advance_payment numeric not null default 0,
  source          text not null check (source in ('Social Media','Website','Friends','Referral')),
  status          text not null default 'pending' check (status in ('pending','processing','completed','cancelled')),
  assigned_vendor uuid,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Row Level Security
alter table public.orders enable row level security;

-- Allow employees/admins to insert
create policy "Authenticated users can insert orders"
  on public.orders for insert
  to authenticated
  with check (true);

-- Allow authenticated users to read orders
create policy "Authenticated users can read orders"
  on public.orders for select
  to authenticated
  using (true);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_updated_at
  before update on public.orders
  for each row execute function update_updated_at();

-- Index for common queries
create index orders_status_idx on public.orders(status);
create index orders_created_at_idx on public.orders(created_at desc);
create index orders_customer_name_idx on public.orders(customer_name);
