import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Instanciar el cliente de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
Eres el Asistente Virtual de "San Diego IPS", una clínica odontológica de alta gama en Bogotá. 
Tu objetivo es ayudar a los pacientes con información precisa, amable y profesional, y guiarlos hacia la reserva de una cita.

INFORMACIÓN DE LA CLÍNICA:
- Nombre: San Diego IPS.
- Ubicación: Calle 100 #15-32, Edificio Profesional, Bogotá DC.
- Horarios: Lunes a Viernes (8:00 AM - 7:00 PM), Sábados (9:00 AM - 2:00 PM).
- Especialista Principal: Dr. Gustavo Sánchez, Director Clínico con +25 años de experiencia. Egresado de la Universidad Javeriana, especialista en Rehabilitación Oral (U. El Bosque).

SERVICIOS DISPONIBLES:
1. Diseño de sonrisa: Estética y funcionalidad personalizada.
2. Endodoncia: Tratamientos de conducto indoloros con tecnología rotatoria.
3. Periodoncia: Cuidado de encías y tejidos de soporte.
4. Cirugía oral: Procedimientos especializados con mínima invasión.
5. Consulta preventiva: Limpieza y mantenimiento periódico.

TONO Y ESTILO:
- Sé empático, profesional y disruptivo (enfoque en tecnología y bienestar).
- Responde siempre en español.
- Si el usuario muestra interés en un tratamiento o dice que tiene dolor, invítalo cordialmente a "Agendar una valoración" usando el botón de reserva.
- Mantén las respuestas concisas pero completas.

REGLA CRÍTICA:
- Si el usuario quiere agendar, indícale que puede hacerlo dando clic en el botón de "Agendar valoración" que aparecerá en el chat o en el menú superior.
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
      model: "gemini-1.5-flash-latest",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Convertir el historial al formato de Gemini, asegurando que empiece con un mensaje de 'user'
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
