const { Client } = require("pg");

// Configuração de conexão com o PostgreSQL
// Conexão com o PostgreSQL utilizando a DATABASE_URL da Railway
const client = new Client({
  connectionString:
    "postgresql://postgres:oESeLpJeyViJWLrQeeLyotMHZjRwCuFB@junction.proxy.rlwy.net:51573/railway",
  ssl: {
    rejectUnauthorized: false, // Necessário para Railway, pois exige SSL em muitas conexões externas
  },
});

const createTables = async () => {
  try {
    await client.connect();
    console.log("Conectado ao banco de dados!");

    // Criação das tabelas e índices
    await client.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

            -- Tabela users
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT,
                password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Tabela domains
            CREATE TABLE IF NOT EXISTS domains (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID REFERENCES users(id),
                domain_name TEXT UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Tabela facebook_pixels
            CREATE TABLE IF NOT EXISTS facebook_pixels (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                domain_id UUID REFERENCES domains(id),
                pixel_id TEXT NOT NULL,
                api_token TEXT NOT NULL,
                test_tag TEXT,
                test_tag_active BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Tabela conversions
            CREATE TYPE scope_enum AS ENUM ('website', 'specific_page', 'regex');
            CREATE TYPE trigger_enum AS ENUM ('page_access', 'time_on_page', 'video_time', 'form_submit', 'click', 'view', 'hover', 'scroll');

            CREATE TABLE IF NOT EXISTS conversions (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                domain_id UUID REFERENCES domains(id),
                title TEXT NOT NULL,
                scope scope_enum NOT NULL,
                scope_value TEXT NOT NULL,
                trigger trigger_enum NOT NULL,
                trigger_value TEXT,
                event_name TEXT NOT NULL,
                product_name TEXT,
                product_id TEXT,
                offer_ids TEXT,
                product_value NUMERIC,
                currency TEXT DEFAULT 'BRL',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                active BOOLEAN DEFAULT true
            );

            -- Tabela leads
            CREATE TABLE IF NOT EXISTS leads (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                domain_id UUID REFERENCES domains(id),
                name TEXT NOT NULL,
                first_name TEXT,
                last_name TEXT,
                email TEXT,
                phone TEXT,
                ip INET,
                user_agent TEXT,
                city TEXT,
                state TEXT,
                zipcode TEXT,
                country_name TEXT,
                country_code TEXT,
                fbc TEXT,
                fbp TEXT,
                utm_source TEXT,
                utm_medium TEXT,
                utm_campaign TEXT,
                utm_id TEXT,
                utm_term TEXT,
                utm_content TEXT,
                first_utm_source TEXT,
                first_utm_medium TEXT,
                first_utm_campaign TEXT,
                first_utm_id TEXT,
                first_utm_term TEXT,
                first_utm_content TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Tabela events
            CREATE TABLE IF NOT EXISTS events (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                lead_id UUID REFERENCES leads(id),
                conversion_id UUID REFERENCES conversions(id),
                domain_id UUID REFERENCES domains(id),
                event_name TEXT NOT NULL,
                event_time TIMESTAMP NOT NULL,
                event_source_url TEXT NOT NULL,
                content_ids TEXT,
                currency TEXT,
                value NUMERIC,
                facebook_request JSONB,
                facebook_response JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Índices
            CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
            CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);
            CREATE INDEX IF NOT EXISTS idx_leads_domain_id ON leads(domain_id);
            CREATE INDEX IF NOT EXISTS idx_conversions_domain_id ON conversions(domain_id);
            CREATE INDEX IF NOT EXISTS idx_events