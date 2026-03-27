import { useState, useRef } from 'react';
import { useContent } from '../ContentContext';
import type { Content } from '../ContentContext';

interface EditableImageProps {
  section: keyof Content;
  fieldPath: string;
  src: string;
  alt: string;
  className?: string;
}

export default function EditableImage({ section, fieldPath, src, alt, className = '' }: EditableImageProps) {
  const { isEditorActive, updateContentField } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(src);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (tempUrl && tempUrl !== src) {
      updateContentField(section, fieldPath, tempUrl);
    }
    setIsEditing(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY || 'ed54b96bacc359ed0a934a103188c497';
      const formData = new FormData();
      formData.append('image', file);
      formData.append('key', apiKey);

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setTempUrl(data.data.url);
      } else {
        alert('Error al subir la imagen: ' + (data.error?.message || 'Desconocido'));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error de conexión al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isEditorActive) {
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <div className="relative group inline-block w-full h-full">
      <img src={src} alt={alt} className={`${className} transition-opacity ${isEditing ? 'opacity-50' : 'group-hover:opacity-80'} outline-dashed outline-2 outline-transparent group-hover:outline-amber-500`} />
      
      {!isEditing ? (
        <div 
          className="absolute inset-x-0 bottom-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer bg-gradient-to-t from-black/80 to-transparent pt-12 pb-4 transition-opacity rounded-inherit"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsEditing(true);
            setTempUrl(src);
          }}
        >
          <div className="bg-amber-600 text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg text-sm font-bold">
            <span className="material-symbols-outlined text-base">image</span>
            <span>Cambiar</span>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-6 z-50 rounded-inherit">
          {isUploading ? (
            <div className="flex flex-col items-center text-white">
              <span className="material-symbols-outlined animate-spin text-4xl mb-2">refresh</span>
              <span className="text-sm font-bold">Subiendo imagen...</span>
            </div>
          ) : (
            <>
              <label className="text-white mb-4 text-sm font-bold w-full text-center">Cambiar Imagen</label>
              
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); fileInputRef.current?.click(); }}
                className="w-full py-3 mb-4 bg-white text-black font-bold rounded shadow flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined">upload_file</span>
                Subir desde mi PC
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              <div className="flex items-center w-full gap-2 mb-4">
                <hr className="flex-1 border-gray-600" />
                <span className="text-gray-400 text-xs uppercase font-bold">O usa una URL</span>
                <hr className="flex-1 border-gray-600" />
              </div>

              <input 
                type="text" 
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                className="w-full p-2 rounded text-black mb-4 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="Pega enlace de imagen"
              />
              
              <div className="flex gap-2 w-full">
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(false); }}
                  className="flex-1 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSave(); }}
                  className="flex-1 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors font-bold text-sm"
                >
                  Confirmar
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
