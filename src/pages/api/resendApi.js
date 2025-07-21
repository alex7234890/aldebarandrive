import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const { email } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Conferma registrazione evento',
      html: '<p>Registrazione confermata 🎉</p>',
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Errore Resend:', err);
    res.status(500).json({ error: 'Errore invio email' });
  }
}
