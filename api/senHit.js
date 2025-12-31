export default async function handler(req, res) {
  // Solo permitimos POST
  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'Invalid method' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Missing text' });
  }

  // TUS SECRETOS OCULTOS AQUÍ (nadie los ve)
  const BOT_TOKEN = '8374742873:AAEVyQJ7YK24QQDbpQ-kh_vWNnrMg--WCoo';
  const CHAT_ID = '176346002';

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'HTML'
      })
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send' });
  }
}

// Para más discreción: la raíz devuelve página en blanco o 404
export const config = {
  api: {
    bodyParser: true,
  },
};
