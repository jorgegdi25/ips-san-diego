import { useBooking } from './booking/BookingContext';

export default function HeroSection() {
  const { open: openBooking } = useBooking();
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden bg-surface">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 z-10">
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight text-on-surface mb-6 leading-[1.1]">
            Transformamos sonrisas con{' '}
            <span className="text-primary-container italic">experiencia</span> y
            precisión
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
            Atención odontológica especializada enfocada en salud, estética y
            confianza. Descubre el estándar de cuidado que mereces.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => openBooking()} className="primary-gradient text-white px-8 py-4 rounded-lg font-headline font-bold text-base shadow-lg hover:shadow-xl transition-all active:scale-95">
              Agendar valoración
            </button>
            <button onClick={() => openBooking()} className="border-2 border-secondary text-secondary px-8 py-4 rounded-lg font-headline font-bold text-base hover:bg-secondary/5 transition-all">
              Ver tratamientos
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 relative">
          <div className="rounded-3xl overflow-hidden editorial-shadow transform md:translate-x-12">
            <img
              alt="Odontología San Diego"
              className="w-full h-[500px] object-cover"
              src="https://as2.ftcdn.net/v2/jpg/06/17/10/17/1000_F_617101788_rPcd8eND6DTdtzuI69rEDCHwxjZiQXBV.jpg"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl editorial-shadow max-w-[240px] hidden md:block border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-2">
              <span
                className="material-symbols-outlined text-primary-container filled"
              >
                verified_user
              </span>
              <span className="font-headline font-bold text-sm">
                Calidad Certificada
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Equipos de última generación para diagnósticos 100% precisos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
