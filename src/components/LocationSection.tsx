import { locationInfo } from '../data/siteData';

export default function LocationSection() {
  return (
    <section id="sedes" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="rounded-3xl overflow-hidden editorial-shadow h-[450px]">
            <img
              alt="Ubicación San Diego IPS"
              className="w-full h-full object-cover"
              src={locationInfo.mapImage}
            />
          </div>
        </div>
        <div className="order-1 lg:order-2 space-y-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-on-surface mb-4">
              Nuestra Sede Principal
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              Visítanos en nuestras instalaciones diseñadas para brindarte
              confort y tranquilidad desde tu ingreso.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-primary-container mt-1">
                location_on
              </span>
              <div>
                <span className="block font-bold">Dirección</span>
                <p className="text-sm text-on-surface-variant">
                  {locationInfo.address}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-primary-container mt-1">
                schedule
              </span>
              <div>
                <span className="block font-bold">Horarios de Atención</span>
                <p className="text-sm text-on-surface-variant whitespace-pre-line">
                  {locationInfo.schedule}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden editorial-shadow h-48">
            <img
              alt="Interior Clínica"
              className="w-full h-full object-cover"
              src={locationInfo.interiorImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
