'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AboFormPage() {
  const [form, setForm] = useState({
    zip_code: '',
    product_type: 'sack',
    min_quantity: '',
    max_price: '',
    manufacturer: '',
    certification: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('subscriptions').insert([
      {
        zip_code: form.zip_code,
        product_type: form.product_type,
        min_quantity: parseInt(form.min_quantity),
        max_price: parseFloat(form.max_price),
        manufacturer: form.manufacturer || null,
        certification: form.certification || null,
      },
    ]);

    if (error) {
      setMessage('❌ Fehler: ' + error.message);
    } else {
      setMessage('✅ Abo erfolgreich gespeichert!');
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Preisabo erstellen</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="zip_code" placeholder="PLZ (z. B. 83***)" value={form.zip_code} onChange={handleChange} className="w-full border p-2" required />
        <select name="product_type" value={form.product_type} onChange={handleChange} className="w-full border p-2">
          <option value="sack">Sackware</option>
          <option value="lose">Lose Ware</option>
        </select>
        <input type="number" name="min_quantity" placeholder="Mindestmenge (kg)" value={form.min_quantity} onChange={handleChange} className="w-full border p-2" required />
        <input type="number" name="max_price" placeholder="Maximalpreis (€/t)" value={form.max_price} onChange={handleChange} className="w-full border p-2" required />
        <input type="text" name="manufacturer" placeholder="Bevorzugter Hersteller (optional)" value={form.manufacturer} onChange={handleChange} className="w-full border p-2" />
        <input type="text" name="certification" placeholder="Zertifizierung (optional)" value={form.certification} onChange={handleChange} className="w-full border p-2" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Speichern</button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
