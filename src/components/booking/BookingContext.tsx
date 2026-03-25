import { createContext, useContext, useState, type ReactNode } from 'react';

interface BookingState {
  serviceId: string;
  doctorId: string;
  date: Date | null;
  time: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientNotes: string;
}

interface BookingContextType {
  step: number;
  setStep: (s: number) => void;
  state: BookingState;
  update: (partial: Partial<BookingState>) => void;
  reset: () => void;
  isOpen: boolean;
  open: (preselectedServiceId?: string) => void;
  close: () => void;
}

const initial: BookingState = {
  serviceId: '',
  doctorId: '',
  date: null,
  time: '',
  patientName: '',
  patientPhone: '',
  patientEmail: '',
  patientNotes: '',
};

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<BookingState>(initial);
  const [isOpen, setIsOpen] = useState(false);

  const update = (partial: Partial<BookingState>) =>
    setState((prev) => ({ ...prev, ...partial }));

  const reset = () => {
    setState(initial);
    setStep(0);
  };

  const open = (preselectedServiceId?: string) => {
    reset();
    if (preselectedServiceId) {
      setState((prev) => ({ ...prev, serviceId: preselectedServiceId }));
      setStep(1); // skip to doctor if service pre-selected
    }
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    // Keep state briefly for animation, then reset
    setTimeout(reset, 300);
  };

  return (
    <BookingContext.Provider
      value={{ step, setStep, state, update, reset, isOpen, open, close }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
