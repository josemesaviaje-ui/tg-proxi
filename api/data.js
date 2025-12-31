// Fuerza el parsing de JSON (fix clave para Vercel bare API)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req, res) {
  // Permitimos solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Accedemos al body (ahora sí parseado correctamente)
  const body = req.body;

  let text;
  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body);
      text = parsed.text;
    } catch {
      text = body;
    }
  } else if (body && body.text) {
    text = body.text;
  }

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing text' });
  }

  // SECRETOS OCULTOS
  const BOT_TOKEN = '8374742873:AAEVyQJ7YK24QQDbpQ-kh_vWNnrMg--WCoo';
  const CHAT_ID = '176346002';

  try {
    const tgResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text.trim(),
        parse_mode: 'HTML'
      })
    });

    if (tgResponse.ok) {
      res.status(200).json({ success: true });
    } else {
      const err = await tgResponse.text();
      res.status(502).json({ error: 'Telegram failed', details: err });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal error' });
  }
}
