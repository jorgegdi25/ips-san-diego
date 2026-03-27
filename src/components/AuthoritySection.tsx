import { useContent } from './ContentContext';
import EditableText from './editor/EditableText';

export default function AuthoritySection() {
  const { content, loading } = useContent();
  const authority = content?.authority;

  if (loading || !authority) {
    return <div className="h-[400px] animate-pulse bg-surface-container-low" />;
  }

  return (
    <section className="py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
          <div className="lg:col-span-1">
            <EditableText
              section="authority"
              fieldPath="title"
              value={authority.title}
              as="h2"
              className="font-display text-4xl font-bold text-secondary leading-tight mb-6"
            />
            <EditableText
              section="authority"
              fieldPath="description"
              value={authority.description}
              multiline
              as="p"
              className="text-on-surface-variant leading-relaxed"
            />
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8">
            {authority.stats.map((stat, i) => (
              <div
                key={i}
                className="p-8 bg-surface-container-lowest rounded-2xl editorial-shadow text-center"
              >
                <EditableText
                  section="authority"
                  fieldPath={`stats.${i}.value`}
                  value={stat.value}
                  as="span"
                  className="block text-4xl font-extrabold text-primary-container mb-2"
                />
                <EditableText
                  section="authority"
                  fieldPath={`stats.${i}.label`}
                  value={stat.label}
                  as="span"
                  className="font-headline font-bold text-secondary uppercase tracking-widest text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
