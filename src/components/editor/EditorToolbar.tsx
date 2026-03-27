import { useState } from 'react';
import { useContent } from '../ContentContext';

export default function EditorToolbar() {
  const { isEditorActive, setIsEditorActive, saveToServer } = useContent();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isEditorActive) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    // Check for token in localStorage (saved during login)
    const token = localStorage.getItem('adminToken') || prompt('Introduce la contraseña maestra para guardar:');
    
    if (!token) {
      setIsSaving(false);
      return;
    }

    const success = await saveToServer(token);
    if (success) {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
      // Ensure token is saved if it worked
      localStorage.setItem('adminToken', token);
    } else {
      setSaveStatus('error');
      // Clear invalid token
      localStorage.removeItem('adminToken');
    }
    setIsSaving(false);
  };

  const handleExit = () => {
    setIsEditorActive(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-surface-container-high border-b border-outline-variant shadow-lg z-[9999] px-6 py-3 flex items-center justify-between animate-slide-down">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
        <span className="font-bold text-on-surface">Modo Edición Activado</span>
        <span className="text-sm text-on-surface-variant hidden md:inline">Haz clic en cualquier texto o imagen para editar.</span>
      </div>
      
      <div className="flex items-center gap-4">
        {saveStatus === 'success' && <span className="text-green-500 text-sm font-bold flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Guardado</span>}
        {saveStatus === 'error' && <span className="text-error text-sm font-bold flex items-center gap-1"><span className="material-symbols-outlined text-sm">error</span> Error al guardar</span>}
        
        <button 
          onClick={handleExit}
          className="px-4 py-2 text-on-surface-variant hover:text-on-surface transition-colors text-sm font-medium"
        >
          Salir sin guardar
        </button>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-primary text-on-primary rounded-full font-bold hover:bg-primary-hover transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving ? (
            <span className="material-symbols-outlined animate-spin">refresh</span>
          ) : (
            <span className="material-symbols-outlined">save</span>
          )}
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );
}
