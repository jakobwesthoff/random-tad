import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper to get the next occurrence of a specific day of the week at a specific hour
export function getNextDayOfWeek(
  date: Date,
  dayOfWeek: number,
  hour: number,
): Date {
  const resultDate = new Date(date.getTime())

  // First calculate the next occurrence of the day of week
  resultDate.setDate(date.getDate() + ((7 + dayOfWeek - date.getDay()) % 7))

  // If it's the same day (today)...
  if (resultDate.getDay() === date.getDay()) {
    // ...and time is past the specified hour, move to NEXT week
    if (date.getHours() >= hour) {
      resultDate.setDate(resultDate.getDate() + 7)
    }
  }

  // Set to the specified hour
  resultDate.setHours(hour, 0, 0, 0)
  return resultDate
}
