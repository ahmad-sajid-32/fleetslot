# FleetSlot

Fleet operators need to coordinate vehicle handoffs, inspections, cleaning, and maintenance without double-booking a vehicle. FleetSlot is a focused operator dashboard with generated availability and actionable alternatives when a window conflicts.

## Run locally

Prerequisites: Node.js 24 LTS and npm 11 or newer. No database, credentials, or external service accounts are required.

From the repository root, install the locked dependencies once:

```sh
npm ci
```

Start both applications with one command:

```sh
npm run dev
```

The frontend uses port 3000 and the API uses port 3001. Stop both with Ctrl+C. In the cloud machine, a writable npm cache is available at `/workspace/.npm-cache`; use `npm_config_cache=/workspace/.npm-cache npm ci` when refreshing dependencies.

```sh
npm run build       # build both applications
npm run typecheck   # type-check both applications
```

To run the production builds, start `npm run start -w backend` and `npm run start -w frontend` in separate terminals after building. Data resets whenever the backend restarts.

Default settings require no env files. `backend/.env.example` documents `PORT` and `FRONTEND_ORIGIN` (set these in the shell); `frontend/.env.example` documents the server-side `API_URL` override (Next.js also reads `.env.local`). The frontend proxies `/api/*` to the backend so browser requests stay on the frontend origin. Backend CORS allows the configured frontend origin.

## Frontend styling and API integration

The frontend uses Tailwind CSS **4.3.3**, the latest stable release checked on October 9, 2026, with the matching `@tailwindcss/postcss` plugin. `frontend/postcss.config.mjs` configures the build. The CSS entry file, `frontend/src/styles/styles.css`, contains only the Tailwind import and theme definitions; component styling, responsive layouts, focus/disabled/selected states, and reduced-motion behavior use utilities.

All original color token names and values are preserved in `@theme static`. Use semantic utilities such as `bg-brand`, `text-text-secondary`, `border-border`, and `bg-cleaning/9`. Repeated control utilities live in `frontend/src/lib/styles.ts`. Operation colors use complete, statically declared utility names so all variants are included in production builds. No separate Tailwind JavaScript configuration or component CSS is needed.

**API integration is implemented.** `frontend/src/lib/api.ts` calls the real NestJS REST endpoints through the same-origin `/api` proxy in `frontend/next.config.ts`. `useFleetScheduler` loads vehicles/bookings and performs create, update, and delete requests. `useAvailability` fetches current windows, including edit exclusion; authoritative 409 responses drive selectable conflict alternatives in the dialog. Backend storage remains in memory and resets on restart.

## Swagger / OpenAPI

The repository-root [`swagger.yaml`](swagger.yaml) is an OpenAPI 3.0 document generated from the NestJS controllers and DTOs. Start the backend with `npm run dev`; on either the API port (3001) or frontend port (3000), use:

| Path                | Purpose                                      |
| ------------------- | -------------------------------------------- |
| `/api/docs`         | Interactive Swagger UI, including Try it out |
| `/api/swagger.yaml` | Live YAML document                           |
| `/api/swagger.json` | Live JSON document                           |

All seven API operations, request/query models, response models, and domain error codes are documented, including both kinds of 409 and conflict alternative windows. Example dates are illustrative; replace them with today or a future local date when scheduling. Try it out changes the same in-memory bookings as the dashboard.

After changing API routes or DTO metadata, run these commands from the repository root:

```sh
npm run swagger:generate  # build the backend and update swagger.yaml
npm run swagger:check     # build and fail if the checked-in YAML is stale
```

Every HTTP 200 operation has an explicit JSON example; creation includes a 201 example, and deletion documents a bodyless 204. Create and PATCH bodies include selectable request examples.

Both commands compile into the ignored `backend/.swagger-build` directory and create the API document without opening a listening port, so they can run alongside the development server. Commit the generated file alongside API changes. Server startup serves live documentation from the same metadata without rewriting the checked-in YAML.

## Scheduling rules

- Local calendar dates, today or later; workday 09:00–17:00.
- Starts every 30 minutes; durations 30–240 minutes in 30-minute increments.
- Overlap prevention applies to the same vehicle and date. Adjacent windows and simultaneous operations on different vehicles are allowed.
- Slots are generated on request, never stored. End time is derived from start and duration.
- Conflicts return up to three alternatives with the same date, vehicle, and duration: later windows ascending, then earlier windows descending.
- Inactive vehicles retain existing bookings but cannot be scheduled. Edit availability excludes the current booking; PATCH validates the entire merged candidate.

Four fictional vehicles and seven bookings are seeded for tomorrow and the following day. The dashboard opens tomorrow. All demo records and plates are fictional.

## API reference

All endpoints use `/api` and JSON. Errors return `{ code, message }`; only `BOOKING_CONFLICT` includes `suggestions: [{ startTime, endTime }]`.

| Method | Path                                                                | Behavior                                                      |
| ------ | ------------------------------------------------------------------- | ------------------------------------------------------------- |
| GET    | `/vehicles`                                                         | All vehicles, including inactive vehicles                     |
| GET    | `/bookings?date=&vehicleId=&type=`                                  | Bookings with optional filters                                |
| GET    | `/bookings/:id`                                                     | Booking or `404 BOOKING_NOT_FOUND`                            |
| POST   | `/bookings`                                                         | Create, `201`                                                 |
| PATCH  | `/bookings/:id`                                                     | Partial update, `200`                                         |
| DELETE | `/bookings/:id`                                                     | Hard delete, empty `204`                                      |
| GET    | `/availability?vehicleId=&date=&durationMinutes=&excludeBookingId=` | All valid candidate windows, each with an `available` boolean |

Example request (replace the date with today or a future local date):

```json
{
  "title": "Interior cleaning",
  "description": "Prepare for the next handoff",
  "type": "CLEANING",
  "vehicleId": "vehicle_1",
  "date": "2026-10-13",
  "startTime": "10:00",
  "durationMinutes": 60
}
```

Operation types: `PICKUP_HANDOFF`, `RETURN_HANDOFF`, `INSPECTION`, `CLEANING`, `MAINTENANCE`.

Error codes: `VALIDATION_ERROR`, `PAST_DATE`, `INVALID_SLOT`, `INVALID_DURATION`, `OUTSIDE_WORKING_HOURS`, `VEHICLE_NOT_FOUND`, `BOOKING_NOT_FOUND`, `VEHICLE_INACTIVE`, `BOOKING_CONFLICT`. DTO errors use `VALIDATION_ERROR`; domain validation uses the corresponding specific code. Unknown request fields are rejected.

## Verify the workflow

1. Open the dashboard: tomorrow shows five operations grouped across four vehicles, including the inactive Ford's existing booking.
2. Filter by Tesla and Cleaning; only the interior cleaning operation remains. Restore all filters.
3. Schedule an operation: change vehicle/date/duration and check that windows refresh, occupied windows remain visible and disabled, and inactive vehicles are disabled.
4. Create a Jeep inspection at 10:00 tomorrow, when Tesla cleaning is also scheduled. This is allowed because the vehicles differ.
5. Edit an operation. Its current window remains selectable; changing duration or vehicle recomputes availability.
6. Delete an operation and confirm deletion; the schedule refreshes.
7. For stale availability, open a second browser tab on the same vehicle/date. Select the same free window in both dialogs. Save in one tab, then save in the other. The second receives a conflict, shows alternatives, and requires an explicit save after choosing one.
8. Check a narrow screen: filters stack, cards fit the viewport, and the dialog scrolls with reachable actions.

For direct API inspection:

```sh
curl -i http://localhost:3001/api/vehicles
curl -i 'http://localhost:3001/api/bookings?vehicleId=vehicle_1'
# Replace YYYY-MM-DD with a future local date:
curl -i 'http://localhost:3001/api/availability?vehicleId=vehicle_1&date=YYYY-MM-DD&durationMinutes=60'
```

See [verification evidence](docs/VERIFICATION.md) for the executed checks and [implementation decisions](docs/PLAN.md) for architecture and plan adjustments.

## Limitations

Storage is an in-memory repository. Restarting the backend discards all changes and recreates seeds. This implementation assumes one Node.js process: conflict validation and mutation execute synchronously without an `await` between them. Multiple processes or persistent storage would require transactional locking or database constraints.

The server and browser use their local calendar date; they should share the operator's timezone. Full business timezone handling is outside scope. There is no authentication, persistent database, payments, calendar/Turo sync, notifications, renter verification, recurring scheduling, or deployment infrastructure. No automated test files are committed, in accordance with the implementation plan; reproducible manual/API and browser checks were executed during implementation. `docs/AI_JOURNEY.md` is left to the project owner.
