'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Papa, { ParseResult } from 'papaparse';

export default function UploadPage() {
  const [message, setMessage] = useState('');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: ParseResult<any>) => {
        const cleanedData = results.data.map((row) => ({
          zip_code: row.zip_code,
          manufacturer: row.manufacturer || null,
          product_type: row.product_type,
          quantity_kg: parseInt(row.quantity_kg),
          price_per_ton: parseFloat(row.price_per_ton),
          certification: row.certification || null,
          source: row.source || null,
        }));

        const { error } = await supabase.from('pellet_prices').insert(cleanedData);
        console.log('[SUPABASE ERROR]', error); // Fehleranzeige in der Dev-Console

        if (error) {
          setMessage('❌ Fehler beim Import: ' + (error.message || 'Unbekannter Fehler'));
        } else {
          setMessage('✅ CSV erfolgreich importiert!');
        }
      },
    });
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Pelletpreise (CSV) importieren</h1>
      <input type="file" accept=".csv" onChange={handleUpload} className="mb-4" />
      <p>{message}</p>
    </div>
  );
}

