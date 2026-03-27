import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Verificar contraseña de Admin
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const { image } = req.body;
  if (!image) {
    return res.status(400).json({ error: 'Falta la imagen' });
  }

  try {
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      throw new Error('IMGBB_API_KEY no configurada en el servidor');
    }

    // Preparar el FormData para ImgBB
    const formData = new URLSearchParams();
    formData.append('key', apiKey);
    formData.append('image', image); // ImgBB acepta string base64 directo

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error?.message || 'Error al subir a ImgBB');
    }

    // Regresar la URL pública
    return res.status(200).json({ url: data.data.url });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ 
      error: 'Error al subir la imagen',
      details: error.message 
    });
  }
}
