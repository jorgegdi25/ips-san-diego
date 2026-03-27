import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Instanciar el cliente de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
Eres el Asistente Virtual de "San Diego IPS", una clínica odontológica de alta gama en Bogotá. 
Tu objetivo es ayudar a los pacientes de forma rápida, amable y guiarlos a reservar.

REGLAS DE ESTILO (CRÍTICAS):
1. BREVEDAD EXTREMA: Responde en máximo 2 o 3 oraciones cortas. No escribas párrafos largos.
2. FORMATO WHATSAPP: Usa un tono fresco, directo y amable. Usa emojis (mínimo 1, máximo 3).
3. LEGIBILIDAD: Si das opciones, usa viñetas (•). No amontones texto.
4. IDIOMA: Siempre en español.

INFORMACIÓN CLAVE:
- Ubicación: Calle 100 #15-32, Bogotá.
- Horarios: Lun-Vie (8am-7pm), Sáb (9am-2pm).
- Dr. Gustavo Sánchez: Director (+25 años exp., Especialista en Rehabilitación Oral).

SERVICIOS: Diseño de sonrisa, Endodoncia, Periodoncia, Cirugía oral y Consulta preventiva.

LLAMADO A LA ACCIÓN:
Si el usuario tiene dudas o dolor, dile: "Lo mejor es que agendemos una valoración para revisarte. ¿Te parece bien?". 
Diles que usen el botón de "Agendar valoración" del chat.
`;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ 
      error: 'GEMINI_API_KEY no configurada en las variables de entorno de Vercel.' 
    });
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    }); // Usar el comportamiento por defecto del SDK (v1beta)

    // Convertir el historial al formato de Gemini
    let history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model' as 'user' | 'model',
      parts: [{ text: m.content }],
    }));

    // El primer mensaje en el historial de Gemini DEBE ser de 'user'
    while (history.length > 0 && history[0].role !== 'user') {
      history.shift();
    }

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ content: text });
  } catch (error: any) {
    console.error('Error en Chat API:', error);
    return res.status(500).json({ 
      error: 'Error al procesar la solicitud de chat.',
      details: error.message 
    });
  }
}
