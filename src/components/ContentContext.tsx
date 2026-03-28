import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import defaultContentData from '../data/content.json';

export interface HeroContent {
  title: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
  image: string;
  badgeIcon: string;
  badgeTitle: string;
  badgeText: string;
}

export interface ServiceContent {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface ContactContent {
  address: string;
  schedule: string;
  email: string;
  phone: string;
  whatsappUrl: string;
}

export interface DoctorContent {
  title: string;
  name: string;
  role: string;
  quote: string;
  description: string;
  image: string;
  credentials: string[];
  highlights: { icon: string; label: string }[];
}

export interface AuthorityContent {
  title: string;
  description: string;
  stats: { value: string; label: string }[];
}

export interface ResultsContent {
  title: string;
  images: string[];
}

export interface TestimonialContent {
  name: string;
  role: string;
  text: string;
  avatar: string;
}

export interface CtaContent {
  title: string;
  description: string;
  buttonText: string;
}

export interface FeatureFlags {
  aiChat: boolean;
  booking: boolean;
  analytics: boolean;
  visualEditor: boolean;
  whatsappFloating: boolean;
}

export interface Content {
  hero: HeroContent;
  services: ServiceContent[];
  contact: ContactContent;
  location: any;
  doctor: DoctorContent;
  authority: AuthorityContent;
  results: ResultsContent;
  testimonials: TestimonialContent[];
  cta: CtaContent;
  features: FeatureFlags;
}

interface ContentContextType {
  content: Content | null;
  loading: boolean;
  error: string | null;
  isEditorActive: boolean;
  setIsEditorActive: (active: boolean) => void;
  updateLocalContent: (newContent: Content) => void;
  updateContentField: (section: keyof Content, path: string, value: any) => void;
  refreshContent: () => Promise<void>;
  saveToServer: (token: string) => Promise<boolean>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<Content | null>(defaultContentData as Content);
  const contentRef = useRef<Content | null>(defaultContentData as Content);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [isEditorActive, setIsEditorActive] = useState(false);

  useEffect(() => {
    // Check if editor is active from localStorage
    const storedState = localStorage.getItem('isEditorActive');
    if (storedState === 'true') {
      setIsEditorActive(true);
    }
  }, []);

  const handleSetEditorActive = (active: boolean) => {
    setIsEditorActive(active);
    localStorage.setItem('isEditorActive', String(active));
  };

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content');
      if (!response.ok) throw new Error('Error al cargar contenido');
      const data = await response.json();
      
      if (data.services && typeof data.services === 'object' && !Array.isArray(data.services)) {
        data.services = Object.values(data.services);
      }
      
      // En caso de que falten nuevas secciones en Google Sheets, las rellenamos con las locales
      const mergedData = { ...defaultContentData, ...data };
      
      setContent(mergedData);
      contentRef.current = mergedData;
    } catch (err: any) {
      console.warn('Usando contenido local por defecto. No se pudo cargar del servidor:', err);
      // No modificamos error de estado para no estropear la UI; fallamos silenciosamente
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const updateLocalContent = (newContent: Content) => {
    setContent(newContent);
    contentRef.current = newContent;
  };

  const updateContentField = (section: keyof Content, path: string, value: any) => {
    setContent(prev => {
      if (!prev) return prev;
      const newContent = { ...prev };
      
      const sectionData = Array.isArray(newContent[section]) 
        ? [...(newContent[section] as any[])] 
        : { ...(newContent[section] as any) };
        
      newContent[section] = sectionData as any;

      if (path.includes('.')) {
        const parts = path.split('.');
        const lastPart = parts.pop()!;
        let current: any = sectionData;
        
        for (const p of parts) {
          if (Array.isArray(current[p])) {
            current[p] = [...current[p]];
          } else if (typeof current[p] === 'object' && current[p] !== null) {
            current[p] = { ...current[p] };
          } else {
            // Failsafe mostly
            current[p] = {};
          }
          current = current[p];
        }
        current[lastPart] = value;
      } else {
        (sectionData as any)[path] = value;
      }
      
      contentRef.current = newContent;
      return newContent;
    });
  };

  const saveToServer = async (token: string): Promise<boolean> => {
    const dataToSave = contentRef.current;
    if (!dataToSave) return false;
    
    try {
      const response = await fetch('/api/update-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) {
        let errorMsg = 'Error desconocido';
        try {
          const errorData = await response.json();
          errorMsg = JSON.stringify(errorData, null, 2);
        } catch(e) {}
        alert('Detalle de Error Vercel:\\n' + errorMsg);
        return false;
      }
      return true;
    } catch (err: any) {
      console.error('Error saving content:', err);
      alert('Error de Red: ' + err.message);
      return false;
    }
  };

  return (
    <ContentContext.Provider value={{ 
      content, 
      loading, 
      error, 
      isEditorActive,
      setIsEditorActive: handleSetEditorActive,
      updateLocalContent, 
      updateContentField,
      refreshContent: fetchContent,
      saveToServer
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
