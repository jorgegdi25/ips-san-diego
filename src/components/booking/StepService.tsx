import { bookingServices } from '../../data/availabilityData';
import { useBooking } from './BookingContext';

export default function StepService() {
  const { state, update, setStep } = useBooking();

  const select = (id: string) => {
    update({ serviceId: id });
    setStep(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-2xl font-bold text-on-surface mb-1">
          ¿Qué servicio necesitas?
        </h3>
        <p className="text-sm text-on-surface-variant">
          Selecciona el tratamiento para tu cita
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {bookingServices.map((s) => (
          <button
            key={s.id}
            onClick={() => select(s.id)}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              state.serviceId === s.id
                ? 'border-primary-container bg-primary-container/10'
                : 'border-outline-variant/20 bg-surface-container-lowest hover:border-primary-container/50'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              state.serviceId === s.id
                ? 'primary-gradient text-white'
                : 'bg-surface-container-high text-primary-container'
            }`}>
              <span className="material-symbols-outlined">{s.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="block font-headline font-bold text-sm">
                {s.name}
              </span>
              <span className="block text-xs text-on-surface-variant truncate">
                {s.description}
              </span>
            </div>
            <span className="text-xs font-headline font-bold text-primary-container whitespace-nowrap">
              {s.duration} min
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
