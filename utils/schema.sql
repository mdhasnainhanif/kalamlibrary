-- Aligned with existing tables in Supabase:
-- Authors table: id, name_roman, name_urdu, bio, created_at
-- Kalams table: id, author_id, slug, primary_title_roman, primary_title_urdu, created_at

-- Create Authors Table (if not exists)
CREATE TABLE IF NOT EXISTS authors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_roman VARCHAR(255) NOT NULL,
    name_urdu VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Kalams Table (if not exists)
CREATE TABLE IF NOT EXISTS kalams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    primary_title_roman VARCHAR(255) NOT NULL,
    primary_title_urdu VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Kalam Translations Table for multiple languages (Urdu, Roman English, Hindi, Bangla)
CREATE TABLE IF NOT EXISTS kalam_translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    kalam_id UUID REFERENCES kalams(id) ON DELETE CASCADE,
    language VARCHAR(50) NOT NULL, -- 'urdu', 'roman_english', 'hindi', 'bangla'
    title VARCHAR(255) NOT NULL, -- Title in that specific language/script
    lyrics TEXT NOT NULL, -- Lyrics content
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(kalam_id, language)
);

-- Indexing for fast lookups
CREATE INDEX IF NOT EXISTS idx_kalams_slug ON kalams(slug);
CREATE INDEX IF NOT EXISTS idx_kalam_translations_kalam_id ON kalam_translations(kalam_id);
CREATE INDEX IF NOT EXISTS idx_kalam_translations_language ON kalam_translations(language);
CREATE INDEX IF NOT EXISTS idx_authors_slug ON kalams(slug);
