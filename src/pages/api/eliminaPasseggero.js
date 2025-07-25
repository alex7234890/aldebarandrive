import { supabase } from "@/lib/supabaseClient";
import { decrypt } from "@/lib/crypto";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: "ID evento mancante" });
    }

    // Prima recuperiamo tutti i passeggeri dell'evento per ottenere i path dei documenti
    const { data: passeggeri, error: fetchError } = await supabase
      .from("passeggero")
      .select("documento_fronte, documento_retro")
      .eq("id_evento_fk", eventId);

    if (fetchError) {
      console.error("Errore recupero passeggeri:", fetchError.message);
      return res.status(500).json({ 
        error: "Errore durante il recupero dei passeggeri: " + fetchError.message 
      });
    }

    // Raccogliamo tutti i path dei documenti da eliminare
    const documentiDaEliminare = [];
    
    if (passeggeri && passeggeri.length > 0) {
      passeggeri.forEach(passeggero => {
        if (passeggero.documento_fronte) {
          try {
            const decryptedFrontePath = decrypt(passeggero.documento_fronte);
            if (decryptedFrontePath) {
              documentiDaEliminare.push(decryptedFrontePath);
            }
          } catch (decryptError) {
            console.warn("Errore decifratura path documento fronte passeggero:", decryptError);
          }
        }
        
        if (passeggero.documento_retro) {
          try {
            const decryptedRetroPath = decrypt(passeggero.documento_retro);
            if (decryptedRetroPath) {
              documentiDaEliminare.push(decryptedRetroPath);
            }
          } catch (decryptError) {
            console.warn("Errore decifratura path documento retro passeggero:", decryptError);
          }
        }
      });
    }

    // Elimina i documenti dallo storage
    if (documentiDaEliminare.length > 0) {
      try {
        const { error: deleteStorageError } = await supabase.storage
          .from("partecipanti")
          .remove(documentiDaEliminare);

        if (deleteStorageError) {
          console.warn("Errore eliminazione documenti storage passeggeri:", deleteStorageError.message);
          // Non blocchiamo l'operazione per errori di storage
        } else {
          console.log(`${documentiDaEliminare.length} documenti passeggeri eliminati dallo storage`);
        }
      } catch (storageError) {
        console.warn("Errore durante eliminazione storage passeggeri:", storageError);
        // Non blocchiamo l'operazione
      }
    }

    // Elimina i record dei passeggeri dal database
    const { error: deletePasseggeriError } = await supabase
      .from("passeggero")
      .delete()
      .eq("id_evento_fk", eventId);

    if (deletePasseggeriError) {
      console.error("Errore eliminazione passeggeri:", deletePasseggeriError.message);
      return res.status(500).json({ 
        error: "Errore durante l'eliminazione dei passeggeri: " + deletePasseggeriError.message 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: `Passeggeri per l'evento ${eventId} eliminati con successo`,
      deletedDocuments: documentiDaEliminare.length
    });

  } catch (err) {
    console.error("Errore generale eliminazione passeggeri:", err);
    return res.status(500).json({ 
      error: "Errore interno server durante eliminazione passeggeri" 
    });
  }
}