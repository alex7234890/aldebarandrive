import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  console.log('=== API RECUPERA FATTURA DEBUG ===');
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

    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ error: 'File path è richiesto nel body' });
    }

    // Scarica il file come Blob (replica esatta della tua chiamata originale)
    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from("fatture")
      .download(filePath);

    if (downloadError || !fileBlob) {
      console.error('Errore download fattura:', downloadError);
      return res.status(500).json({ 
        error: "Impossibile scaricare la fattura per allegarla.",
        details: process.env.NODE_ENV === 'development' ? downloadError?.message : undefined
      });
    }

    // Converte il Blob in base64 (replica esatta della tua logica originale)
    const arrayBuffer = await fileBlob.arrayBuffer();
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    return res.status(200).json({
      success: true,
      data: {
        base64String,
        fileBlob: fileBlob
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