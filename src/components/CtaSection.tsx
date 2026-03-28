import { useBooking } from './booking/BookingContext';
import { useContent } from './ContentContext';
import EditableText from './editor/EditableText';

export default function CtaSection() {
  const { open: openBooking } = useBooking();
  const { content, loading } = useContent();
  const cta = content?.cta;
  const features = content?.features;
  const whatsappUrl = content?.contact?.whatsappUrl || 'https://wa.me/yourphonenumber';

  const handleCtaClick = () => {
    if (features?.booking) {
      openBooking();
    } else {
      window.open(whatsappUrl, '_blank');
    }
  };

  if (loading || !cta) {
    return <div className="h-[400px] animate-pulse bg-[#FFF5ED]" />;
  }

  return (
    <section className="py-20 px-8">
      <div className="max-w-7xl mx-auto bg-[#FFF5ED] rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <EditableText
            section="cta"
            fieldPath="title"
            value={cta.title}
            as="h2"
            multiline
            className="font-display text-3xl md:text-5xl font-bold text-on-primary-container mb-6 max-w-3xl mx-auto leading-tight"
          />
          <EditableText
            section="cta"
            fieldPath="description"
            value={cta.description}
            as="p"
            multiline
            className="text-on-primary-fixed-variant text-lg mb-10 max-w-xl mx-auto block"
          />
          <button onClick={handleCtaClick} className="primary-gradient text-white px-12 py-5 rounded-full font-headline font-extrabold text-lg shadow-xl shadow-primary-container/20 hover:scale-105 transition-transform active:scale-95">
            <EditableText section="cta" fieldPath="buttonText" value={cta.buttonText} />
          </button>
        </div>
      </div>
    </section>
  );
}
