import { useState } from 'react';
import { isDayAvailable } from '../../data/availabilityData';
import { useBooking } from './BookingContext';

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: (Date | null)[] = [];

  // Monday=0 offset
  let startOffset = (firstDay.getDay() + 6) % 7;
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

export default function StepCalendar() {
  const { state, update, setStep } = useBooking();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const days = getCalendarDays(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const selectDay = (date: Date) => {
    update({ date, time: '' });
    setStep(3);
  };

  const isSelected = (date: Date) =>
    state.date?.toDateString() === date.toDateString();

  const isToday = (date: Date) =>
    date.toDateString() === today.toDateString();

  // Don't allow going before current month
  const canGoPrev = viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-2xl font-bold text-on-surface mb-1">
          Selecciona la fecha
        </h3>
        <p className="text-sm text-on-surface-variant">
          Elige el día que te sea más conveniente
        </p>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors disabled:opacity-30"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <span className="font-headline font-bold text-lg">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS.map((d) => (
          <span
            key={d}
            className="text-xs font-headline font-bold text-on-surface-variant py-2"
          >
            {d}
          </span>
        ))}

        {/* Calendar days */}
        {days.map((date, i) =>
          date === null ? (
            <div key={`empty-${i}`} />
          ) : (
            <button
              key={date.toISOString()}
              disabled={!isDayAvailable(date)}
              onClick={() => selectDay(date)}
              className={`aspect-square rounded-xl flex items-center justify-center text-sm font-headline font-semibold transition-all duration-150 ${
                isSelected(date)
                  ? 'primary-gradient text-white shadow-lg'
                  : isToday(date)
                  ? 'bg-primary-container/15 text-primary-container font-bold'
                  : isDayAvailable(date)
                  ? 'hover:bg-primary-container/10 text-on-surface cursor-pointer'
                  : 'text-on-surface/20 cursor-not-allowed'
              }`}
            >
              {date.getDate()}
            </button>
          )
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-6 justify-center text-xs text-on-surface-variant pt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full primary-gradient" />
          <span>Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary-container/15" />
          <span>Hoy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-surface-container-high" />
          <span>No disponible</span>
        </div>
      </div>
    </div>
  );
}
