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

    // Diagnóstico (esto aparecerá en los logs de Vercel)
    console.log('--- Diagnóstico de Variables ---');
    console.log('Variables GOOGLE_ detectadas:', Object.keys(process.env).filter(k => k.startsWith('GOOGLE')));

    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '')
      : undefined;

    if (!privateKey || !process.env.GOOGLE_CLIENT_EMAIL) {
      console.log('ERROR: Falta llave o email.');
      throw new Error(`Faltan credenciales. Detectadas: ${Object.keys(process.env).filter(k => k.startsWith('GOOGLE')).join(', ')}`);
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
    const startDateTime = new Date(`${date}T${time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

    const event = {
      summary: `Cita Médica: ${service} - IPS San Diego`,
      description: `
        Servicio: ${service}
        Doctor: ${doctor}
        Paciente: ${name}
        Teléfono: ${phone}
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: endDateTime.toISOString(),
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

    console.log('Enviando evento a Google...');
    await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Cita agendada correctamente en Google Calendar.' 
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
