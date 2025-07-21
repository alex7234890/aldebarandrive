import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Destruttura i dati dal corpo della richiesta, inclusi i nuovi campi
  const { email, formData, passeggeri, selectedEvent } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  try {
    // Costruisci il riassunto dettagliato dell'iscrizione in HTML
    let emailHtml = `
      <p>Gentile ${formData.guidatoreNome} ${formData.guidatoreCognome},</p>
      <p>La tua registrazione per l'evento è stata confermata con successo! 🎉</p>
      <h2>Dettagli Iscrizione Evento</h2>
      <h3>Evento: ${selectedEvent.titolo}</h3>
      <p><strong>Data:</strong> ${new Date(selectedEvent.data).toLocaleDateString()}</p>
      <p><strong>Luogo:</strong> ${selectedEvent.luogo}</p>
      <p><strong>Quota Selezionata:</strong> ${formData.quotaSelezionata}</p>

      <h3>Dati del Guidatore</h3>
      <ul>
        <li><strong>Nome:</strong> ${formData.guidatoreNome}</li>
        <li><strong>Cognome:</strong> ${formData.guidatoreCognome}</li>
        <li><strong>Codice Fiscale:</strong> ${formData.guidatoreCodiceFiscale}</li>
        <li><strong>Data di Nascita:</strong> ${formData.guidatoreDataNascita}</li>
        <li><strong>Indirizzo:</strong> ${formData.guidatoreIndirizzo}</li>
        <li><strong>Cellulare:</strong> ${formData.guidatoreCellulare}</li>
        <li><strong>Email:</strong> ${formData.guidatoreEmail}</li>
        <li><strong>Patente:</strong> ${formData.guidatorePatente} (Scadenza: ${formData.guidatorePatenteScadenza})</li>
        <li><strong>Auto:</strong> ${formData.autoMarca} ${formData.autoModello} (${formData.autoColore})</li>
        <li><strong>Targa Auto:</strong> ${formData.autoTarga}</li>
        <li><strong>Posti Auto:</strong> ${formData.postiAuto}</li>
        <li><strong>Esigenze Alimentari:</strong> ${formData.guidatoreEsigenzeAlimentari ? (formData.guidatoreIntolleranze || 'Specifiche') : 'Nessuna'}</li>
      </ul>
    `;

    // Aggiungi i dati dei passeggeri se presenti
    if (passeggeri && passeggeri.length > 0) {
      emailHtml += `<h3>Dati dei Passeggeri</h3>`;
      passeggeri.forEach((p, index) => {
        emailHtml += `
          <h4>Passeggero ${index + 1}</h4>
          <ul>
            <li><strong>Nome:</strong> ${p.nome}</li>
            <li><strong>Cognome:</strong> ${p.cognome}</li>
            <li><strong>Codice Fiscale:</strong> ${p.codiceFiscale}</li>
            <li><strong>Data di Nascita:</strong> ${p.dataNascita}</li>
            <li><strong>Indirizzo:</strong> ${p.indirizzo}</li>
            <li><strong>Cellulare:</strong> ${p.cellulare}</li>
            <li><strong>Email:</strong> ${p.email}</li>
            <li><strong>Esigenze Alimentari:</strong> ${p.esigenzeAlimentari ? (p.intolleranze || 'Specifiche') : 'Nessuna'}</li>
          </ul>
        `;
      });
    } else {
      emailHtml += `<p>Nessun passeggero aggiunto a questa iscrizione.</p>`;
    }

    emailHtml += `
      <p>Ti aspettiamo!</p>
      <p>Cordiali saluti,<br>Il Team AldebaranDrive</p>
    `;

    await resend.emails.send({
      from: 'onboarding@resend.dev', // Assicurati che questo sia un dominio verificato con Resend
      to: email,
      subject: `Conferma Registrazione Evento: ${selectedEvent.titolo}`, // Soggetto più specifico
      html: emailHtml, // Usa il contenuto HTML dettagliato
    });

    res.status(200).json({ success: true, message: 'Email inviata con successo.' });
  } catch (err) {
    console.error('Errore Resend:', err);
    res.status(500).json({ error: 'Errore durante l\'invio dell\'email di conferma.', details: err.message });
  }
}