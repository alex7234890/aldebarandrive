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

    // Leggi il token dall'header Authorization
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

    // Verifica che la sessione sia valida
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return res.status(401).json({ error: 'Utente non autenticato' });
    }

    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: 'Event ID è richiesto nel body' });
    }

    const { data: guidatoriData, error: guidatoriError } = await supabase
      .from('guidatore')
      .select('*')
      .eq('id_evento_fk', eventId);

    if (guidatoriError) {
      return res.status(500).json({ error: guidatoriError.message });
    }

    const decryptedGuidatori = guidatoriData.map((guidatore) => {
      try {
        return {
            id: guidatore.id,
            nome: decrypt(guidatore.nome),
            cognome: decrypt(guidatore.cognome),
            telefono: decrypt(guidatore.telefono),
            indirizzo_email:decrypt(guidatore.indirizzo_email),
            codice_fiscale:decrypt(guidatore.codice_fiscale),
            data_nascita:decrypt(guidatore.data_nascita),
            quota: guidatore.quota,
            Patente: decrypt(guidatore.Patente),
            PatenteS: decrypt(guidatore.PatenteS),
            indirizzo: decrypt(guidatore.indirizzo),
            documento_fronte: decrypt(guidatore.documento_fronte),
            documento_retro: decrypt(guidatore.documento_retro),
            verificato: guidatore.verificato,
        };
      } catch (err) {
        console.error(`Errore decrittazione guidatore ${guidatore.id}:`, err);
        return {
          id: guidatore.id,
          error: 'Errore nella decrittazione',
          id_evento_fk: guidatore.id_evento_fk,
        };
      }
    });

    return res.status(200).json({
      success: true,
      data: decryptedGuidatori,
    });

  } catch (error) {
    console.error('Errore server:', error);
    return res.status(500).json({
      error: 'Errore interno del server',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
