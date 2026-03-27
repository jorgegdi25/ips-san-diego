import { useState, useRef, useEffect } from 'react';
import { useBooking } from './booking/BookingContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AssistantBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! 👋 Soy tu asistente de San Diego IPS. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { open: openBooking } = useBooking();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      if (data.content) {
        setMessages([...newMessages, { role: 'assistant', content: data.content }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: 'Lo siento, tuve un problema. ¿Podrías intentar de nuevo?' }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { role: 'assistant', content: 'Lo siento, no pude conectarme. Revisa tu conexión.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const QuickOption = ({ label, icon, serviceId }: { label: string, icon: string, serviceId: string }) => (
    <button
      onClick={() => openBooking(serviceId)}
      className="flex items-center gap-2 bg-primary-container/10 border border-primary-container/20 rounded-xl px-3 py-2 text-xs font-headline font-semibold text-primary-container hover:bg-primary-container/20 transition-all text-left"
    >
      <span className="material-symbols-outlined text-base">{icon}</span>
      {label}
    </button>
  );

  return (
    <>
      {/* Ventana de Chat */}
      {isOpen && (
        <div className="fixed bottom-24 left-8 z-[60] w-[350px] h-[500px] bg-white rounded-2xl editorial-shadow flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="primary-gradient px-5 py-4 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white">support_agent</span>
            </div>
            <div className="flex-1">
              <span className="block text-white font-headline font-bold text-sm leading-none mb-1">
                Asistente San Diego
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>
                <span className="text-white/70 text-[10px] uppercase tracking-wider font-bold">En línea</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Cuerpo - Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-container-lowest">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full primary-gradient flex-shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-sm">smart_toy</span>
                  </div>
                )}
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary-container text-on-primary-container rounded-tr-sm' 
                      : 'bg-surface-container-low text-on-surface rounded-tl-sm'
                  }`}
                >
                  {msg.content}
                  
                  {/* Sugerencia de reservación si el bot lo menciona */}
                  {msg.role === 'assistant' && (msg.content.toLowerCase().includes('agendar') || msg.content.toLowerCase().includes('cita')) && (
                    <div className="mt-3 pt-3 border-t border-outline-variant/20">
                      <button 
                        onClick={() => openBooking()}
                        className="w-full primary-gradient text-white rounded-lg py-2 text-xs font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">event</span>
                        Agendar Valoración Ahora
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full primary-gradient flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm">smart_toy</span>
                </div>
                <div className="bg-surface-container-low rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Footer - Input */}
          <div className="p-4 bg-white border-t border-outline-variant/10 shrink-0">
            {messages.length < 3 && !isLoading && (
              <div className="flex flex-wrap gap-2 mb-4">
                <QuickOption label="Dolor dental" icon="sentiment_stressed" serviceId="endodontics" />
                <QuickOption label="Estética" icon="auto_awesome" serviceId="smile-design" />
                <QuickOption label="Limpieza" icon="cleaning_services" serviceId="preventive" />
              </div>
            )}
            
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-12"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-1.5 w-9 h-9 flex items-center justify-center rounded-lg bg-primary-container text-on-primary-container hover:bg-primary transition-colors disabled:opacity-50 disabled:grayscale"
              >
                <span className="material-symbols-outlined text-xl">send</span>
              </button>
            </div>
            
            <div className="mt-3 text-center">
              <a
                href="https://wa.me/573000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-on-surface-variant hover:text-[#25D366] transition-colors font-semibold flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[12px]">chat</span>
                PREFIERO HABLAR POR WHATSAPP
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Botón Flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 left-8 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-[60] transition-all duration-300 ${
          isOpen
            ? 'bg-secondary text-white'
            : 'primary-gradient text-white hover:scale-110'
        }`}
        aria-label="Asistente virtual"
      >
        <span className="material-symbols-outlined text-2xl">
          {isOpen ? 'close' : 'support_agent'}
        </span>
      </button>
    </>
  );
}

