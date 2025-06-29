import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data: subscriptions, error: subError } = await supabase
    .from('subscriptions')
    .select('*');

  if (subError) {
    return NextResponse.json(
      { error: 'Fehler beim Laden der Abos', details: subError.message },
      { status: 500 }
    );
  }

  const matches: any[] = [];

  for (const sub of subscriptions) {
    console.log('Vergleiche:', {
      zip: sub.zip_code,
      type: sub.product_type,
      minQty: sub.min_quantity,
      maxPrice: sub.max_price,
      manufacturer: sub.manufacturer,
      certification: sub.certification,
    });

    let query = supabase
      .from('pellet_prices')
      .select('*')
      .ilike('zip_code', `${sub.zip_code}%`)
      .eq('product_type', sub.product_type)
      .gte('quantity_kg', sub.min_quantity)
      .lte('price_per_ton', sub.max_price);

    if (sub.manufacturer) {
      query = query.eq('manufacturer', sub.manufacturer);
    }

    if (sub.certification) {
      query = query.eq('certification', sub.certification);
    }

    const { data: prices, error: priceError } = await query;

    console.log('Gefundene Preise:', prices); // Debug-Ausgabe

    if (priceError) {
      return NextResponse.json(
        { error: 'Fehler bei Preisvergleich', details: priceError.message },
        { status: 500 }
      );
    }

    matches.push({
      subscription: sub,
      foundPrices: prices?.length || 0,
      prices: prices || [],
    });
  }

  return NextResponse.json({ matches });
}
