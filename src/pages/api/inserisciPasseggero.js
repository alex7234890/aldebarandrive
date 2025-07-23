import { supabase } from "@/lib/supabaseClient";
import { encrypt } from "@/lib/crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = req.body;

    if (!data || !data.nome || !data.cognome) {
      return res.status(400).json({ error: "Dati mancanti nel body" });
    }

    const encryptedPasseggero = {
      nome: encrypt(data.nome),
      cognome: encrypt(data.cognome),
      data_nascita: encrypt(data.data_nascita),
      codice_fiscale: encrypt(data.codice_fiscale.toUpperCase()),
      indirizzo: encrypt(data.indirizzo),
      indirizzo_email: encrypt(data.indirizzo_email.toLowerCase()),
      telefono: encrypt(data.telefono),
      intolleranze: data.intolleranze ? encrypt(data.intolleranze) : null,
      id_guidatore_fk: data.id_guidatore_fk,
      id_evento_fk: data.id_evento_fk,
      documento_fronte: encrypt(data.documento_fronte) || null,
      documento_retro: encrypt(data.documento_retro) || null,
      verificato: false,
    };

    const { data: inserted, error } = await supabase
      .from("passeggero")
      .insert(encryptedPasseggero)
      .select()
      .single();

    if (error) {
      console.error("Errore Supabase:", error.message);
      return res.status(500).json({ error: `Errore Supabase: ${error.message}` });
    }

    return res.status(201).json({ id: inserted.id });
  } catch (e) {
    console.error("Errore inserimento passeggero:", e.message);
    return res.status(500).json({ error: "Errore interno server" });
  }
}
