import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  console.log('=== API RECUPERA DOCUMENTO DEBUG ===');
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

    const { documentPath } = req.body;

    if (!documentPath) {
      return res.status(400).json({ error: 'Document path è richiesto nel body' });
    }

    // Genera l'URL firmato per il documento
    const { data, error } = await supabase.storage
      .from("partecipanti")
      .createSignedUrl(documentPath, 3600); // URL valido per 1 ora

    if (error) {
      console.error('Errore nella generazione dell\'URL firmato:', error);
      return res.status(500).json({ 
        error: 'Errore nella generazione dell\'URL firmato',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        signedUrl: data.signedUrl
      },
    });

  } catch (error) {
    console.error('Errore server:', error);
    return res.status(500).json({
      error: 'Errore interno del server',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}