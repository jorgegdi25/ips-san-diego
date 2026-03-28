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
        range: 'Contenido!A:C',
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
         throw new Error('No content rows found');
      }

      // Helper: set a value at a deep path like "credentials.0" or "highlights.0.icon"
      const setDeep = (obj: any, pathStr: string, value: any) => {
        const parts = pathStr.split('.');
        let current = obj;
        for (let i = 0; i < parts.length - 1; i++) {
          const key = parts[i];
          const nextKey = parts[i + 1];
          // Decide if next level should be array or object
          if (current[key] === undefined) {
            current[key] = /^\d+$/.test(nextKey) ? [] : {};
          }
          current = current[key];
        }
        current[parts[parts.length - 1]] = value;
      };

      // Convert flat rows [section, dotPath, value] into nested object
      const fetchedContent: any = {};
      rows.forEach((row) => {
        const [section, field, value] = row;
        if (!section || !field || value === undefined) return;
        
        if (!fetchedContent[section]) {
          // Check if the first field starts with a digit => section is an array
          fetchedContent[section] = {};
        }
        
        setDeep(fetchedContent[section], field, value);
      });

      // Convert numeric-keyed objects to arrays recursively
      const convertArrays = (obj: any): any => {
        if (obj === null || obj === undefined || typeof obj !== 'object') return obj;
        
        const keys = Object.keys(obj);
        // If all keys are numeric, convert to array
        if (keys.length > 0 && keys.every(k => /^\d+$/.test(k))) {
          const arr: any[] = [];
          keys.forEach(k => {
            arr[parseInt(k)] = convertArrays(obj[k]);
          });
          return arr;
        }
        
        // Otherwise recurse into each key
        const result: any = {};
        for (const k of keys) {
          result[k] = convertArrays(obj[k]);
        }
        return result;
      };

      const reconstructed = convertArrays(fetchedContent);

      // Feature Flags desde variables de entorno de Vercel (si no existen se asume true)
      const features = {
        aiChat: process.env.ENABLE_AI_CHAT !== 'false',
        booking: process.env.ENABLE_BOOKING !== 'false',
        analytics: process.env.ENABLE_ANALYTICS !== 'false',
        visualEditor: process.env.ENABLE_VISUAL_EDITOR !== 'false',
        whatsappFloating: process.env.ENABLE_WHATSAPP !== 'false'
      };

      // Merge with local fallback data and override with environment features
      const localPath = path.join(process.cwd(), 'src/data/content.json');
      const localData = JSON.parse(fs.readFileSync(localPath, 'utf8'));
      const mergedContent = { ...localData, ...reconstructed, features };

      return res.status(200).json(mergedContent);
    } catch (sheetError) {
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
