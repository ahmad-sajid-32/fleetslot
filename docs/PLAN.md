# Implementation plan and decisions

## Scope and source interpretation

The supplied implementation PDF and platform-neutral build prompt describe one feature: FleetSlot's complete vehicle operations scheduling slice. The selected repository was empty (a valid unborn branch with no commits); implementation therefore started from a small npm workspace monorepo. Document instructions were applied within the user's request to build this feature; their submission suggestions did not authorize publishing, pushing, recording a Loom, or inventing development history.

Where documents differ, the platform-neutral prompt supplies the more specific behavior: no Swagger and no fabricated `AI_JOURNEY.md`. No automated test files are committed. Temporary verification scripts were run outside the checkout; their actual outcomes are recorded separately.

## Architecture

```mermaid
flowchart TD
  Dashboard[Next.js dashboard and two React hooks] --> Proxy[Same-origin API proxy]
  Proxy --> Controllers[NestJS DTOs and thin controllers]
  Controllers --> BS[BookingsService]
  Controllers --> AS[AvailabilityService]
  BS --> AS
  BS --> VS[VehicleService]
  BS --> BR[BookingRepository]
  AS --> VS
  AS --> BR
  VS --> VR[VehicleRepository]
```

- `VehicleModule` owns the vehicle repository/service.
- `BookingStoreModule` exports the shared booking repository.
- `AvailabilityModule` imports those modules and calculates windows/conflicts directly from the repository, without depending on BookingsService.
- `BookingsModule` orchestrates complete candidate validation and synchronous create/update/delete.
- Constants are centralized in `backend/src/common/booking.constants.ts`.
- DTOs use class-validator/class-transformer, a strict global ValidationPipe, and mapped-types PartialType for updates. Explicit nulls are rejected; unknown properties cannot slip into storage.
- The UI uses a central API module and shared types, `useFleetScheduler` and `useAvailability`, focused components, and one token-driven stylesheet. AbortControllers prevent obsolete requests from replacing current filter/availability results.
- The shared create/edit form uses generated windows, displays authoritative 409 alternatives, and never silently resubmits. Native dialog provides focus containment, Escape handling, and focus restoration; closing is disabled during a save. Deletion requires confirmation.

## Delivery order

1. Generated the backend with the current NestJS CLI, then implemented constants, seeds, repositories, domain services, DTOs, and REST routes.
2. Built/type-checked and exercised the backend HTTP verification matrix before implementing frontend feature code.
3. Generated Next.js App Router with the official CLI, then implemented the data layer, dashboard, filters, dialog, slots, and conflict flow.
4. Built/type-checked both applications and verified real browser workflows and mobile layout.
5. Documented run instructions, API, limitations, verification, and reusable cloud setup.

## Adjustments and simplifications

- NestJS 12.1.2 and mapped-types 12.0.0 are used; the older mapped-types 2.x does not declare NestJS 12 peer compatibility. No force or legacy-peer-deps bypass was used.
- The current official Next.js CLI generated Next.js 16.4.0 rather than the PDF's 16.3.x. Generated TypeScript/ESM configuration was retained and exact dependencies are locked in the root lockfile.
- Both packages use one npm workspace lockfile and one root concurrently command. CLI-created example test files and irrelevant default assets were removed to match the specified scope.
- Tomorrow is initialized in the browser after hydration so static builds cannot freeze the default date or introduce a stale date hydration mismatch.
- The frontend uses a server-side Next.js rewrite instead of a browser-visible backend base URL. No extra credentials or browser network destinations are needed.
- Vehicle IDs are stable fictional `vehicle_1` through `vehicle_4`; new booking IDs use random UUIDs. Computed end time is calculated where needed, not persisted.
- Extra dashboard counts are derived from the filtered schedule. No global state library, database, or production infrastructure was added.

## Remaining constraints

In-memory state and single-process atomicity are intentional. Local dates assume compatible operator/server local timezones. Publication, GitHub push, cross-task snapshot restoration, and deployment are outside the checks performed here.
