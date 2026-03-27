import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Verificar contraseña de Admin
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const content = req.body?.content || req.body;
  if (!content || typeof content !== 'object') {
    return res.status(400).json({ error: 'Faltan datos de contenido validos' });
  }

  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '')
      : undefined;

    if (!privateKey || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_SHEET_ID) {
      throw new Error('Credenciales de Google Sheets no encontradas');
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient as any });

    // Función para aplanar objetos profundamente
    const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
      return Object.keys(obj).reduce((acc: any, k: string) => {
        const pre = prefix.length ? prefix + '.' : '';
        const val = obj[k];
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          Object.assign(acc, flattenObject(val, pre + k));
        } else if (Array.isArray(val)) {
           val.forEach((item: any, i: number) => {
             if (typeof item === 'object' && item !== null) {
               Object.assign(acc, flattenObject(item, pre + k + '.' + i));
             } else {
               acc[pre + k + '.' + i] = item;
             }
           });
        } else {
          acc[pre + k] = val;
        }
        return acc;
      }, {});
    };

    // Preparar los datos para las filas de Google Sheets
    // Formato: [Sección, Campo, Valor]
    const values: string[][] = [];
    Object.keys(content).forEach((section) => {
      if (!content[section]) return;
      const flat = flattenObject(content[section]);
      Object.keys(flat).forEach(field => {
        if (typeof flat[field] === 'string' || typeof flat[field] === 'number') {
          values.push([section, field, String(flat[field])]);
        }
      });
    });

    // Verificar si la pestaña "Contenido" existe, si no, crearla
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });
    const sheetNames = spreadsheetInfo.data.sheets?.map(s => s.properties?.title) || [];
    
    if (!sheetNames.includes('Contenido')) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        requestBody: {
          requests: [{ addSheet: { properties: { title: 'Contenido' } } }],
        },
      });
    }

    // Actualizar (o sobrescribir) la pestaña Contenido
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Contenido!A1',
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    return res.status(200).json({ message: 'Contenido actualizado correctamente' });
  } catch (error: any) {
    console.error('Error updating content:', error);
    return res.status(500).json({ 
      error: 'Error al actualizar el contenido.',
      details: error.message 
    });
  }
}
