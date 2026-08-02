export type ServiceType = "bath" | "fullgroom" | "nails" | "haircut" | "deshed"

export type AppointmentStatus = "confirmed" | "pending" | "completed"

export interface Appointment {
  id: string
  petName: string
  petBreed: string
  ownerName: string
  service: ServiceType
  groomer: string
  /** 0 = Monday ... 6 = Sunday, relative to the displayed week */
  dayOffset: number
  /** minutes from midnight, e.g. 9 * 60 = 540 */
  start: number
  /** duration in minutes */
  duration: number
  status: AppointmentStatus
  notes?: string
}

export const SERVICE_META: Record<
  ServiceType,
  { label: string; token: string }
> = {
  bath: { label: "Banho", token: "bath" },
  fullgroom: { label: "Banho e Tosa Completa", token: "fullgroom" },
  nails: { label: "Corte de Unhas", token: "nails" },
  haircut: { label: "Tosa Higiênica", token: "haircut" },
  deshed: { label: "Remoção de Subpelo", token: "deshed" },
}

export const GROOMERS = ["Marina", "Rafael", "Bianca"] as const

/** Salon opening hours, in whole hours (24h). */
export const DAY_START_HOUR = 8
export const DAY_END_HOUR = 19
export const SLOT_HEIGHT = 64 // px per hour

export const WEEKDAY_LABELS = [
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
  "Sáb",
  "Dom",
]

export const WEEKDAY_LABELS_FULL = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
]

/** Returns the Monday (00:00) of the week containing `date`. */
export function startOfWeek(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay() // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

export function formatMonthRange(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6)
  const monthFmt = new Intl.DateTimeFormat("pt-BR", { month: "long" })
  const startMonth = monthFmt.format(weekStart)
  const endMonth = monthFmt.format(weekEnd)
  const year = weekEnd.getFullYear()
  if (startMonth === endMonth) {
    return `${capitalize(startMonth)} de ${year}`
  }
  return `${capitalize(startMonth)} – ${capitalize(endMonth)} de ${year}`
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/**
 * Mock weekly schedule. dayOffset is relative to Monday so the data always
 * lands on whatever week is currently being displayed.
 */
export const APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    petName: "Thor",
    petBreed: "Golden Retriever",
    ownerName: "Ana Costa",
    service: "fullgroom",
    groomer: "Marina",
    dayOffset: 0,
    start: 9 * 60,
    duration: 90,
    status: "confirmed",
    notes: "Sensível nas patas traseiras.",
  },
  {
    id: "2",
    petName: "Mel",
    petBreed: "Poodle",
    ownerName: "Carlos Dias",
    service: "haircut",
    groomer: "Rafael",
    dayOffset: 0,
    start: 11 * 60,
    duration: 45,
    status: "confirmed",
  },
  {
    id: "3",
    petName: "Bidu",
    petBreed: "Shih Tzu",
    ownerName: "Juliana Reis",
    service: "bath",
    groomer: "Bianca",
    dayOffset: 0,
    start: 14 * 60,
    duration: 60,
    status: "pending",
  },
  {
    id: "4",
    petName: "Luna",
    petBreed: "Husky Siberiano",
    ownerName: "Pedro Alves",
    service: "deshed",
    groomer: "Marina",
    dayOffset: 1,
    start: 10 * 60,
    duration: 120,
    status: "confirmed",
    notes: "Muito subpelo, reservar tempo extra.",
  },
  {
    id: "5",
    petName: "Nina",
    petBreed: "Yorkshire",
    ownerName: "Fernanda Lima",
    service: "nails",
    groomer: "Bianca",
    dayOffset: 1,
    start: 13 * 60 + 30,
    duration: 30,
    status: "confirmed",
  },
  {
    id: "6",
    petName: "Rex",
    petBreed: "Pastor Alemão",
    ownerName: "Marcos Souza",
    service: "bath",
    groomer: "Rafael",
    dayOffset: 1,
    start: 15 * 60,
    duration: 75,
    status: "pending",
  },
  {
    id: "7",
    petName: "Amora",
    petBreed: "Lhasa Apso",
    ownerName: "Beatriz Nunes",
    service: "fullgroom",
    groomer: "Marina",
    dayOffset: 2,
    start: 8 * 60 + 30,
    duration: 90,
    status: "confirmed",
  },
  {
    id: "8",
    petName: "Pipoca",
    petBreed: "Maltês",
    ownerName: "Rodrigo Melo",
    service: "haircut",
    groomer: "Bianca",
    dayOffset: 2,
    start: 11 * 60,
    duration: 45,
    status: "completed",
  },
  {
    id: "9",
    petName: "Bob",
    petBreed: "Beagle",
    ownerName: "Camila Rocha",
    service: "nails",
    groomer: "Rafael",
    dayOffset: 2,
    start: 16 * 60,
    duration: 30,
    status: "confirmed",
  },
  {
    id: "10",
    petName: "Fiona",
    petBreed: "Border Collie",
    ownerName: "Lucas Prado",
    service: "fullgroom",
    groomer: "Marina",
    dayOffset: 3,
    start: 9 * 60,
    duration: 105,
    status: "confirmed",
  },
  {
    id: "11",
    petName: "Simba",
    petBreed: "Chow Chow",
    ownerName: "Patrícia Gomes",
    service: "deshed",
    groomer: "Rafael",
    dayOffset: 3,
    start: 13 * 60,
    duration: 120,
    status: "pending",
    notes: "Primeira visita ao salão.",
  },
  {
    id: "12",
    petName: "Toby",
    petBreed: "Dachshund",
    ownerName: "Gabriel Teixeira",
    service: "bath",
    groomer: "Bianca",
    dayOffset: 3,
    start: 16 * 60,
    duration: 45,
    status: "confirmed",
  },
  {
    id: "13",
    petName: "Cacau",
    petBreed: "Cocker Spaniel",
    ownerName: "Renata Barros",
    service: "haircut",
    groomer: "Marina",
    dayOffset: 4,
    start: 8 * 60 + 30,
    duration: 60,
    status: "confirmed",
  },
  {
    id: "14",
    petName: "Zeus",
    petBreed: "Labrador",
    ownerName: "Thiago Moreira",
    service: "bath",
    groomer: "Rafael",
    dayOffset: 4,
    start: 10 * 60 + 30,
    duration: 75,
    status: "confirmed",
  },
  {
    id: "15",
    petName: "Belinha",
    petBreed: "Pug",
    ownerName: "Larissa Fonseca",
    service: "nails",
    groomer: "Bianca",
    dayOffset: 4,
    start: 14 * 60,
    duration: 30,
    status: "pending",
  },
  {
    id: "16",
    petName: "Fred",
    petBreed: "Schnauzer",
    ownerName: "Vinícius Castro",
    service: "fullgroom",
    groomer: "Marina",
    dayOffset: 4,
    start: 15 * 60,
    duration: 90,
    status: "confirmed",
  },
  {
    id: "17",
    petName: "Maya",
    petBreed: "Spitz Alemão",
    ownerName: "Débora Pinto",
    service: "fullgroom",
    groomer: "Bianca",
    dayOffset: 5,
    start: 9 * 60,
    duration: 90,
    status: "confirmed",
  },
  {
    id: "18",
    petName: "Duke",
    petBreed: "Rottweiler",
    ownerName: "Eduardo Ramos",
    service: "bath",
    groomer: "Rafael",
    dayOffset: 5,
    start: 11 * 60,
    duration: 75,
    status: "confirmed",
  },
  {
    id: "19",
    petName: "Frida",
    petBreed: "Bulldog Francês",
    ownerName: "Sofia Cardoso",
    service: "nails",
    groomer: "Marina",
    dayOffset: 5,
    start: 13 * 60,
    duration: 30,
    status: "pending",
  },
]
