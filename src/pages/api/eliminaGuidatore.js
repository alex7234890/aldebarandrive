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

    // Prima recuperiamo tutti i guidatori dell'evento per ottenere i path dei documenti
    const { data: guidatori, error: fetchError } = await supabase
      .from("guidatore")
      .select("documento_fronte, documento_retro")
      .eq("id_evento_fk", eventId);

    if (fetchError) {
      console.error("Errore recupero guidatori:", fetchError.message);
      return res.status(500).json({ 
        error: "Errore durante il recupero dei guidatori: " + fetchError.message 
      });
    }

    // Raccogliamo tutti i path dei documenti da eliminare
    const documentiDaEliminare = [];
    
    if (guidatori && guidatori.length > 0) {
      guidatori.forEach(guidatore => {
        if (guidatore.documento_fronte) {
          try {
            const decryptedFrontePath = decrypt(guidatore.documento_fronte);
            if (decryptedFrontePath) {
              documentiDaEliminare.push(decryptedFrontePath);
            }
          } catch (decryptError) {
            console.warn("Errore decifratura path documento fronte:", decryptError);
          }
        }
        
        if (guidatore.documento_retro) {
          try {
            const decryptedRetroPath = decrypt(guidatore.documento_retro);
            if (decryptedRetroPath) {
              documentiDaEliminare.push(decryptedRetroPath);
            }
          } catch (decryptError) {
            console.warn("Errore decifratura path documento retro:", decryptError);
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
          console.warn("Errore eliminazione documenti storage guidatori:", deleteStorageError.message);
          // Non blocchiamo l'operazione per errori di storage
        } else {
          console.log(`${documentiDaEliminare.length} documenti guidatori eliminati dallo storage`);
        }
      } catch (storageError) {
        console.warn("Errore durante eliminazione storage guidatori:", storageError);
        // Non blocchiamo l'operazione
      }
    }

    // Elimina i record dei guidatori dal database
    const { error: deleteGuidatoriError } = await supabase
      .from("guidatore")
      .delete()
      .eq("id_evento_fk", eventId);

    if (deleteGuidatoriError) {
      console.error("Errore eliminazione guidatori:", deleteGuidatoriError.message);
      return res.status(500).json({ 
        error: "Errore durante l'eliminazione dei guidatori: " + deleteGuidatoriError.message 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: `Guidatori per l'evento ${eventId} eliminati con successo`,
      deletedDocuments: documentiDaEliminare.length
    });

  } catch (err) {
    console.error("Errore generale eliminazione guidatori:", err);
    return res.status(500).json({ 
      error: "Errore interno server durante eliminazione guidatori" 
    });
  }
}