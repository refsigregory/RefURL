export interface UrlAttributes {
  id: number;
  owner: number | null;
  original_url: string;
  short_code: string;
  title: string | null;
  clicks: number;
  created_at: Date;
  clicks_at: Date;
}

export interface UrlResponse {
  id: number;
  original_url: string;
  short_code: string;
  title: string | null;
  clicks: number;
  created_at: Date;
  clicks_at: Date;
}

export interface CreateUrlData {
  original_url: string;
  title?: string;
  owner_id?: number;
}
