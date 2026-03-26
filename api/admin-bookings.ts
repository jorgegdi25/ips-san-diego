import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Solo permitir GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Verificar contraseña de Admin
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '')
      : undefined;

    if (!privateKey || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_SHEET_ID) {
      throw new Error('Faltan credenciales de Google o ID de Hoja en Vercel.');
    }

    // Auth con Google
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient as any });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'A:G',
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(200).json({ bookings: [] });
    }

    // Mapear filas a objetos (omitiendo la cabecera si existe)
    const bookings = rows.map((row, index) => ({
      id: index,
      created: row[0],
      appointment: row[1],
      name: row[2],
      phone: row[3],
      service: row[4],
      doctor: row[5],
      status: row[6],
    })).filter(b => b.name !== 'Paciente'); // Filtro básico por si hay cabeceras

    return res.status(200).json({ bookings });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ 
      error: 'Error al leer el CRM.',
      details: error.message 
    });
  }
}
