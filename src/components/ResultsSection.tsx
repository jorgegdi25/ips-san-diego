import { useContent } from './ContentContext';
import EditableText from './editor/EditableText';
import EditableImage from './editor/EditableImage';

export default function ResultsSection() {
  const { content, loading } = useContent();
  const results = content?.results;

  if (loading || !results) {
    return <div className="h-[400px] animate-pulse bg-surface-container-high/30" />;
  }

  return (
    <section className="py-24 bg-surface-container-high/30">
      <div className="max-w-7xl mx-auto px-8">
        <EditableText
          section="results"
          fieldPath="title"
          value={results.title}
          as="h2"
          className="font-display text-4xl font-bold text-on-surface text-center mb-16"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.images.map((src, i) => (
            <div
              key={i}
              className="relative rounded-xl overflow-hidden editorial-shadow group h-64"
            >
              <EditableImage
                section="results"
                fieldPath={`images.${i}`}
                src={src}
                alt="Resultado clínico"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="text-white font-headline font-bold px-4 py-2 border border-white rounded-full text-sm bg-black/40">
                  Ver Caso Clínico
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
