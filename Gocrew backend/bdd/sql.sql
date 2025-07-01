-- Database: gocrew

-- DROP DATABASE IF EXISTS gocrew;

CREATE DATABASE gocrew
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'French_France.1252'
    LC_CTYPE = 'French_France.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

 -- Utilisateurs

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    username TEXT,
    avatar_url TEXT,
    role TEXT CHECK (role IN ('owner', 'member', 'viewer')) DEFAULT 'member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	
 );


 -- Auth via Google ou autres fournisseurs
CREATE TABLE oauth_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    provider_user_id TEXT NOT NULL,
    UNIQUE(provider, provider_user_id)
);

-- Crew = groupe de voyage
CREATE TABLE crews (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    destination TEXT,
    budget NUMERIC,
    start_date DATE,
    end_date DATE,
    owner_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Participants dans un crew
CREATE TABLE crew_members (
    id SERIAL PRIMARY KEY,
    crew_id INTEGER REFERENCES crews(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('owner', 'member', 'viewer')) DEFAULT 'member',
    label TEXT, -- Ex: "Chef de la vaisselle"
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (crew_id, user_id)
);

-- Chat de groupe
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    crew_id INTEGER REFERENCES crews(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id),
    content TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Annonces publiques (ex: propositions de voyage)
CREATE TABLE travel_announcements (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    crew_id INTEGER REFERENCES crews(id),
    is_public BOOLEAN DEFAULT TRUE,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents (stockage sécurisé RGPD)
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    crew_id INTEGER REFERENCES crews(id),
    uploader_id INTEGER REFERENCES users(id),
    file_name TEXT,
    file_url TEXT,
    token TEXT, -- Token d’accès sécurisé
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tâches (kanban)
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    crew_id INTEGER REFERENCES crews(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('todo', 'doing', 'done')) DEFAULT 'todo',
    assigned_to INTEGER REFERENCES users(id),
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
