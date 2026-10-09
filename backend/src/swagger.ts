import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const API_PREFIX = 'api';

export function createApiDocument(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('FleetSlot API')
    .setDescription(
      'Fleet turnaround and vehicle operations scheduling. In-memory fictional data resets on backend restart. Dates use the operator/server local calendar; replace example dates with today or a future date before scheduling. No authentication is required for this demo.',
    )
    .setVersion('1.0.0')
    .addServer('/', 'Current host (API or frontend proxy)')
    .addTag('Vehicles', 'Fictional fleet and active state')
    .addTag('Bookings', 'Schedule, read, edit, and delete operations')
    .addTag('Availability', 'Generated vehicle-specific windows')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // The global whitelist rejects additional request fields; reflect this in OpenAPI.
  for (const name of ['CreateBookingDto', 'UpdateBookingDto']) {
    const schema = document.components?.schemas?.[name];
    if (schema && !('$ref' in schema)) schema.additionalProperties = false;
  }
  return document;
}

export function setupSwagger(app: INestApplication) {
  SwaggerModule.setup(`${API_PREFIX}/docs`, app, createApiDocument(app), {
    jsonDocumentUrl: `${API_PREFIX}/swagger.json`,
    yamlDocumentUrl: `${API_PREFIX}/swagger.yaml`,
    customSiteTitle: 'FleetSlot API documentation',
    swaggerOptions: { persistAuthorization: false, validatorUrl: null },
  });
}
