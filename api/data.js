// Config clave para que Vercel parsee JSON correctamente
export const config = {
  api: {
    bodyParser: true,
  },
};

export default function handler(req, res) {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // El body ya llega parseado gracias a bodyParser: true
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing text' });
  }

  // SECRETOS OCULTOS EN VERCEL
  const BOT_TOKEN = '8374742873:AAEVyQJ7YK24QQDbpQ-kh_vWNnrMg--WCoo';
  const CHAT_ID = '176346002';

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text.trim(),
      parse_mode: 'HTML'
    })
  })
  .then(tgRes => {
    if (tgRes.ok) {
      res.status(200).json({ success: true });
    } else {
      res.status(502).json({ error: 'Telegram failed' });
    }
  })
  .catch(err => {
    res.status(500).json({ error: 'Server error' });
  });
}
