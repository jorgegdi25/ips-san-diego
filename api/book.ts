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
    console.log('--- Iniciando Reserva ---');
    console.log('Email del bot:', process.env.GOOGLE_CLIENT_EMAIL);
    console.log('ID Calendario:', process.env.GOOGLE_CALENDAR_ID);
    console.log('¿Existe llave privada?:', !!process.env.GOOGLE_PRIVATE_KEY);

    // Limpiar la llave privada (Vercel a veces escapa mal los \n)
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '')
      : undefined;

    if (!privateKey || !process.env.GOOGLE_CLIENT_EMAIL) {
      throw new Error('Faltan credenciales de Google en las variables de entorno.');
    }

    // Configuración de autenticación con Service Account
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      undefined,
      privateKey,
      ['https://www.googleapis.com/auth/calendar']
    );

    const calendar = google.calendar({ version: 'v3', auth });

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
        timeZone: 'America/Bogota', // Ajustar a la zona horaria de San Diego (Ips)
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
