import { useContent } from './ContentContext';
import EditableText from './editor/EditableText';
import EditableImage from './editor/EditableImage';

export default function DoctorSection() {
  const { content, loading } = useContent();

  const doctor = content?.doctor;

  if (loading || !doctor) {
    return <div className="h-[600px] animate-pulse bg-surface" />;
  }

  return (
    <section id="especialistas" className="py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <EditableText
            section="doctor"
            fieldPath="title"
            value={doctor.title}
            as="span"
            className="font-headline font-bold text-xs uppercase tracking-[0.2em] text-primary-container mb-4 block"
          />
          <EditableText
            section="doctor"
            fieldPath="name"
            value={doctor.name}
            as="h2"
            className="font-display text-4xl md:text-5xl font-bold text-on-surface"
          />
          <EditableText
            section="doctor"
            fieldPath="role"
            value={doctor.role}
            as="p"
            className="text-on-surface-variant mt-4 max-w-2xl mx-auto text-lg block"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Photo */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden editorial-shadow h-[550px]">
                <EditableImage
                  section="doctor"
                  fieldPath="image"
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Floating accent */}
              <div className="absolute -bottom-4 -right-4 bg-white p-5 rounded-2xl editorial-shadow hidden md:flex items-center gap-3 border border-outline-variant/10">
                <span className="material-symbols-outlined filled text-primary-container text-3xl">
                  verified
                </span>
                <div>
                  <span className="font-headline font-bold text-sm block">Certificado</span>
                  <span className="text-xs text-on-surface-variant">Federación Odontológica</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-7 space-y-8">
            <EditableText
              section="doctor"
              fieldPath="quote"
              value={doctor.quote}
              multiline
              as="blockquote"
              className="text-xl md:text-2xl font-display italic text-on-surface-variant leading-relaxed border-l-4 border-primary-container pl-6 block"
            />

            <EditableText
              section="doctor"
              fieldPath="description"
              value={doctor.description}
              multiline
              as="p"
              className="text-on-surface-variant leading-relaxed block"
            />

            {/* Credentials */}
            <div>
              <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-secondary mb-4">
                Formación Académica
              </h3>
              <ul className="space-y-3">
                {doctor.credentials.map((cred, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary-container text-lg mt-0.5">
                      check_circle
                    </span>
                    <EditableText
                      section="doctor"
                      fieldPath={`credentials.${i}`}
                      value={cred}
                      as="span"
                      className="text-sm text-on-surface-variant flex-1"
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* Highlights grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {doctor.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-surface-container-lowest p-4 rounded-xl editorial-shadow"
                >
                  <EditableText
                    section="doctor"
                    fieldPath={`highlights.${i}.icon`}
                    value={h.icon}
                    as="span"
                    className="material-symbols-outlined text-primary-container block"
                  />
                  <EditableText
                    section="doctor"
                    fieldPath={`highlights.${i}.label`}
                    value={h.label}
                    as="span"
                    className="font-headline font-semibold text-xs text-on-surface block"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
