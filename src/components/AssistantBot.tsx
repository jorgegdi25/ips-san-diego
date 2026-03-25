import { useState } from 'react';
import { useBooking } from './booking/BookingContext';

interface QuickOption {
  label: string;
  icon: string;
  serviceId: string;
}

const OPTIONS: QuickOption[] = [
  { label: 'Dolor dental', icon: 'sentiment_stressed', serviceId: 'endodontics' },
  { label: 'Estética dental', icon: 'auto_awesome', serviceId: 'smile-design' },
  { label: 'Limpieza', icon: 'cleaning_services', serviceId: 'preventive' },
  { label: 'Revisión general', icon: 'assignment', serviceId: 'general' },
];

export default function AssistantBot() {
  const [isOpen, setIsOpen] = useState(false);
  const { open: openBooking } = useBooking();

  const handleOption = (serviceId: string) => {
    setIsOpen(false);
    openBooking(serviceId);
  };

  return (
    <>
      {/* Chat bubble */}
      {isOpen && (
        <div className="fixed bottom-28 left-8 z-[60] w-80 bg-white rounded-2xl editorial-shadow overflow-hidden animate-in">
          {/* Header */}
          <div className="primary-gradient px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white">
                support_agent
              </span>
            </div>
            <div>
              <span className="block text-white font-headline font-bold text-sm">
                Asistente San Diego
              </span>
              <span className="block text-white/70 text-xs">En línea</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto text-white/70 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            {/* Bot message */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full primary-gradient flex-shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">
                  smart_toy
                </span>
              </div>
              <div className="bg-surface-container-low rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-on-surface">
                ¡Hola! 👋 Soy tu asistente virtual.
                <br />
                <strong>¿Qué necesitas hoy?</strong>
              </div>
            </div>

            {/* Quick options */}
            <div className="grid grid-cols-2 gap-2 pl-11">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleOption(opt.serviceId)}
                  className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-3 py-2.5 text-xs font-headline font-semibold text-on-surface hover:border-primary-container hover:bg-primary-container/5 transition-all"
                >
                  <span className="material-symbols-outlined text-primary-container text-base">
                    {opt.icon}
                  </span>
                  {opt.label}
                </button>
              ))}
            </div>

            {/* WhatsApp fallback */}
            <div className="pl-11">
              <a
                href="https://wa.me/yourphonenumber"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-on-surface-variant hover:text-[#25D366] transition-colors"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                Prefiero hablar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 left-8 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-[60] transition-all duration-300 ${
          isOpen
            ? 'bg-secondary text-white rotate-0'
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
