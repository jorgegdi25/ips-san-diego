import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const { id, status } = req.body;

  if (id === undefined || !status) {
    return res.status(400).json({ error: 'Se requiere ID y estado' });
  }

  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '')
      : undefined;

    if (!privateKey || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_SHEET_ID) {
      throw new Error('Faltan credenciales de Google o ID de Hoja en Vercel.');
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Permiso de escritura
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient as any });

    // El ID viene como índice del array (0 es la primera fila devuelta por admin-bookings)
    // En Google Sheets las filas empiezan en 1.
    // Además, 'admin-bookings' hace range: 'A:G'.
    // Entonces row_index = id + 1.
    // La columna del estado es la 'G'.
    const rowNumber = id + 1;
    const range = `G${rowNumber}`; 

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[status]]
      }
    });

    return res.status(200).json({ success: true, message: 'Estado actualizado' });
  } catch (error: any) {
    console.error('Error updating status:', error);
    return res.status(500).json({ 
      error: 'Error al actualizar el estado en el CRM.',
      details: error.message 
    });
  }
}
