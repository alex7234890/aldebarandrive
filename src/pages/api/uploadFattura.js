import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  console.log('=== API UPLOAD FATTURA DEBUG ===');
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

    const { filePath, fileBase64 } = req.body;

    if (!filePath || !fileBase64) {
      return res.status(400).json({ error: 'File path e file base64 sono richiesti nel body' });
    }

    // Converti base64 in buffer
    const fileBuffer = Buffer.from(fileBase64, 'base64');

    // Upload su Supabase Storage (replica esatta della tua chiamata originale)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("fatture")
      .upload(filePath, fileBuffer, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error('Errore upload fattura:', uploadError);
      return res.status(500).json({ 
        error: `Errore durante il caricamento della fattura: ${uploadError.message}`,
        details: process.env.NODE_ENV === 'development' ? uploadError.message : undefined
      });
    }

    return res.status(200).json({
      success: true,
      data: uploadData,
    });

  } catch (error) {
    console.error('Errore server:', error);
    return res.status(500).json({
      error: 'Errore interno del server',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}