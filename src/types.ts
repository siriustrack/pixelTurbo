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

type Nullable<T> = T | null;

export type Lead = {
  id: string; // UUID
  domain_id: Nullable<string>;
  name: Nullable<string>;
  first_name: Nullable<string>;
  last_name: Nullable<string>;
  email: Nullable<string>;
  phone: Nullable<string>;
  ip: Nullable<string>;
  user_agent: Nullable<string>;
  city: Nullable<string>;
  state: Nullable<string>;
  zipcode: Nullable<string>;
  country_name: Nullable<string>;
  country_code: Nullable<string>;
  first_fbc: Nullable<string>;
  fbc: Nullable<string>;
  fbp: Nullable<string>;
  utm_source: Nullable<string>;
  utm_medium: Nullable<string>;
  utm_campaign: Nullable<string>;
  utm_id: Nullable<string>;
  utm_term: Nullable<string>;
  utm_content: Nullable<string>;
  first_utm_source: Nullable<string>;
  first_utm_medium: Nullable<string>;
  first_utm_campaign: Nullable<string>;
  first_utm_id: Nullable<string>;
  first_utm_term: Nullable<string>;
  first_utm_content: Nullable<string>;
  gender: Nullable<string>;
  dob: Nullable<string>; // Assuming dob is a string representation of date
  external_id: Nullable<string>;
  created_at: Date; // DateTime
  updated_at: Date; // DateTime
};

export type Event = {
  id: string; // UUID
  event_id: string;
  lead_id: Nullable<string>;
  event_name: string;
  event_time: Date; // DateTime
  event_url: Nullable<string>;
  page_id: Nullable<string>;
  page_title: Nullable<string>;
  product_id: Nullable<string>;
  product_name: Nullable<string>;
  product_value: Nullable<number>;
  predicted_ltv: Nullable<number>;
  offer_ids: Nullable<string>;
  content_name: Nullable<string>;
  traffic_source: Nullable<string>;
  utm_source: Nullable<string>;
  utm_medium: Nullable<string>;
  utm_campaign: Nullable<string>;
  utm_id: Nullable<string>;
  utm_term: Nullable<string>;
  utm_content: Nullable<string>;
  src: Nullable<string>;
  sck: Nullable<string>;
  geo_ip: Nullable<string>;
  geo_device: Nullable<string>;
  geo_country: Nullable<string>;
  geo_state: Nullable<string>;
  geo_city: Nullable<string>;
  geo_zipcode: Nullable<string>;
  geo_currency: Nullable<string>;
  first_fbc: Nullable<string>;
  fbc: Nullable<string>;
  fbp: Nullable<string>;
  domain_id: Nullable<string>;
  content_ids: Nullable<string>;
  currency: Nullable<string>;
  value: Nullable<number>;
  facebook_request: Nullable<string>;
  facebook_response: Nullable<string>;
  created_at: Date; // DateTime
};

// Common value types used across different objects
type DeliveryCategory = "home_delivery" | "in_store" | "curbside";
type ContentCategory =
  | "fashion"
  | "beauty"
  | "electronics"
  | "home"
  | "food"
  | string;
type CustomDataArray = Array<{
  value: number;
  currency: string;
}>;

// Server event user data parameters
interface ServerEventUserData {
  em?: string[]; // Email addresses, hashed
  ph?: string[]; // Phone numbers, hashed
  ge?: string; // Gender, in lowercase: 'f' or 'm'
  db?: string; // Date of birth (YYYYMMDD)
  ln?: string; // Last name, hashed
  fn?: string; // First name, hashed
  ct?: string; // City, hashed
  st?: string; // State/province, hashed
  zp?: string; // Zip/postal code, hashed
  country?: string; // Country, hashed
  external_id?: string; // Any unique ID from the advertiser
  client_ip_address?: string; // IPv4 or IPv6 address
  client_user_agent?: string; // Browser user agent
  fbc?: string; // Facebook click ID
  fbp?: string; // Facebook browser ID
  subscription_id?: string; // Subscription ID
  fb_login_id?: string; // Facebook login ID
  lead_id?: string; // Lead ID
  f5first?: string; // First 5 characters of the first name, hashed
  f5last?: string; // First 5 characters of the last name, hashed
  fi?: string; // First initial, hashed
  dobd?: string; // Date of birth day (DD)
  dobm?: string; // Date of birth month (MM)
  doby?: string; // Date of birth year (YYYY)
}

// Custom data parameters
interface CustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: ContentCategory;
  content_ids?: string[];
  content_type?: string;
  contents?: Array<{
    id: string;
    quantity: number;
    delivery_category?: DeliveryCategory;
  }>;
  delivery_category?: DeliveryCategory;
  order_id?: string;
  predicted_ltv?: number;
  num_items?: number;
  status?: string;
  search_string?: string;
  custom_properties?: Record<string, string | number | boolean>;
  shipping_contact?: {
    first_name?: string;
    last_name?: string;
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    email?: string;
    phone?: string;
  };
  billing_contact?: {
    first_name?: string;
    last_name?: string;
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    email?: string;
    phone?: string;
  };
  external_order_id?: string;
  original_order_id?: string;
  message?: string;
}

// Server event data parameters
interface ServerEvent {
  event_name: string;
  event_time: number;
  event_source_url?: string;
  event_id?: string;
  action_source:
    | "website"
    | "mobile_app"
    | "phone_call"
    | "email"
    | "chat"
    | "physical_store"
    | "system_generated"
    | "other";
  user_data: ServerEventUserData;
  custom_data?: CustomData;
  opt_out?: boolean;
  data_processing_options?: string[];
  data_processing_options_country?: number;
  data_processing_options_state?: number;
}

// Main type for the Conversion API request
interface ConversionApiRequest {
  data: ServerEvent[];
  test_event_code?: string;
  partner_agent?: string;
  namespace_id?: string;
  upload_id?: string;
  upload_tag?: string;
  upload_source?: string;
}

export type {
  DeliveryCategory,
  ContentCategory,
  CustomDataArray,
  ServerEventUserData,
  CustomData,
  ServerEvent,
  ConversionApiRequest,
};
