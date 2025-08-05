export class ValidationError extends Error {
  constructor(
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DbError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DbError';
  }
}
