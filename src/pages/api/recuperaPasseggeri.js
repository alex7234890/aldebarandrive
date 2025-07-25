// pages/api/recuperaPasseggeri.js

import { createClient } from '@supabase/supabase-js';
import { decrypt } from '@/lib/crypto';

export default async function handler(req, res) {
  console.log('=== API DEBUG ===');
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({ error: 'Configurazione Supabase mancante' });
    }

    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ error: 'Token non fornito' });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return res.status(401).json({ error: 'Utente non autenticato' });
    }

    const { eventId, guidatoreId } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: 'Event ID è richiesto nel body' });
    }

    let query = supabase
      .from('passeggero')
      .select('*')
      .eq('id_evento_fk', eventId);

    if (guidatoreId && guidatoreId !== 'null') {
      query = query.eq('id_guidatore_fk', guidatoreId);
    } else if (guidatoreId === null || guidatoreId === 'null') {
      query = query.is('id_guidatore_fk', null);
    }

    const { data: passeggeriData, error: passeggeriError } = await query;

    if (passeggeriError) {
      return res.status(500).json({ error: passeggeriError.message });
    }

    const decryptedPasseggeri = passeggeriData.map((passeggero) => {
      try {
        return {
          id: passeggero.id,
          nome: decrypt(passeggero.nome),
          cognome: decrypt(passeggero.cognome),
          data_nascita: decrypt(passeggero.data_nascita),
          codice_fiscale: decrypt(passeggero.codice_fiscale),
          indirizzo: decrypt(passeggero.indirizzo),
          indirizzo_email: decrypt(passeggero.indirizzo_email),
          telefono: decrypt(passeggero.telefono),
          intolleranze: passeggero.intolleranze ? decrypt(passeggero.intolleranze) : null,
          documento_fronte: passeggero.documento_fronte ? decrypt(passeggero.documento_fronte) : null,
          documento_retro: passeggero.documento_retro ? decrypt(passeggero.documento_retro) : null,
          verificato: passeggero.verificato,
        };
      } catch (err) {
        console.error(`Errore decrittazione passeggero ${passeggero.id}:`, err);
        return {
          id: passeggero.id,
          id_evento_fk: passeggero.id_evento_fk,
          id_guidatore_fk: passeggero.id_guidatore_fk,
          error: 'Errore nella decrittazione',
        };
      }
    });

    return res.status(200).json({
      success: true,
      data: decryptedPasseggeri,
    });

  } catch (error) {
    console.error('Errore server:', error);
    return res.status(500).json({
      error: 'Errore interno del server',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
