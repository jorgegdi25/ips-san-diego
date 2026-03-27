import { useContent } from './ContentContext';
import EditableText from './editor/EditableText';
import EditableImage from './editor/EditableImage';

function Stars() {
  return (
    <div className="flex gap-1 text-primary-container mb-4">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="material-symbols-outlined filled">
          star
        </span>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const { content, loading } = useContent();
  const testimonials = content?.testimonials;

  if (loading || !testimonials) {
    return <div className="h-[400px] animate-pulse bg-surface" />;
  }

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-8 bg-surface-container-lowest rounded-2xl editorial-shadow relative"
            >
              <Stars />
              <EditableText
                section="testimonials"
                fieldPath={`${i}.text`}
                value={t.text}
                multiline
                as="p"
                className="text-on-surface italic mb-8"
              />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                  <EditableImage
                    section="testimonials"
                    fieldPath={`${i}.avatar`}
                    src={t.avatar}
                    alt={t.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <EditableText
                    section="testimonials"
                    fieldPath={`${i}.name`}
                    value={t.name}
                    as="span"
                    className="block font-headline font-bold text-sm"
                  />
                  <EditableText
                    section="testimonials"
                    fieldPath={`${i}.role`}
                    value={t.role}
                    as="span"
                    className="block text-xs text-on-surface-variant mt-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
