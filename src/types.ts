export type Scope = "website" | "specific_page" | "regex";

export type Trigger =
  | "page_access"
  | "time_on_page"
  | "video_time"
  | "form_submit"
  | "click"
  | "view"
  | "hover"
  | "scroll";

export interface Conversion {
  id?: string;
  domain_id?: string | null;
  title: string;
  scope: Scope;
  scope_value: string;
  trigger: Trigger;
  trigger_value?: string | null;
  event_name: string;
  product_name?: string | null;
  product_id?: string | null;
  offer_ids?: string | null;
  product_value?: number | null;
  currency?: string | null;
  created_at?: Date;
  updated_at?: Date;
  active?: boolean;
}

export interface Domain {
  id?: string;
  user_id: string | null;
  domain_name: string;
  created_at?: Date;
  updated_at?: Date;
  is_validated?: boolean;
}
export interface FacebookPixel {
  id?: string;
  domain_id?: string | null;
  pixel_id: string;
  api_token: string;
  test_tag?: string | null;
  test_tag_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Event {
  id?: string; // Corresponde a id na tabela SQL
  event_id: string; // Corresponde a event_id na tabela SQL
  lead_id?: string | null; // Corresponde a lead_id na tabela SQL
  event_name: string; // Corresponde a event_name na tabela SQL
  event_time: Date; // Corresponde a event_time na tabela SQL
  event_url?: string | null; // Corresponde a event_url na tabela SQL
  page_id?: string | null; // Corresponde a page_id na tabela SQL
  page_title?: string | null; // Corresponde a page_title na tabela SQL
  product_id?: string | null; // Corresponde a product_id na tabela SQL
  product_name?: string | null; // Corresponde a product_name na tabela SQL
  product_value?: number | null; // Corresponde a product_value na tabela SQL
  predicted_ltv?: number | null; // Corresponde a predicted_ltv na tabela SQL
  offer_ids?: string | null; // Corresponde a offer_ids na tabela SQL
  content_name?: string | null; // Corresponde a content_name na tabela SQL
  traffic_source?: string | null; // Corresponde a traffic_source na tabela SQL
  utm_source?: string | null; // Corresponde a utm_source na tabela SQL
  utm_medium?: string | null; // Corresponde a utm_medium na tabela SQL
  utm_campaign?: string | null; // Corresponde a utm_campaign na tabela SQL
  utm_id?: string | null; // Corresponde a utm_id na tabela SQL
  utm_term?: string | null; // Corresponde a utm_term na tabela SQL
  utm_content?: string | null; // Corresponde a utm_content na tabela SQL
  src?: string | null; // Corresponde a src na tabela SQL
  sck?: string | null; // Corresponde a sck na tabela SQL
  geo_ip?: string | null; // Corresponde a geo_ip na tabela SQL
  geo_device?: string | null; // Corresponde a geo_device na tabela SQL
  geo_country?: string | null; // Corresponde a geo_country na tabela SQL
  geo_state?: string | null; // Corresponde a geo_state na tabela SQL
  geo_city?: string | null; // Corresponde a geo_city na tabela SQL
  geo_zipcode?: string | null; // Corresponde a geo_zipcode na tabela SQL
  geo_currency?: string | null; // Corresponde a geo_currency na tabela SQL
  fbc?: string | null; // Corresponde a fbc na tabela SQL
  fbp?: string | null; // Corresponde a fbp na tabela SQL
  domain_id?: string | null; // Campo adicional, já presente no seu objeto
  content_ids?: string | null; // Campo adicional, já presente no seu objeto
  currency?: string | null; // Corresponde a geo_currency na tabela SQL, mas pode ser mantido separado se necessário
  value?: number | null; // Pode ser mapeado para product_value ou usado separadamente
  facebook_request?: object | null; // Campo adicional, já presente no seu objeto
  facebook_response?: object | null; // Campo adicional, já presente no seu objeto
  created_at?: Date; // Campo adicional, já presente no seu objeto
}

export interface Lead {
  id?: string;
  domain_id?: string;
  name: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email: string | null;
  phone?: string | null;
  ip?: string | null; // usar como client_ip_address na chave da api do meta
  user_agent?: string | null; // usar como client_user_agent na chave da api do meta
  city?: string | null;
  state?: string | null;
  zipcode?: string | null;
  country_name?: string | null;
  country_code?: string | null;
  fbc?: string | null;
  fbp?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_id?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  first_utm_source?: string | null;
  first_utm_medium?: string | null;
  first_utm_campaign?: string | null;
  first_utm_id?: string | null;
  first_utm_term?: string | null;
  first_utm_content?: string | null;
  gender?: string | null; // Adicionado para corresponder ao gênero
  dob?: string | null; // Adicionado para a data de nascimento no formato YYYYMMDD
  external_id?: string | null; // Adicionado para um ID único de usuário
  created_at?: Date;
  updated_at?: Date;
}
