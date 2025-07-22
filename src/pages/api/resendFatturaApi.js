import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { to, subject, filename, base64, htmlBody } = req.body;

  if (!to || !filename || !base64 || !htmlBody) {
    return res.status(400).json({ error: 'Dati mancanti per invio email' });
  }

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // deve essere un dominio verificato
      to,
      subject: subject || 'Fattura evento',
      html: htmlBody,
      attachments: [
        {
          filename: filename,
          content: base64,
          type: 'application/pdf',
        },
      ],
    });

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Errore invio email:", err);

    if (!res.headersSent) {
      return res.status(500).json({
        error: 'Errore durante l\'invio della mail',
        details: err?.message || 'Errore sconosciuto'
      });
    }
  }
}
