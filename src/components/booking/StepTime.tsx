import { useState, useEffect } from 'react';
import type { TimeSlot } from '../../data/availabilityData';
import { getAvailableSlots, bookingServices } from '../../data/availabilityData';
import { useBooking } from './BookingContext';

export default function StepTime() {
  const { state, update, setStep } = useBooking();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const service = bookingServices.find((s) => s.id === state.serviceId);

  useEffect(() => {
    async function fetchSlots() {
      if (!state.date || !state.serviceId) return;
      setIsLoading(true);
      const available = await getAvailableSlots(state.date, state.serviceId);
      setSlots(available);
      setIsLoading(false);
    }
    fetchSlots();
  }, [state.date, state.serviceId]);

  const morningSlots = slots.filter((s) => {
    const h = parseInt(s.time.split(':')[0]);
    return h < 12;
  });

  const afternoonSlots = slots.filter((s) => {
    const h = parseInt(s.time.split(':')[0]);
    return h >= 12;
  });

  const selectTime = (time: string) => {
    update({ time });
    setStep(4);
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-2xl font-bold text-on-surface mb-1">
          Elige tu horario
        </h3>
        {state.date && (
          <p className="text-sm text-on-surface-variant capitalize">
            {formatDate(state.date)} · {service?.name} ({service?.duration} min)
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant">
          <div className="w-10 h-10 border-4 border-primary-container/20 border-t-primary-container rounded-full animate-spin mb-4"></div>
          <p className="font-headline font-bold text-sm animate-pulse">Sincronizando con Google Calendar...</p>
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2 block">
            event_busy
          </span>
          <p className="font-headline font-bold">No hay horarios disponibles</p>
          <p className="text-sm mt-1">Intenta con otra fecha</p>
          <button
            onClick={() => setStep(2)}
            className="mt-4 text-primary-container font-bold text-sm underline underline-offset-4"
          >
            Cambiar fecha
          </button>
        </div>
      ) : (
        <>
          {morningSlots.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-sm text-primary-container">
                  wb_sunny
                </span>
                <span className="font-headline font-bold text-xs uppercase tracking-widest text-secondary">
                  Mañana
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {morningSlots.map((s) => (
                  <button
                    key={s.time}
                    disabled={!s.available}
                    onClick={() => selectTime(s.time)}
                    className={`py-3 rounded-xl text-sm font-headline font-bold transition-all duration-150 ${
                      state.time === s.time
                        ? 'primary-gradient text-white shadow-lg'
                        : s.available
                        ? 'bg-surface-container-lowest border border-outline-variant/20 hover:border-primary-container text-on-surface'
                        : 'bg-surface-container-high/50 text-on-surface/20 cursor-not-allowed line-through'
                    }`}
                  >
                    {s.time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {afternoonSlots.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-sm text-primary-container">
                  wb_twilight
                </span>
                <span className="font-headline font-bold text-xs uppercase tracking-widest text-secondary">
                  Tarde
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {afternoonSlots.map((s) => (
                  <button
                    key={s.time}
                    disabled={!s.available}
                    onClick={() => selectTime(s.time)}
                    className={`py-3 rounded-xl text-sm font-headline font-bold transition-all duration-150 ${
                      state.time === s.time
                        ? 'primary-gradient text-white shadow-lg'
                        : s.available
                        ? 'bg-surface-container-lowest border border-outline-variant/20 hover:border-primary-container text-on-surface'
                        : 'bg-surface-container-high/50 text-on-surface/20 cursor-not-allowed line-through'
                    }`}
                  >
                    {s.time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
