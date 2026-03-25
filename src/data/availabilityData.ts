export interface ServiceOption {
  id: string;
  name: string;
  duration: number; // minutes
  icon: string;
  description: string;
}

export interface DoctorOption {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export const bookingServices: ServiceOption[] = [
  {
    id: 'smile-design',
    name: 'Diseño de sonrisa',
    duration: 60,
    icon: 'auto_awesome',
    description: 'Evaluación estética completa y plan personalizado',
  },
  {
    id: 'endodontics',
    name: 'Endodoncia',
    duration: 90,
    icon: 'healing',
    description: 'Tratamiento de conducto con tecnología rotatoria',
  },
  {
    id: 'periodontics',
    name: 'Periodoncia',
    duration: 60,
    icon: 'health_and_safety',
    description: 'Cuidado integral de encías y tejidos',
  },
  {
    id: 'oral-surgery',
    name: 'Cirugía oral',
    duration: 90,
    icon: 'surgical',
    description: 'Procedimientos quirúrgicos especializados',
  },
  {
    id: 'preventive',
    name: 'Consulta preventiva',
    duration: 30,
    icon: 'stethoscope',
    description: 'Revisión general y limpieza dental',
  },
  {
    id: 'general',
    name: 'Valoración general',
    duration: 30,
    icon: 'assignment',
    description: 'Primera consulta y diagnóstico profesional',
  },
];

export const bookingDoctors: DoctorOption[] = [
  {
    id: 'dr-gustavo',
    name: 'Dr. Gustavo Sánchez',
    specialty: 'Rehabilitación Oral',
    avatar: '/doctor-gustavo.png',
  },
  {
    id: 'dra-martinez',
    name: 'Dra. Laura Martínez',
    specialty: 'Endodoncia',
    avatar: '',
  },
  {
    id: 'dr-ramirez',
    name: 'Dr. Carlos Ramírez',
    specialty: 'Periodoncia y Cirugía',
    avatar: '',
  },
];

// Mock schedule: clinic open Mon-Fri 8-19, Sat 9-14, Sun closed
const WEEKDAY_START = 8;
const WEEKDAY_END = 19;
const SATURDAY_START = 9;
const SATURDAY_END = 14;

function generateSlots(startHour: number, endHour: number, durationMin: number): TimeSlot[] {
  const slots: TimeSlot[] = [];
  let hour = startHour;
  let minute = 0;

  while (hour + durationMin / 60 <= endHour) {
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    // Randomly mark ~25% as unavailable to simulate bookings
    const available = Math.random() > 0.25;
    slots.push({ time: timeStr, available });

    minute += durationMin;
    while (minute >= 60) {
      minute -= 60;
      hour++;
    }
  }

  return slots;
}

// Seed a deterministic random per date so slots don't change on re-render
function seedRandom(dateStr: string) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  // Simple seeded random
  const seed = Math.abs(hash);
  const origRandom = Math.random;
  let s = seed;
  Math.random = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  return () => {
    Math.random = origRandom;
  };
}

export function getAvailableSlots(
  date: Date,
  serviceId: string
): TimeSlot[] {
  const day = date.getDay(); // 0=Sun, 6=Sat
  if (day === 0) return []; // Sunday – closed

  const service = bookingServices.find((s) => s.id === serviceId);
  const duration = service?.duration ?? 30;

  const dateStr = date.toISOString().split('T')[0];
  const restore = seedRandom(dateStr + serviceId);

  let slots: TimeSlot[];
  if (day === 6) {
    slots = generateSlots(SATURDAY_START, SATURDAY_END, duration);
  } else {
    slots = generateSlots(WEEKDAY_START, WEEKDAY_END, duration);
  }

  restore();
  return slots;
}

export function isDayAvailable(date: Date): boolean {
  const day = date.getDay();
  if (day === 0) return false; // Sunday
  // Past dates not available
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return false;
  return true;
}

export async function confirmBooking(data: {
  service: string;
  doctor: string;
  date: string;
  time: string;
  name: string;
  phone: string;
}) {
  try {
    const response = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to book');
    
    return { success: true, message: result.message };
  } catch (error: any) {
    console.error('Booking confirmation failed:', error);
    return { success: false, error: error.message };
  }
}
