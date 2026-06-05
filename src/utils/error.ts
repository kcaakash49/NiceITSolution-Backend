export class AppError extends Error {
    status: number;
    fieldErrors?: Record<string, string>;
  
    constructor(status: number, message: string, fieldErrors?: Record<string, string>) {
      super(message);
      this.status = status;
      this.fieldErrors = fieldErrors;
    }
  }