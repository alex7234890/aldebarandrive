import { supabase } from "@/lib/supabaseClient";
import { encrypt } from "@/lib/crypto";
import { v4 as uuidv4 } from 'uuid';

const newId = uuidv4();


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = req.body;

    if (!data || !data.nome || !data.cognome) {
      return res.status(400).json({ error: "Dati mancanti nel body" });
    }

    const encryptedGuidatore = {
      nome: encrypt(data.nome),
      cognome: encrypt(data.cognome),
      data_nascita: encrypt(data.data_nascita),
      codice_fiscale: encrypt(data.codice_fiscale.toUpperCase()),
      indirizzo: encrypt(data.indirizzo),
      indirizzo_email: encrypt(data.indirizzo_email.toLowerCase()),
      telefono: encrypt(data.telefono),
      Patente: encrypt(data.patente),
      PatenteS: encrypt(data.patente_scadenza),
      auto_marca: encrypt(data.auto_marca),
      auto_colore: encrypt(data.auto_colore),
      auto_immatricolazione: encrypt(data.auto_immatricolazione),
      auto_modello: encrypt(data.auto_modello),
      auto_targa: encrypt(data.auto_targa),
      posti_auto: data.posti_auto,
      intolleranze: data.intolleranze ? encrypt(data.intolleranze) : null,
      id_evento_fk: data.id_evento_fk,
      quota: data.quota,
      documento_fronte: encrypt(data.documento_fronte) || null,
      documento_retro: encrypt(data.documento_retro) || null,
      verificato: false,
      id: newId
    };

    const { error } = await supabase
    .from("guidatore")
    .insert(encryptedGuidatore)
  

    if (error) {
      console.error("Errore Supabase:", error.message);
      return res.status(500).json({ error: "Errore Supabase: " + error.message });
    }
    
    
    res.status(201).json({ success: true, id: newId });
    

    res.status(201).json({ success: true , });
  } catch (err) {
    console.error("Errore API:", err);
    res.status(500).json({ error: "Errore interno server" });
  }
}
