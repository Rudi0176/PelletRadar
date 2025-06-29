export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      pellet_prices: {
        Row: {
          id: string;
          zip_code: string;
          manufacturer: string;
          product_type: string;
          quantity_kg: number;
          price_per_ton: number;
          certification: string | null;
          source: string;
          created_at: string;
        };
        Insert: {
          zip_code: string;
          manufacturer: string;
          product_type: string;
          quantity_kg: number;
          price_per_ton: number;
          certification?: string | null;
          source?: string;
        };
        Update: {
          zip_code?: string;
          manufacturer?: string;
          product_type?: string;
          quantity_kg?: number;
          price_per_ton?: number;
          certification?: string | null;
          source?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          zip_code: string;
          product_type: string;
          min_quantity: number;
          max_price: number;
          manufacturer: string | null;
          certification: string | null;
          created_at: string;
        };
        Insert: {
          zip_code: string;
          product_type: string;
          min_quantity: number;
          max_price: number;
          manufacturer?: string | null;
          certification?: string | null;
        };
        Update: {
          zip_code?: string;
          product_type?: string;
          min_quantity?: number;
          max_price?: number;
          manufacturer?: string | null;
          certification?: string | null;
        };
      };
    };
  };
}
