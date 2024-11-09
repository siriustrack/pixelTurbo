-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Domains table
CREATE TABLE IF NOT EXISTS domains (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  domain_name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Facebook Pixels table
CREATE TABLE IF NOT EXISTS facebook_pixels (
  id UUID PRIMARY KEY,
  domain_id UUID REFERENCES domains(id),
  pixel_id VARCHAR(255) NOT NULL,
  api_token TEXT NOT NULL,
  test_tag VARCHAR(255),
  test_tag_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversions table
CREATE TABLE IF NOT EXISTS conversions (
  id UUID PRIMARY KEY,
  domain_id UUID REFERENCES domains(id),
  title VARCHAR(255) NOT NULL,
  scope VARCHAR(50) NOT NULL,
  scope_value TEXT NOT NULL,
  trigger VARCHAR(50) NOT NULL,
  trigger_value TEXT,
  event_name VARCHAR(255) NOT NULL,
  product_name VARCHAR(255),
  product_id VARCHAR(255),
  offer_ids TEXT,
  product_value DECIMAL(10,2),
  currency VARCHAR(3),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT true
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY,
  domain_id UUID REFERENCES domains(id),
  name VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  ip VARCHAR(45),
  user_agent TEXT,
  city VARCHAR(255),
  state VARCHAR(255),
  zipcode VARCHAR(20),
  country_name VARCHAR(255),
  country_code VARCHAR(2),
  fbc TEXT,
  fbp TEXT,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_id VARCHAR(255),
  utm_term VARCHAR(255),
  utm_content TEXT,
  first_utm_source VARCHAR(255),
  first_utm_medium VARCHAR(255),
  first_utm_campaign VARCHAR(255),
  first_utm_id VARCHAR(255),
  first_utm_term VARCHAR(255),
  first_utm_content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  conversion_id UUID REFERENCES conversions(id),
  domain_id UUID REFERENCES domains(id),
  event_name VARCHAR(255) NOT NULL,
  event_time TIMESTAMP NOT NULL,
  event_source_url TEXT NOT NULL,
  content_ids TEXT,
  currency VARCHAR(3),
  value DECIMAL(10,2),
  facebook_request JSONB,
  facebook_response JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);