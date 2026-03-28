import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { date, serviceId } = req.query;

  if (!date || typeof date !== 'string') {
    return res.status(400).json({ error: 'Falta el parámetro date (YYYY-MM-DD)' });
  }

  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '')
      : undefined;

    if (!privateKey || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_CALENDAR_ID) {
      throw new Error('Variables de entorno de Google no configuradas.');
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const authClient = await auth.getClient();
    const calendar = google.calendar({ version: 'v3', auth: authClient as any });

    // Rango del día seleccionado en Bogotá (UTC-5)
    const timeMin = `${date}T00:00:00-05:00`;
    const timeMax = `${date}T23:59:59-05:00`;

    // Obtener eventos existentes
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    
    // Horarios de la clínica
    const day = new Date(date).getUTCDay(); // 0=Sun, 6=Sat
    let startHour = 8;
    let endHour = 19;

    if (day === 6) { // Sábado
      startHour = 9;
      endHour = 14;
    } else if (day === 0) { // Domingo
      return res.status(200).json({ slots: [] });
    }

    // Generar slots
    const duration = 60; // Por defecto 60 min
    const slots = [];
    let currentHour = startHour;
    let currentMin = 0;

    while (currentHour + duration / 60 <= endHour) {
      const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
      const slotStart = new Date(`${date}T${timeStr}:00-05:00`);
      const slotEnd = new Date(slotStart.getTime() + duration * 60000);

      // 1. Verificar si hay traslapo con algún evento de Google
      const isOverlap = events.some(event => {
        const eventStart = new Date(event.start?.dateTime || event.start?.date || '');
        const eventEnd = new Date(event.end?.dateTime || event.end?.date || '');
        return eventStart < slotEnd && eventEnd > slotStart;
      });

      // 2. Verificar si el horario ya pasó (si es hoy)
      // Añadimos un pequeño buffer de 15 min para no permitir citas "encima" de la hora
      const now = new Date();
      const isPast = slotStart < new Date(now.getTime() + 15 * 60000);

      slots.push({
        time: timeStr,
        available: !isOverlap && !isPast
      });

      currentMin += duration;
      while (currentMin >= 60) {
        currentMin -= 60;
        currentHour++;
      }
    }

    return res.status(200).json({ slots });
  } catch (error: any) {
    console.error('Error fetching availability:', error);
    return res.status(500).json({ 
      error: 'Error al consultar disponibilidad.',
      details: error.message 
    });
  }
}
