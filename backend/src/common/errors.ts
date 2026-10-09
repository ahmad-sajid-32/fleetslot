import { HttpException } from '@nestjs/common';
export function fail(
  status: number,
  code: string,
  message: string,
  extra = {},
): never {
  throw new HttpException({ code, message, ...extra }, status);
}
