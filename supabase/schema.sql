-- Alino Billard Accessoires — Supabase schema
-- Run this in the Supabase SQL editor.

create table if not exists settings (
  id int primary key default 1,
  whatsapp_number text not null default '237681504830',
  company_name text not null default 'Alino Billard Accessoires',
  address text not null default 'Carrefour Jouvence, Yaoundé, Cameroun',
  hero_title text not null default 'L''univers du billard à votre portée',
  hero_subtitle text not null default 'Tables, queues, accessoires et équipements professionnels de billard. Découvrez nos produits et contactez-nous directement sur WhatsApp.',
  contact_text text not null default 'Une question, un projet ou une commande ? Contactez-nous directement sur WhatsApp, nous vous répondons rapidement.',
  training_title text not null default 'Formation au billard',
  training_description text not null default 'Découvrez nos sessions de formation pour tous les niveaux.',
  training_image text,
  training_button_text text not null default 'Demander une formation',
  phone text,
  hours text,
  logo_url text,
  phone2 text
);

insert into settings (id) values (1) on conflict (id) do nothing;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null default 0,
  sale_price numeric,
  category text not null,
  image_url text,
  available boolean not null default true,
  badge text,
  created_at timestamptz not null default now()
);

create table if not exists promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price numeric,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists vertical_promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- RLS
alter table settings enable row level security;
alter table products enable row level security;
alter table promotions enable row level security;
alter table vertical_promotions enable row level security;

-- Public read
create policy "public read settings" on settings for select using (true);
create policy "public read products" on products for select using (true);
create policy "public read promotions" on promotions for select using (true);
create policy "public read vertical" on vertical_promotions for select using (true);

-- Authenticated write
create policy "auth write settings" on settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write products" on products for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write promotions" on promotions for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write vertical" on vertical_promotions for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage bucket (create manually in dashboard: 'images', public)
-- Then policies:
-- create policy "public read images" on storage.objects for select using (bucket_id = 'images');
-- create policy "auth upload images" on storage.objects for insert with check (bucket_id = 'images' and auth.role() = 'authenticated');
-- create policy "auth delete images" on storage.objects for delete using (bucket_id = 'images' and auth.role() = 'authenticated');
