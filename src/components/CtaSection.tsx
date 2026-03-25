import { useBooking } from './booking/BookingContext';

export default function CtaSection() {
  const { open: openBooking } = useBooking();
  return (
    <section className="py-20 px-8">
      <div className="max-w-7xl mx-auto bg-[#FFF5ED] rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-on-primary-container mb-6 max-w-3xl mx-auto leading-tight">
            Agenda tu valoración hoy y recibe diagnóstico profesional
          </h2>
          <p className="text-on-primary-fixed-variant text-lg mb-10 max-w-xl mx-auto">
            El primer paso hacia tu nueva sonrisa comienza con una cita
            personalizada. Nuestro equipo está listo para atenderte.
          </p>
          <button onClick={() => openBooking()} className="primary-gradient text-white px-12 py-5 rounded-full font-headline font-extrabold text-lg shadow-xl shadow-primary-container/20 hover:scale-105 transition-transform active:scale-95">
            Reservar Cita Ahora
          </button>
        </div>
      </div>
    </section>
  );
}
