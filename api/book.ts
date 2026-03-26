import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { service, doctor, date, time, name, phone } = req.body;

    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '')
      : undefined;

    if (!privateKey || !process.env.GOOGLE_CLIENT_EMAIL) {
      throw new Error('Faltan credenciales de Google (Email o Private Key) en Vercel.');
    }

    // Configuración de autenticación moderna con GoogleAuth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    // Obtener un cliente autenticado explícitamente
    const authClient = await auth.getClient();
    const calendar = google.calendar({ version: 'v3', auth: authClient as any });

    // Definir horario de inicio y fin (asumimos 1 hora por defecto)
    // Usamos el formato local ISO (sin la Z) para que Google respete la TimeZone
    const startDateTimeStr = `${date}T${time}:00`;
    
    // Calculamos el fin sumando 1 hora a la hora de inicio
    const [h, m] = time.split(':').map(Number);
    const endHour = String(h + 1).padStart(2, '0');
    const endDateTimeStr = `${date}T${endHour}:${String(m).padStart(2, '0')}:00`;

    const event = {
      summary: `Cita Médica: ${service} - IPS San Diego`,
      description: `
        Servicio: ${service}
        Doctor: ${doctor}
        Paciente: ${name}
        Teléfono: ${phone}
      `.trim(),
      start: {
        dateTime: startDateTimeStr,
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: endDateTimeStr,
        timeZone: 'America/Bogota',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
    });

    // --- NUEVO: GUARDAR EN GOOGLE SHEETS (CRM) ---
    if (process.env.GOOGLE_SHEET_ID) {
      const sheets = google.sheets({ version: 'v4', auth: authClient as any });
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'A:G', // Asumiendo que la primera pestaña está vacía
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [
              new Date().toLocaleString('es-CO'), // Registro
              `${date} ${time}`, // Cita
              name,
              phone,
              service,
              doctor,
              'Nueva' // Estatus inicial
            ]
          ]
        }
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Cita agendada correctamente en Google Calendar y CRM.' 
    });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error al conectar con Google Calendar.',
      details: error.message 
    });
  }
}
