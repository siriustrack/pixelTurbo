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

export interface Event {
  id?: string;
  lead_id?: string | null;
  conversion_id?: string | null;
  domain_id?: string | null;
  event_name: string;
  event_time: Date;
  event_source_url: string;
  content_ids?: string | null;
  currency?: string | null;
  value?: number | null;
  facebook_request?: object | null;
  facebook_response?: object | null;
  created_at?: Date;
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

export interface Lead {
  id?: string;
  domain_id?: string;
  name: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email: string | null;
  phone?: string | null;
  ip?: string | null;
  user_agent?: string | null;
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
