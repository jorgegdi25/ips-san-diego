import { bookingDoctors } from '../../data/availabilityData';
import { useBooking } from './BookingContext';

export default function StepDoctor() {
  const { state, update, setStep } = useBooking();

  const select = (id: string) => {
    update({ doctorId: id });
    setStep(2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-2xl font-bold text-on-surface mb-1">
          Elige tu especialista
        </h3>
        <p className="text-sm text-on-surface-variant">
          Todos nuestros profesionales están certificados
        </p>
      </div>

      <div className="space-y-3">
        {bookingDoctors.map((d) => (
          <button
            key={d.id}
            onClick={() => select(d.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              state.doctorId === d.id
                ? 'border-primary-container bg-primary-container/10'
                : 'border-outline-variant/20 bg-surface-container-lowest hover:border-primary-container/50'
            }`}
          >
            <div className="w-14 h-14 rounded-full bg-surface-container-high overflow-hidden flex-shrink-0">
              {d.avatar ? (
                <img
                  src={d.avatar}
                  alt={d.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-2xl">person</span>
                </div>
              )}
            </div>
            <div>
              <span className="block font-headline font-bold text-sm">
                {d.name}
              </span>
              <span className="block text-xs text-on-surface-variant">
                {d.specialty}
              </span>
            </div>
            {state.doctorId === d.id && (
              <span className="material-symbols-outlined text-primary-container ml-auto filled">
                check_circle
              </span>
            )}
          </button>
        ))}

        <button
          onClick={() => {
            update({ doctorId: 'any' });
            setStep(2);
          }}
          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
            state.doctorId === 'any'
              ? 'border-primary-container bg-primary-container/10'
              : 'border-dashed border-outline-variant/30 bg-surface-container-low/30 hover:border-primary-container/50'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-surface-variant text-2xl">
              groups
            </span>
          </div>
          <div>
            <span className="block font-headline font-bold text-sm">
              Sin preferencia
            </span>
            <span className="block text-xs text-on-surface-variant">
              Cualquier especialista disponible
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
