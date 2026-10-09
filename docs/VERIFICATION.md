# Verification evidence

These checks were executed in the cloud machine on October 9, 2026. They describe observed results, not intended behavior. API verification used actual HTTP requests with response status/body assertions; browser verification used headless Chromium with Playwright. Temporary verification scripts and screenshots were kept outside the checkout. No automated test files are committed, as requested by the supplied implementation plan.

## Backend gate (passed before frontend feature implementation)

| Check                                                             | Observed result                                                       |
| ----------------------------------------------------------------- | --------------------------------------------------------------------- |
| Four vehicles, including inactive Ford                            | Passed                                                                |
| Valid create                                                      | 201                                                                   |
| Same-vehicle overlap                                              | 409 BOOKING_CONFLICT, three same-duration windows ordered later first |
| Same time, different vehicle                                      | 201                                                                   |
| Adjacent same-vehicle windows                                     | 201                                                                   |
| Invalid duration: zero, too large, fraction, non-multiple         | 400 VALIDATION_ERROR                                                  |
| Invalid calendar date, malformed time, blank title, unknown field | 400 VALIDATION_ERROR                                                  |
| Past local date                                                   | 400 PAST_DATE                                                         |
| Off-grid start                                                    | 400 INVALID_SLOT                                                      |
| Window beyond working hours                                       | 400 OUTSIDE_WORKING_HOURS                                             |
| Inactive create and availability                                  | 409 VEHICLE_INACTIVE                                                  |
| Missing vehicle                                                   | 404 VEHICLE_NOT_FOUND                                                 |
| Edit retaining current window                                     | 200, no self-conflict                                                 |
| Edit into overlap                                                 | 409 BOOKING_CONFLICT                                                  |
| Explicit null updates                                             | 400 VALIDATION_ERROR                                                  |
| Update to inactive vehicle                                        | 409 VEHICLE_INACTIVE                                                  |
| Availability for 60 minutes                                       | 15 candidate windows, final end 17:00                                 |
| Occupied window                                                   | Present with available=false                                          |
| Edit availability exclusion                                       | Current window available                                              |
| Missing exclusion booking                                         | 404 BOOKING_NOT_FOUND                                                 |
| Booking filters and invalid queries                               | Correct filtered records and 400 for invalid queries                  |
| Fetch one/missing booking                                         | 200 / 404 BOOKING_NOT_FOUND                                           |
| Delete                                                            | 204 with zero response bytes; subsequent GET 404                      |

All temporary bookings were deleted after checking.

## Additional boundary checks (passed)

- With no later valid window, earlier suggestions appear in descending start order.
- Two 240-minute operations fill the working day; all 16 half-hour candidates are unavailable and suggestions are empty.
- When only one alternative exists, exactly one is returned.
- An edit that would exceed 17:00 returns 400 and leaves the original duration unchanged.
- Today is accepted.
- Unknown API routes receive a consistent machine-readable 404 error.

## Browser workflow (passed)

- Tomorrow's board: five seeded operations grouped across four vehicles, retaining inactive history.
- Vehicle and operation-type filtering.
- Occupied windows remain visible/disabled; inactive select options have their native disabled property.
- Escape closes the native scheduling dialog.
- Create with a real stale availability race: another API request books the selected window after the dialog loads; saving receives 409, displays three alternative chips, and choosing a chip waits for explicit resubmission.
- Create success closes the dialog and refreshes the board.
- Edit keeps the current window selectable and saves updates.
- Confirmed delete refreshes the board.
- At 390×844: filters stack, no horizontal document overflow, dialog fits and its controls remain usable.
- No browser page/runtime exceptions during the verified workflow.

The initial browser pass exposed dropdown accessible names containing option text; explicit aria-labels corrected this and the workflow was rerun successfully. A temporary earlier API process occupied port 3001; it was stopped before verifying both services under the root command. These failures were diagnosed and corrected.

## Tooling checks

`npm run build` and `npm run typecheck` passed for both workspaces. The root `npm run dev` command started both applications; the UI exercised the same-origin API rewrite.

Installation was repeated successfully with `npm ci --no-audit --no-fund`, followed by both production builds and both type checks. Startup readiness was rechecked on both direct and proxied API endpoints, with seven fresh seeds.

The final browser workflow also passed against the production servers. A separate production check moved the browser clock forward one day and confirmed tomorrow was computed at browser startup, with the correct subsequent-day seeds and no hydration/runtime exceptions.

## Saved cloud configuration

The environment draft saved the complete `install_script` (frozen dependency installation, builds, and type checks) and `start_skill` (existing checkout, root development command, restart behavior, and functional readiness checks). Draft saving is confirmed; publication is a separate user action in environment settings.

## Swagger / OpenAPI addition

Verified on October 9, 2026 after Swagger was requested:

- Generated `swagger.yaml` passes OpenAPI 3.0 schema validation and includes all seven operations.
- All five HTTP 200 operations include explicit JSON examples. All five request examples and 34 success/error response examples validate against their documented schemas.
- Live success/error responses validate against the same models, including both 409 variants and the empty 204 response. Create required fields, PATCH optional fields, duration constraints, filters, and edit-exclusion parameters are documented.
- PATCH retains partial/empty update support, preserves omitted fields, permits clearing notes with an empty string, and rejects explicit nulls, invalid durations, and unknown fields.
- Live `/api/swagger.json` and `/api/swagger.yaml` match the checked-in document on both API and frontend ports.
- Chromium rendered all seven Swagger UI operations and executed GET vehicles successfully with HTTP 200 through both ports; no browser runtime errors occurred.
- `npm run swagger:check` passes for the current file. Deliberately stale content caused the check to fail, and restoring the file returned it to passing.
- Running `npm run swagger:generate` while the development server was active preserved an existing in-memory booking, confirming the isolated documentation build does not restart or interfere with the API.
- Backend build and both workspace type checks passed. Temporary verification bookings were deleted.

## Verification limits

No production deployment, GitHub push, environment publication, fresh-task snapshot restoration, cross-timezone behavior, or multi-process concurrency was verified. Persistence, authentication, calendar sync, and notifications are intentionally outside scope. Headless browser checks do not replace exhaustive accessibility or cross-browser audits.
