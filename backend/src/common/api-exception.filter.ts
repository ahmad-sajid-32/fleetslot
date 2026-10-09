import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      if (
        typeof payload === 'object' &&
        payload !== null &&
        'code' in payload
      ) {
        response.status(status).json(payload);
        return;
      }
      response
        .status(status)
        .json({
          code: status === 400 ? 'VALIDATION_ERROR' : 'NOT_FOUND',
          message:
            status === 400
              ? 'Invalid request. Check the JSON body and request fields.'
              : 'The requested resource was not found.',
        });
      return;
    }
    this.logger.error(
      exception instanceof Error ? exception.stack : 'Unexpected server error',
    );
    response
      .status(500)
      .json({
        code: 'INTERNAL_ERROR',
        message: 'The request could not be completed. Please try again.',
      });
  }
}
