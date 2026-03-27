import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(200).json({ error: 'No API Key found in environment variables.' });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    return res.status(200).json({ 
      success: true,
      models: data.models ? data.models.map((m: any) => m.name) : [],
      full_response: data
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
