import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { codiceFiscale, documentoFronte, documentoRetro, passeggeroIndex } = req.body;

    if (!codiceFiscale) {
      return res.status(400).json({ error: "Codice fiscale mancante" });
    }

    if (!documentoFronte || !documentoRetro) {
      return res.status(400).json({ error: "Documenti mancanti" });
    }

    let passeggeroFrontePath = null;
    let passeggeroRetroPath = null;

    // Upload documento fronte
    if (documentoFronte) {
      const estensioneFronte = documentoFronte.name.split(".").pop();
      const fronteFileName = `${codiceFiscale.toUpperCase()}_${Date.now()}_fronte.${estensioneFronte}`;
      
      // Converti base64 in buffer se necessario
      const fronteBuffer = Buffer.from(documentoFronte.data, 'base64');
      
      const { data: docFronte, error: pFronteErr } = await supabase.storage
        .from("partecipanti")
        .upload(`passeggeri/${fronteFileName}`, fronteBuffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: documentoFronte.type || 'image/jpeg'
        });

      if (pFronteErr) {
        console.error(`Errore upload fronte passeggero ${passeggeroIndex}:`, pFronteErr.message);
        return res.status(500).json({ 
          error: `Errore upload documento fronte passeggero ${passeggeroIndex}: ${pFronteErr.message}` 
        });
      }

      passeggeroFrontePath = docFronte.path;
    }

    // Upload documento retro
    if (documentoRetro) {
      const estensioneRetro = documentoRetro.name.split(".").pop();
      const retroFileName = `${codiceFiscale.toUpperCase()}_${Date.now()}_retro.${estensioneRetro}`;
      
      // Converti base64 in buffer se necessario
      const retroBuffer = Buffer.from(documentoRetro.data, 'base64');
      
      const { data: docRetro, error: pRetroErr } = await supabase.storage
        .from("partecipanti")
        .upload(`passeggeri/${retroFileName}`, retroBuffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: documentoRetro.type || 'image/jpeg'
        });

      if (pRetroErr) {
        console.error(`Errore upload retro passeggero ${passeggeroIndex}:`, pRetroErr.message);
        return res.status(500).json({ 
          error: `Errore upload documento retro passeggero ${passeggeroIndex}: ${pRetroErr.message}` 
        });
      }

      passeggeroRetroPath = docRetro.path;
    }

    return res.status(200).json({
      success: true,
      frontePath: passeggeroFrontePath,
      retroPath: passeggeroRetroPath
    });

  } catch (err) {
    console.error("Errore upload documenti passeggero:", err);
    return res.status(500).json({ error: "Errore interno server durante upload documenti" });
  }
}