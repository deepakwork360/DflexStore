export class AppError extends Error {
  public status: number;
  public success: boolean;
  public isOperational: boolean;
  public errors?: Record<string, string> | undefined;

  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string> | undefined,
  ) {
    super(message);
    this.status = statusCode;
    this.success = false;
    this.isOperational = true;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
