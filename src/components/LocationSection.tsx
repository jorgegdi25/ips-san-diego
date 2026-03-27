import { useContent } from './ContentContext';
import EditableText from './editor/EditableText';
import EditableImage from './editor/EditableImage';
export default function LocationSection() {
  const { content, loading } = useContent();

  const locationInfo = content?.contact; // Fusionamos contacto y localización para simplificar
  const locationUI = content?.location;

  if (loading || !locationInfo || !locationUI) {
    return <div className="py-24 h-[400px] animate-pulse bg-surface-container-low" />;
  }

  return (
    <section id="sedes" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="rounded-3xl overflow-hidden editorial-shadow h-[450px]">
            <EditableImage
              section="location"
              fieldPath="mapImage"
              src={locationUI.mapImage}
              alt="Ubicación San Diego IPS"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="order-1 lg:order-2 space-y-8">
          <div>
            <EditableText
              section="location"
              fieldPath="title"
              value={locationUI.title}
              as="h2"
              className="font-display text-3xl font-bold text-on-surface mb-4 block"
            />
            <EditableText 
              section="location"
              fieldPath="description"
              value={locationUI.description}
              as="p"
              className="text-on-surface-variant leading-relaxed block"
              multiline
            />
          </div>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-primary-container mt-1">
                location_on
              </span>
              <div>
                <span className="block font-bold">Dirección</span>
                <EditableText
                  section="contact"
                  fieldPath="address"
                  value={locationInfo.address}
                  as="p"
                  className="text-sm text-on-surface-variant block"
                  multiline
                />
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-primary-container mt-1">
                schedule
              </span>
              <div>
                <span className="block font-bold">Horarios de Atención</span>
                <EditableText
                  section="contact"
                  fieldPath="schedule"
                  value={locationInfo.schedule}
                  as="p"
                  className="text-sm text-on-surface-variant whitespace-pre-line block"
                  multiline
                />
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden editorial-shadow h-48">
            <EditableImage
              section="location"
              fieldPath="interiorImage"
              src={locationUI.interiorImage}
              alt="Interior Clínica"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
