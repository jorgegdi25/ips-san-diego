import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // This tool is for debugging only
    const models = [];
    // The SDK might not have a public listModels on the genAI instance easily
    // but we can try to fetch it directly or use a known one.
    
    return res.status(200).json({ 
      msg: 'Diagnostic tool',
      key_exists: !!process.env.GEMINI_API_KEY,
      usage: 'Try changing model to gemini-1.5-flash-001 or gemini-1.5-flash-002'
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
