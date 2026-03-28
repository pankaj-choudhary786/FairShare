-- schema.sql
-- Run this securely in your Supabase SQL Editor to generate the tables

-- Create custom enum types
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'lapsed');
CREATE TYPE plan_tier AS ENUM ('monthly', 'yearly');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');

-- 1. Charities Table
CREATE TABLE public.charities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Profiles Table (extends auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    is_admin BOOLEAN DEFAULT false,
    status subscription_status DEFAULT 'inactive',
    plan plan_tier,
    charity_id UUID REFERENCES public.charities(id),
    charity_percentage INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Scores Table
CREATE TABLE public.scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
    played_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Draws Table
CREATE TABLE public.draws (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    month_name TEXT NOT NULL,
    winning_numbers INTEGER[] NOT NULL,
    prize_pool DECIMAL,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Verifications Table
CREATE TABLE public.verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE NOT NULL,
    proof_image_url TEXT,
    match_tier TEXT,
    prize_amount DECIMAL,
    status verification_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

-- Basic Policies
-- Charities: readable by everyone
CREATE POLICY "Charities are viewable by everyone" ON public.charities FOR SELECT USING (true);

-- Profiles: readable by self or admin, updatable by self or admin
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Scores: readable/insertable by self
CREATE POLICY "Users can insert own scores" ON public.scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own scores" ON public.scores FOR SELECT USING (auth.uid() = user_id);

-- Draws: readable by everyone
CREATE POLICY "Draws are viewable by everyone" ON public.draws FOR SELECT USING (true);

-- Verifications: readable/insertable by self
CREATE POLICY "Users can view own verifications" ON public.verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own verifications" ON public.verifications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert Mock Charities automatically
INSERT INTO public.charities (name, category, description, is_featured, image_url) VALUES 
('The Golf Foundation', 'Grassroots', 'Making golf accessible to young people from all backgrounds by supplying equipment and professional coaching to schools.', true, 'https://images.unsplash.com/photo-1593111774640-36f9f06168af?w=800&q=80'),
('Macmillan Cancer Support', 'Health', 'Providing physical, financial and emotional support for people living with cancer.', false, 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80'),
('Mind', 'Health', 'Supporting individuals experiencing mental health problems and campaigning to improve services and promote understanding.', false, 'https://images.unsplash.com/photo-1527525443983-6e60c75fff50?w=800&q=80');
