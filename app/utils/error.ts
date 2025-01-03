export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Mark as operational error
    Error.captureStackTrace(this, this.constructor); // Capture stack trace
  }
}
