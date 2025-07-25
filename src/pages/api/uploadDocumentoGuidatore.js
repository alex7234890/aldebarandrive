import { supabase } from "@/lib/supabaseClient";
import crypto from 'crypto';


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { codiceFiscale, documentoFronte, documentoRetro } = req.body;

    if (!codiceFiscale) {
      return res.status(400).json({ error: "Codice fiscale mancante" });
    }

    if (!documentoFronte || !documentoRetro) {
      return res.status(400).json({ error: "Documenti mancanti" });
    }

    let guidatoreFrontePath = null;
    let guidatoreRetroPath = null;

    // Upload documento fronte
    if (documentoFronte) {

      const estensioneFronte = documentoFronte.name.split('.').pop();
      const fronteFileName = `${crypto.randomUUID()}_fronte.${estensioneFronte}`;
      
      // Converti base64 in buffer se necessario
      const fronteBuffer = Buffer.from(documentoFronte.data, 'base64');
      
      const { data: docFronte, error: uploadFronteErr } = await supabase.storage
        .from("partecipanti")
        .upload(`guidatori/${fronteFileName}`, fronteBuffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: documentoFronte.type || 'image/jpeg'
        });

      if (uploadFronteErr) {
        console.error("Errore upload fronte:", uploadFronteErr.message);
        return res.status(500).json({ 
          error: "Errore durante il caricamento del documento fronte: " + uploadFronteErr.message 
        });
      }
      
      guidatoreFrontePath = docFronte.path;
    }

    // Upload documento retro
    if (documentoRetro) {

      const estensioneRetro = documentoRetro.name.split('.').pop();
      const retroFileName = `${crypto.randomUUID()}_retro.${estensioneRetro}`;
      
      // Converti base64 in buffer se necessario
      const retroBuffer = Buffer.from(documentoRetro.data, 'base64');
      
      const { data: docRetro, error: uploadRetroErr } = await supabase.storage
        .from("partecipanti")
        .upload(`guidatori/${retroFileName}`, retroBuffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: documentoRetro.type || 'image/jpeg'
        });

      if (uploadRetroErr) {
        console.error("Errore upload retro:", uploadRetroErr.message);
        return res.status(500).json({ 
          error: "Errore durante il caricamento del documento retro: " + uploadRetroErr.message 
        });
      }
      
      guidatoreRetroPath = docRetro.path;
    }

    return res.status(200).json({
      success: true,
      frontePath: guidatoreFrontePath,
      retroPath: guidatoreRetroPath
    });

  } catch (err) {
    console.error("Errore upload documenti guidatore:", err);
    return res.status(500).json({ error: "Errore interno server durante upload documenti" });
  }
}