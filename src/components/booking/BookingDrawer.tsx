import { useBooking } from './BookingContext';
import StepService from './StepService';
import StepDoctor from './StepDoctor';
import StepCalendar from './StepCalendar';
import StepTime from './StepTime';
import StepConfirm from './StepConfirm';

const STEPS = ['Servicio', 'Doctor', 'Fecha', 'Hora', 'Confirmar'];

export default function BookingDrawer() {
  const { isOpen, close, step, setStep } = useBooking();

  const renderStep = () => {
    switch (step) {
      case 0: return <StepService />;
      case 1: return <StepDoctor />;
      case 2: return <StepCalendar />;
      case 3: return <StepTime />;
      case 4: return <StepConfirm />;
      default: return null;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-[70] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={close}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-[80] bg-surface w-full sm:w-[480px] shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/15">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg primary-gradient flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm">
                calendar_month
              </span>
            </div>
            <span className="font-headline font-bold text-sm">
              Agendar Cita
            </span>
          </div>
          <button
            onClick={close}
            className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">
              close
            </span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-1">
            {STEPS.map((label, i) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`h-1 w-full rounded-full transition-colors duration-300 ${
                    i <= step ? 'primary-gradient' : 'bg-surface-container-high'
                  }`}
                />
                <span
                  className={`text-[10px] font-headline font-semibold transition-colors ${
                    i <= step ? 'text-primary-container' : 'text-on-surface-variant/40'
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-24 overflow-y-auto" style={{ height: 'calc(100% - 130px)' }}>
          {renderStep()}
        </div>

        {/* Back button - fixed bottom */}
        {step > 0 && step < 4 && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-surface via-surface to-transparent">
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors font-headline font-semibold text-sm"
            >
              <span className="material-symbols-outlined text-lg">
                arrow_back
              </span>
              Volver
            </button>
          </div>
        )}
      </div>
    </>
  );
}
