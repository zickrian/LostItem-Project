-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create users table
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  auth_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text unique not null,
  avatar_url text,
  role varchar(20) default 'student',
  created_at timestamp with time zone default now(),
  last_login timestamp with time zone default now()
);

-- Create unique index on email
create unique index if not exists users_email_idx on public.users(email);
create index if not exists users_auth_id_idx on public.users(auth_id);

-- Create reports table
create table if not exists public.reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  title text not null,
  description text,
  category varchar(50),
  type varchar(10) not null check (type in ('hilang','temuan')),
  image_url text,
  status varchar(20) default 'aktif' check (status in ('aktif', 'selesai')),
  location text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes for reports
create index if not exists reports_user_idx on public.reports(user_id);
create index if not exists reports_category_idx on public.reports(category);
create index if not exists reports_type_idx on public.reports(type);
create index if not exists reports_status_idx on public.reports(status);
create index if not exists reports_created_at_idx on public.reports(created_at desc);

-- Create comments table
create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  report_id uuid references public.reports(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Create indexes for comments
create index if not exists comments_report_idx on public.comments(report_id);
create index if not exists comments_user_idx on public.comments(user_id);
create index if not exists comments_created_at_idx on public.comments(created_at);

-- Create notifications table
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade unique,
  email_notif boolean default true,
  web_notif boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create index for notifications
create index if not exists notifications_user_idx on public.notifications(user_id);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.reports enable row level security;
alter table public.comments enable row level security;
alter table public.notifications enable row level security;

-- RLS Policies for users table
create policy "Users can view all profiles" on public.users
  for select using (true);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = auth_id);

create policy "Users can delete own profile" on public.users
  for delete using (auth.uid() = auth_id);

-- RLS Policies for reports table
create policy "Anyone can view reports" on public.reports
  for select using (true);

create policy "Authenticated users can create reports" on public.reports
  for insert with check (auth.uid() is not null);

create policy "Users can update own reports" on public.reports
  for update using (auth.uid() = (select auth_id from public.users where id = user_id));

create policy "Users can delete own reports" on public.reports
  for delete using (auth.uid() = (select auth_id from public.users where id = user_id));

-- RLS Policies for comments table
create policy "Anyone can view comments" on public.comments
  for select using (true);

create policy "Authenticated users can create comments" on public.comments
  for insert with check (auth.uid() is not null);

create policy "Users can update own comments" on public.comments
  for update using (auth.uid() = (select auth_id from public.users where id = user_id));

create policy "Users can delete own comments" on public.comments
  for delete using (auth.uid() = (select auth_id from public.users where id = user_id));

-- RLS Policies for notifications table
create policy "Users can view own notifications" on public.notifications
  for select using (auth.uid() = (select auth_id from public.users where id = user_id));

create policy "Users can update own notifications" on public.notifications
  for update using (auth.uid() = (select auth_id from public.users where id = user_id));

create policy "Authenticated users can insert notifications" on public.notifications
  for insert with check (auth.uid() is not null);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for reports updated_at
create trigger update_reports_updated_at before update on public.reports
  for each row execute function update_updated_at_column();

-- Trigger for notifications updated_at
create trigger update_notifications_updated_at before update on public.notifications
  for each row execute function update_updated_at_column();
