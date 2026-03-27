import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '')
      : undefined;

    if (!privateKey || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_SHEET_ID) {
      // Si no hay credenciales, devolver el JSON local como fallback
      const localPath = path.join(process.cwd(), 'src/data/content.json');
      const localData = JSON.parse(fs.readFileSync(localPath, 'utf8'));
      return res.status(200).json(localData);
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient as any });

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Contenido!A:C', // Buscamos la pestaña "Contenido"
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
         throw new Error('No content rows found');
      }

      // Convertir filas a objeto anidado
      const fetchedContent: any = {};
      rows.forEach((row) => {
        const [section, field, value] = row;
        if (!section || !field) return;
        
        if (!fetchedContent[section]) {
           fetchedContent[section] = {};
        }
        
        if (field.includes('.')) {
          const [indexStr, key] = field.split('.');
          const index = parseInt(indexStr);
          if (!fetchedContent[section][index]) {
             fetchedContent[section][index] = {};
          }
          fetchedContent[section][index][key] = value;
        } else {
          fetchedContent[section][field] = value;
        }
      });

      // Asegurar que si la hoja de cálculo guardó arreglos como objetos con índices (ej: services[0]), se conviertan a arreglos de verdad
      for (const section in fetchedContent) {
        // Un heurístico sencillo: si el objeto tiene clave '0' y no tiene otras llaves no numéricas, lo convertimos a arreglo
        const sectionData = fetchedContent[section];
        const keys = Object.keys(sectionData);
        if (keys.length > 0 && keys.every(k => !isNaN(parseInt(k)))) {
            // Es un arreglo simulado
            const arr: any[] = [];
            keys.forEach(k => {
                arr[parseInt(k)] = sectionData[k];
            });
            fetchedContent[section] = arr;
        }
      }

      // Merge with local fallback data to ensure newly added sections exist
      const localPath = path.join(process.cwd(), 'src/data/content.json');
      const localData = JSON.parse(fs.readFileSync(localPath, 'utf8'));
      
      const mergedContent = { ...localData, ...fetchedContent };

      return res.status(200).json(mergedContent);
    } catch (sheetError) {
      // Si la pestaña no existe o falla, fallback al local
      console.warn('Google Sheets Content tab error, falling back to local JSON:', sheetError);
      const localPath = path.join(process.cwd(), 'src/data/content.json');
      const localData = JSON.parse(fs.readFileSync(localPath, 'utf8'));
      return res.status(200).json(localData);
    }
  } catch (error: any) {
    console.error('Error fetching content:', error);
    return res.status(500).json({ error: 'Error processing content' });
  }
}
