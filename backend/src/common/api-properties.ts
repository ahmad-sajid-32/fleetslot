import type { ApiPropertyOptions } from '@nestjs/swagger';
import { SCHEDULE } from './booking.constants.js';
import { clock } from './time.utils.js';

// Reuse the scheduling constants in documentation as well as runtime validation.
export const ID_PROPERTY = {
  type: String,
  pattern: '^[a-zA-Z0-9_-]{1,80}$',
  example: 'vehicle_1',
} satisfies ApiPropertyOptions;
export const DATE_PROPERTY = {
  type: String,
  format: 'date',
  pattern: '^\\d{4}-\\d{2}-\\d{2}$',
  example: '2026-10-10',
  description:
    'Plain local calendar date (YYYY-MM-DD). Scheduling and availability require today or later; replace example dates before trying requests.',
} satisfies ApiPropertyOptions;
export const START_TIME_PROPERTY = {
  type: String,
  pattern: '^([01]\\d|2[0-3]):[0-5]\\d$',
  example: '10:00',
  description: `Local HH:mm time, aligned to ${SCHEDULE.interval}-minute starts. The whole operation must fit within ${clock(SCHEDULE.start)}–${clock(SCHEDULE.end)}.`,
} satisfies ApiPropertyOptions;
export const DURATION_PROPERTY = {
  type: 'integer',
  minimum: SCHEDULE.minDuration,
  maximum: SCHEDULE.maxDuration,
  multipleOf: SCHEDULE.increment,
  example: 60,
  description: 'Operation duration in minutes.',
} satisfies ApiPropertyOptions;
