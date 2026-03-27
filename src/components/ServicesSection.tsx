import { useContent } from './ContentContext';
import EditableText from './editor/EditableText';
import EditableImage from './editor/EditableImage';
export default function ServicesSection() {
  const { content, loading } = useContent();

  const services = content?.services || [];

  if (loading) {
    return <div className="py-28 h-[600px] animate-pulse bg-surface-container-low" />;
  }

  return (
    <section id="servicios" className="py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl font-bold text-on-surface mb-4">
            Especialidades Dentales
          </h2>
          <div className="w-16 h-1 bg-primary-container mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-surface-container-lowest rounded-2xl overflow-hidden editorial-shadow hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="h-56 overflow-hidden">
                <EditableImage 
                  section="services"
                  fieldPath={`${index}.image`}
                  src={service.image}
                  alt={service.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <EditableText 
                  section="services"
                  fieldPath={`${index}.title`}
                  value={service.title}
                  as="h3"
                  className="font-headline font-bold text-xl mb-3 block"
                />
                <EditableText 
                  section="services"
                  fieldPath={`${index}.description`}
                  value={service.description}
                  as="p"
                  className="text-on-surface-variant text-sm mb-6 line-clamp-2 block"
                  multiline
                />
                <button className="flex items-center gap-2 text-primary-container font-bold text-sm group/btn">
                  Ver detalles{' '}
                  <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          ))}

          {/* More services placeholder */}
          <div className="border-2 border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-surface-container-low/30">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">
              more_horiz
            </span>
            <h3 className="font-headline font-bold text-lg mb-2">
              Más Servicios
            </h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Ortodoncia, Implantes, Blanqueamiento y más.
            </p>
            <button className="text-primary font-bold text-sm underline underline-offset-4">
              Explorar catálogo completo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
