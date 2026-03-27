import { useBooking } from './booking/BookingContext';
import { useContent } from './ContentContext';
import EditableText from './editor/EditableText';
import EditableImage from './editor/EditableImage';

export default function HeroSection() {
  const { open: openBooking } = useBooking();
  const { content, loading } = useContent();

  const hero = content?.hero;

  if (loading || !hero) {
    return <div className="h-[600px] animate-pulse bg-surface-container-low" />;
  }

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden bg-surface">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 z-10">
          <EditableText 
            section="hero" 
            fieldPath="title" 
            value={hero.title} 
            as="h1" 
            className="font-display text-5xl md:text-7xl font-black tracking-tight text-on-surface mb-6 leading-[1.1] block" 
            multiline 
          />
          <EditableText 
            section="hero" 
            fieldPath="subtitle" 
            value={hero.subtitle} 
            as="p" 
            className="text-on-surface-variant text-lg md:text-xl max-w-lg mb-10 leading-relaxed block" 
            multiline 
          />
          <div className="flex flex-wrap gap-4">
            <button onClick={() => openBooking()} className="primary-gradient text-white px-8 py-4 rounded-lg font-headline font-bold text-base shadow-lg hover:shadow-xl transition-all active:scale-95">
              <EditableText section="hero" fieldPath="primaryButton" value={hero.primaryButton} />
            </button>
            <button onClick={() => openBooking()} className="border-2 border-secondary text-secondary px-8 py-4 rounded-lg font-headline font-bold text-base hover:bg-secondary/5 transition-all">
              <EditableText section="hero" fieldPath="secondaryButton" value={hero.secondaryButton} />
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 relative">
          <div className="rounded-3xl overflow-hidden editorial-shadow transform md:translate-x-12 h-[500px]">
             <EditableImage
              section="hero"
              fieldPath="image"
              src={hero.image}
              alt="Odontología San Diego"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl editorial-shadow max-w-[240px] hidden md:block border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-2">
              <span
                className="material-symbols-outlined text-primary-container filled"
              >
                {hero.badgeIcon}
              </span>
              <EditableText 
                section="hero" 
                fieldPath="badgeTitle" 
                value={hero.badgeTitle} 
                as="span" 
                className="font-headline font-bold text-sm block" 
              />
            </div>
            <EditableText 
              section="hero" 
              fieldPath="badgeText" 
              value={hero.badgeText} 
              as="p" 
              className="text-xs text-on-surface-variant block" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
