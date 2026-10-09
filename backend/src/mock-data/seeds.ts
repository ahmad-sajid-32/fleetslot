import type { Vehicle } from '../vehicles/vehicle.entity.js';
import { BookingType, type Booking } from '../bookings/booking.entity.js';
import { localDate } from '../common/date.utils.js';
import { SCHEDULE } from '../common/booking.constants.js';
import { clock, minutes } from '../common/time.utils.js';
export const vehicles: Vehicle[] = [
  ['Tesla', 'Model 3', '101'],
  ['Jeep', 'Wrangler', '202'],
  ['Honda', 'Civic', '303'],
  ['Ford', 'Mustang', '404'],
  ['Toyota', 'Corolla', '505'],
  ['Hyundai', 'Tucson', '606'],
  ['Kia', 'Sportage', '707'],
  ['BMW', '320i', '808'],
].map(([make, model, plate], i) => ({
  id: `vehicle_${i + 1}`,
  make,
  model,
  year: 2025,
  plateNumber: `DEMO-${plate}`,
  active: i !== 3,
}));
type SeedBooking = [
  vehicle: number,
  day: number,
  startTime: string,
  duration: number,
  type: BookingType,
  title: string,
  description: string,
];

const operations = [
  {
    type: BookingType.CLEANING,
    durations: [30, 60, 90],
    title: 'Cabin and exterior clean',
    description:
      'Vacuum the cabin, wash the exterior, and restock the demo vehicle kit.',
  },
  {
    type: BookingType.CLEANING,
    durations: [60, 90],
    title: 'Deep interior detail',
    description: 'Clean upholstery, sanitize touchpoints, and check the trunk.',
  },
  {
    type: BookingType.INSPECTION,
    durations: [30, 60],
    title: 'Pre-trip inspection',
    description:
      'Record mileage and check tires, lights, and exterior condition.',
  },
  {
    type: BookingType.INSPECTION,
    durations: [30, 60],
    title: 'Post-return condition check',
    description: 'Review the vehicle condition and note any follow-up work.',
  },
  {
    type: BookingType.MAINTENANCE,
    durations: [60, 90, 120],
    title: 'Tire rotation and pressure check',
    description: 'Rotate tires and inspect tread wear at the demo workshop.',
  },
  {
    type: BookingType.MAINTENANCE,
    durations: [90, 120, 150],
    title: 'Oil and filter service',
    description:
      'Replace engine oil and filters, then complete the service checklist.',
  },
  {
    type: BookingType.MAINTENANCE,
    durations: [60, 90],
    title: 'Brake and fluid check',
    description: 'Inspect brake pads and top up fluids as needed.',
  },
  {
    type: BookingType.PICKUP_HANDOFF,
    durations: [30, 60],
    title: 'North lot pickup',
    description:
      'Prepare keys and complete a walkthrough at the fictional North lot.',
  },
  {
    type: BookingType.PICKUP_HANDOFF,
    durations: [30, 60],
    title: 'City depot handoff',
    description:
      'Confirm the demo handoff checklist and record departure mileage.',
  },
  {
    type: BookingType.RETURN_HANDOFF,
    durations: [30, 60],
    title: 'Airport depot return',
    description:
      'Receive keys and record fuel level at the fictional airport depot.',
  },
  {
    type: BookingType.RETURN_HANDOFF,
    durations: [30],
    title: 'Evening trip return',
    description:
      'Complete the return checklist and park in the demo holding area.',
  },
];

export function seedBookings(): Booking[] {
  const now = new Date().toISOString();
  const initial: SeedBooking[] = [
    [
      1,
      1,
      '10:00',
      60,
      BookingType.CLEANING,
      'Interior refresh',
      'Prepare the demo vehicle for its next handoff.',
    ],
    [
      1,
      1,
      '13:00',
      30,
      BookingType.PICKUP_HANDOFF,
      'Afternoon pickup',
      'Meet at the fictional North lot.',
    ],
    [
      2,
      1,
      '09:30',
      30,
      BookingType.INSPECTION,
      'Return inspection',
      'Check condition and record mileage.',
    ],
    [
      3,
      1,
      '11:00',
      120,
      BookingType.MAINTENANCE,
      'Routine service',
      'Demo tire and fluid check.',
    ],
    [
      4,
      1,
      '14:00',
      60,
      BookingType.MAINTENANCE,
      'Workshop hold',
      'Existing operation; vehicle is inactive.',
    ],
    [
      1,
      2,
      '09:00',
      30,
      BookingType.RETURN_HANDOFF,
      'Morning return',
      'Receive keys at the demo lot.',
    ],
    [
      2,
      2,
      '10:00',
      60,
      BookingType.CLEANING,
      'Turnaround clean',
      'Prepare for the next demo trip.',
    ],
  ];
  const bookings: Booking[] = initial.map(
    ([v, day, time, duration, type, title, description], i) => ({
      id: `booking_${i + 1}`,
      vehicleId: `vehicle_${v}`,
      date: localDate(day),
      startTime: time,
      durationMinutes: duration,
      type,
      title,
      description,
      createdAt: now,
      updatedAt: now,
    }),
  );

  // A fixed seed gives varied demo schedules that are reproducible on restart.
  let randomState = 41723;
  function randomIndex(length: number) {
    randomState = (Math.imul(1664525, randomState) + 1013904223) >>> 0;
    return Math.floor((randomState / 0x100000000) * length);
  }
  const activeVehicles = vehicles.filter((vehicle) => vehicle.active);
  for (let day = 1; day <= 14; day++) {
    const shuffled = [...activeVehicles];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = randomIndex(i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Introduce all four new vehicles on the default (tomorrow) board.
    const dailyVehicles =
      day === 1
        ? activeVehicles.filter((vehicle) =>
            ['vehicle_5', 'vehicle_6', 'vehicle_7', 'vehicle_8'].includes(
              vehicle.id,
            ),
          )
        : shuffled.slice(0, 4 + randomIndex(4));
    const date = localDate(day);
    for (const vehicle of dailyVehicles) {
      // EVs get tire/brake work rather than an engine oil service.
      const suitableOperations =
        vehicle.make === 'Tesla'
          ? operations.filter(
              (operation) => operation.title !== 'Oil and filter service',
            )
          : operations;
      const operation =
        suitableOperations[randomIndex(suitableOperations.length)];
      const durationMinutes =
        operation.durations[randomIndex(operation.durations.length)];
      const availableStarts: number[] = [];
      for (
        let start = SCHEDULE.start;
        start + durationMinutes <= SCHEDULE.end;
        start += SCHEDULE.interval
      ) {
        const overlaps = bookings.some(
          (booking) =>
            booking.vehicleId === vehicle.id &&
            booking.date === date &&
            start < minutes(booking.startTime) + booking.durationMinutes &&
            start + durationMinutes > minutes(booking.startTime),
        );
        if (!overlaps) availableStarts.push(start);
      }
      if (!availableStarts.length) continue;
      bookings.push({
        id: `booking_${bookings.length + 1}`,
        vehicleId: vehicle.id,
        date,
        startTime: clock(availableStarts[randomIndex(availableStarts.length)]),
        durationMinutes,
        type: operation.type,
        title: operation.title,
        description: operation.description,
        createdAt: now,
        updatedAt: now,
      });
    }
  }
  return bookings;
}
