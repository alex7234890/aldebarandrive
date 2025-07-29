// =============================================================================
// 1. NUOVA API UNIFICATA: /api/registrazione-completa.js
// =============================================================================

import { supabase } from "@/lib/supabaseClient";
import { encrypt } from "@/lib/crypto";
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Tracciamento per rollback
  const uploadedFiles = [];
  let guidatoreId = null;
  const passeggeriIds = [];

  try {
    const { guidatore, passeggeri, evento_id } = req.body;
    
    if (!guidatore || !evento_id) {
      return res.status(400).json({ error: "Dati mancanti nel body" });
    }

    // =====================================================================
    // STEP 1: Upload documenti guidatore
    // =====================================================================
    let guidatoreFrontePath = null;
    let guidatoreRetroPath = null;

    if (guidatore.documenti?.fronte && guidatore.documenti?.retro) {
      try {
        // Upload documento fronte
        const estensioneFronte = guidatore.documenti.fronte.name.split('.').pop();
        const fronteFileName = `${crypto.randomUUID()}_fronte.${estensioneFronte}`;
        const fronteBuffer = Buffer.from(guidatore.documenti.fronte.data, 'base64');

        const { data: docFronte, error: uploadFronteErr } = await supabase.storage
          .from("partecipanti")
          .upload(`guidatori/${fronteFileName}`, fronteBuffer, {
            cacheControl: "3600",
            upsert: false,
            contentType: guidatore.documenti.fronte.type || 'image/jpeg'
          });

        if (uploadFronteErr) throw new Error(`Upload fronte guidatore: ${uploadFronteErr.message}`);
        
        guidatoreFrontePath = docFronte.path;
        uploadedFiles.push({ bucket: "partecipanti", path: docFronte.path });

        // Upload documento retro
        const estensioneRetro = guidatore.documenti.retro.name.split('.').pop();
        const retroFileName = `${crypto.randomUUID()}_retro.${estensioneRetro}`;
        const retroBuffer = Buffer.from(guidatore.documenti.retro.data, 'base64');

        const { data: docRetro, error: uploadRetroErr } = await supabase.storage
          .from("partecipanti")
          .upload(`guidatori/${retroFileName}`, retroBuffer, {
            cacheControl: "3600",
            upsert: false,
            contentType: guidatore.documenti.retro.type || 'image/jpeg'
          });

        if (uploadRetroErr) throw new Error(`Upload retro guidatore: ${uploadRetroErr.message}`);
        
        guidatoreRetroPath = docRetro.path;
        uploadedFiles.push({ bucket: "partecipanti", path: docRetro.path });

      } catch (uploadError) {
        throw new Error(`Errore upload documenti guidatore: ${uploadError.message}`);
      }
    }

    // =====================================================================
    // STEP 2: Inserimento guidatore nel database
    // =====================================================================
    const newGuidatoreId = uuidv4();
    const encryptedGuidatore = {
      nome: encrypt(guidatore.nome),
      cognome: encrypt(guidatore.cognome),
      data_nascita: encrypt(guidatore.data_nascita),
      codice_fiscale: encrypt(guidatore.codice_fiscale.toUpperCase()),
      indirizzo: encrypt(guidatore.indirizzo),
      indirizzo_email: encrypt(guidatore.indirizzo_email.toLowerCase()),
      telefono: encrypt(guidatore.telefono),
      Patente: encrypt(guidatore.patente),
      PatenteS: encrypt(guidatore.patente_scadenza),
      auto_marca: encrypt(guidatore.auto_marca),
      auto_colore: encrypt(guidatore.auto_colore),
      auto_immatricolazione: encrypt(guidatore.auto_immatricolazione),
      auto_modello: encrypt(guidatore.auto_modello),
      auto_targa: encrypt(guidatore.auto_targa),
      posti_auto: guidatore.posti_auto,
      intolleranze: guidatore.intolleranze ? encrypt(guidatore.intolleranze) : null,
      id_evento_fk: evento_id,
      quota: guidatore.quota,
      documento_fronte: guidatoreFrontePath ? encrypt(guidatoreFrontePath) : null,
      documento_retro: guidatoreRetroPath ? encrypt(guidatoreRetroPath) : null,
      verificato: false,
      id: newGuidatoreId
    };

    const { error: guidatoreError } = await supabase
      .from("guidatore")
      .insert(encryptedGuidatore);

    if (guidatoreError) {
      throw new Error(`Errore inserimento guidatore: ${guidatoreError.message}`);
    }

    guidatoreId = newGuidatoreId;

    // =====================================================================
    // STEP 3: Upload documenti e inserimento passeggeri
    // =====================================================================
    for (let i = 0; i < passeggeri.length; i++) {
      const passeggero = passeggeri[i];
      let passeggeroFrontePath = null;
      let passeggeroRetroPath = null;

      // Upload documenti passeggero
      if (passeggero.documenti?.fronte && passeggero.documenti?.retro) {
        try {
          // Upload documento fronte
          const estensioneFronte = passeggero.documenti.fronte.name.split('.').pop();
          const fronteFileName = `${crypto.randomUUID()}_fronte.${estensioneFronte}`;
          const fronteBuffer = Buffer.from(passeggero.documenti.fronte.data, 'base64');

          const { data: docFronte, error: pFronteErr } = await supabase.storage
            .from("partecipanti")
            .upload(`passeggeri/${fronteFileName}`, fronteBuffer, {
              cacheControl: "3600",
              upsert: false,
              contentType: passeggero.documenti.fronte.type || 'image/jpeg'
            });

          if (pFronteErr) throw new Error(`Upload fronte passeggero ${i + 1}: ${pFronteErr.message}`);
          
          passeggeroFrontePath = docFronte.path;
          uploadedFiles.push({ bucket: "partecipanti", path: docFronte.path });

          // Upload documento retro
          const estensioneRetro = passeggero.documenti.retro.name.split('.').pop();
          const retroFileName = `${crypto.randomUUID()}_retro.${estensioneRetro}`;
          const retroBuffer = Buffer.from(passeggero.documenti.retro.data, 'base64');

          const { data: docRetro, error: pRetroErr } = await supabase.storage
            .from("partecipanti")
            .upload(`passeggeri/${retroFileName}`, retroBuffer, {
              cacheControl: "3600",
              upsert: false,
              contentType: passeggero.documenti.retro.type || 'image/jpeg'
            });

          if (pRetroErr) throw new Error(`Upload retro passeggero ${i + 1}: ${pRetroErr.message}`);
          
          passeggeroRetroPath = docRetro.path;
          uploadedFiles.push({ bucket: "partecipanti", path: docRetro.path });

        } catch (uploadError) {
          throw new Error(`Errore upload documenti passeggero ${i + 1}: ${uploadError.message}`);
        }
      }

      // Inserimento passeggero nel database
      const encryptedPasseggero = {
        nome: encrypt(passeggero.nome),
        cognome: encrypt(passeggero.cognome),
        data_nascita: encrypt(passeggero.data_nascita),
        codice_fiscale: encrypt(passeggero.codice_fiscale.toUpperCase()),
        indirizzo: encrypt(passeggero.indirizzo),
        indirizzo_email: encrypt(passeggero.indirizzo_email.toLowerCase()),
        telefono: encrypt(passeggero.telefono),
        intolleranze: passeggero.intolleranze ? encrypt(passeggero.intolleranze) : null,
        id_guidatore_fk: guidatoreId,
        id_evento_fk: evento_id,
        documento_fronte: passeggeroFrontePath ? encrypt(passeggeroFrontePath) : null,
        documento_retro: passeggeroRetroPath ? encrypt(passeggeroRetroPath) : null,
        verificato: false,
      };

      const { data: passeggeroData, error: passeggeroError } = await supabase
        .from("passeggero")
        .insert(encryptedPasseggero)

      if (passeggeroError) {
        throw new Error(`Errore inserimento passeggero ${i + 1}: ${passeggeroError.message}`);
      }

      if (passeggeroData?.id) {
        passeggeriIds.push(passeggeroData.id);
      }
    }

    // =====================================================================
    // SUCCESSO: Registrazione completata
    // =====================================================================
    return res.status(201).json({ 
      success: true, 
      message: "Registrazione completata con successo"
    });

  } catch (error) {
    console.error("Errore durante la registrazione:", error);

    // =====================================================================
    // ROLLBACK: Cleanup in caso di errore
    // =====================================================================
    await performRollback(uploadedFiles, guidatoreId, passeggeriIds);

    return res.status(500).json({ 
      error: error.message || "Errore interno durante la registrazione" 
    });
  }
}

// =============================================================================
// FUNZIONE DI ROLLBACK
// =============================================================================
async function performRollback(uploadedFiles, guidatoreId, passeggeriIds) {
  console.log("Inizio rollback...");

  // 1. Rimuovi passeggeri dal database
  if (passeggeriIds.length > 0) {
    try {
      const { error } = await supabase
        .from('passeggero')
        .delete()
        .in('id', passeggeriIds);
      
      if (error) {
        console.error("Errore rollback passeggeri:", error.message);
      } else {
        console.log(`Rimossi ${passeggeriIds.length} passeggeri dal database`);
      }
    } catch (err) {
      console.error("Errore durante rollback passeggeri:", err);
    }
  }

  // 2. Rimuovi guidatore dal database
  if (guidatoreId) {
    try {
      const { error } = await supabase
        .from('guidatore')
        .delete()
        .eq('id', guidatoreId);
      
      if (error) {
        console.error("Errore rollback guidatore:", error.message);
      } else {
        console.log("Rimosso guidatore dal database");
      }
    } catch (err) {
      console.error("Errore durante rollback guidatore:", err);
    }
  }

  // 3. Rimuovi file caricati
  if (uploadedFiles.length > 0) {
    try {
      const filePaths = uploadedFiles.map(f => f.path);
      const { data, error } = await supabase.storage
        .from('partecipanti')
        .remove(filePaths);
      
      if (error) {
        console.error("Errore rollback files:", error.message);
      } else {
        console.log(`Rimossi ${filePaths.length} file dallo storage`);
      }
    } catch (err) {
      console.error("Errore durante rollback file:", err);
    }
  }

  console.log("Rollback completato");
}