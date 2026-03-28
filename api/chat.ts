import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Instanciar el cliente de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
Eres el Asistente Virtual de "San Diego IPS", una clínica odontológica de alta gama en Bogotá. 
Responde de forma ultra-concisa, amable y directa.

REGLAS DE ESTILO (CRÍTICAS):
1. MÁXIMO 2 ORACIONES: No te extiendas. Si necesitas dar detalles, usa máximo 3 viñetas (•) muy cortas.
2. FORMATO WHATSAPP: Usa un tono fresco. Usa EXACTAMENTE 1 emoji por mensaje.
3. ADIÓS A LOS PÁRRAFOS: El usuario lee desde el móvil. No amontones texto.
4. LENGUAJE: Español natural de Colombia.

INFORMACIÓN RÁPIDA:
- Ubicación: Calle 100 #15-32, Bogotá.
- Horario: Lun-Vie 8am-7pm, Sáb 9am-2pm.
- Director: Dr. Gustavo Sánchez (Rehabilitación Oral).
- Servicios: Diseño de Sonrisa, Endodoncia, Periodoncia, Cirugía Oral, Consulta.

CALL TO ACTION:
Si el usuario pregunta por precios o citas, dile: "Lo ideal es agendar una valoración para darte un plan exacto. ¿Te gustaría?".
Indícales que usen el botón azul de "Agendar valoración".
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
      error: 'GEMINI_API_KEY no configurada. Configúrala en el Dashboard de Vercel.' 
    });
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    let history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model' as 'user' | 'model',
      parts: [{ text: m.content }],
    }));

    while (history.length > 0 && history[0].role !== 'user') {
      history.shift();
    }

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.7,
      },
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ content: text.trim() });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ 
      error: 'Error al conectar con la IA.',
      details: error.message 
    });
  }
}
