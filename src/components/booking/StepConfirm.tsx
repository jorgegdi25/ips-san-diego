import { useState } from 'react';
import { bookingServices, bookingDoctors } from '../../data/availabilityData';
import { useBooking } from './BookingContext';

export default function StepConfirm() {
  const { state, update, close } = useBooking();
  const [submitted, setSubmitted] = useState(false);

  const service = bookingServices.find((s) => s.id === state.serviceId);
  const doctor = bookingDoctors.find((d) => d.id === state.doctorId);

  const formatDate = (d: Date) =>
    d.toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission — would call API here
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="w-20 h-20 rounded-full primary-gradient mx-auto flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-4xl">
            check
          </span>
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold text-on-surface mb-2">
            ¡Cita Confirmada!
          </h3>
          <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
            Hemos registrado tu cita. Te enviaremos un recordatorio por
            WhatsApp al número {state.patientPhone}.
          </p>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-6 text-left space-y-3 max-w-sm mx-auto">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Servicio</span>
            <span className="font-bold">{service?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Doctor</span>
            <span className="font-bold">
              {doctor?.name ?? 'Cualquier disponible'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Fecha</span>
            <span className="font-bold capitalize">
              {state.date && formatDate(state.date)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Hora</span>
            <span className="font-bold">{state.time}</span>
          </div>
        </div>

        <button
          onClick={close}
          className="primary-gradient text-white px-8 py-3 rounded-xl font-headline font-bold text-sm hover:opacity-90 transition-all active:scale-95"
        >
          Cerrar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-2xl font-bold text-on-surface mb-1">
          Confirma tu cita
        </h3>
        <p className="text-sm text-on-surface-variant">
          Completa tus datos y revisaremos tu solicitud
        </p>
      </div>

      {/* Summary card */}
      <div className="bg-surface-container-low rounded-2xl p-5 space-y-2">
        <div className="flex items-center gap-3 text-sm">
          <span className="material-symbols-outlined text-primary-container text-lg">
            medical_services
          </span>
          <span>
            <strong>{service?.name}</strong> · {service?.duration} min
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="material-symbols-outlined text-primary-container text-lg">
            person
          </span>
          <span>{doctor?.name ?? 'Cualquier especialista'}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="material-symbols-outlined text-primary-container text-lg">
            calendar_today
          </span>
          <span className="capitalize">
            {state.date && formatDate(state.date)} — {state.time}
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-headline font-bold text-secondary uppercase tracking-widest mb-2">
            Nombre completo
          </label>
          <input
            type="text"
            required
            value={state.patientName}
            onChange={(e) => update({ patientName: e.target.value })}
            placeholder="Ej: María García"
            className="w-full bg-surface-container-lowest border-b-2 border-outline-variant/30 focus:border-primary-container rounded-lg px-4 py-3 text-sm outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-headline font-bold text-secondary uppercase tracking-widest mb-2">
            Teléfono / WhatsApp
          </label>
          <input
            type="tel"
            required
            value={state.patientPhone}
            onChange={(e) => update({ patientPhone: e.target.value })}
            placeholder="Ej: 310 123 4567"
            className="w-full bg-surface-container-lowest border-b-2 border-outline-variant/30 focus:border-primary-container rounded-lg px-4 py-3 text-sm outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-headline font-bold text-secondary uppercase tracking-widest mb-2">
            Correo electrónico
          </label>
          <input
            type="email"
            value={state.patientEmail}
            onChange={(e) => update({ patientEmail: e.target.value })}
            placeholder="Ej: maria@email.com (opcional)"
            className="w-full bg-surface-container-lowest border-b-2 border-outline-variant/30 focus:border-primary-container rounded-lg px-4 py-3 text-sm outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-headline font-bold text-secondary uppercase tracking-widest mb-2">
            Notas adicionales
          </label>
          <textarea
            value={state.patientNotes}
            onChange={(e) => update({ patientNotes: e.target.value })}
            placeholder="¿Tienes algún requerimiento especial?"
            rows={2}
            className="w-full bg-surface-container-lowest border-b-2 border-outline-variant/30 focus:border-primary-container rounded-lg px-4 py-3 text-sm outline-none transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!state.patientName || !state.patientPhone}
          className="w-full primary-gradient text-white py-4 rounded-xl font-headline font-bold text-base shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirmar Cita
        </button>
      </form>
    </div>
  );
}
