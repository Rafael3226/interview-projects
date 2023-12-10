export class PersistenceException extends Error {
  oringinalError?: Error | unknown;
  constructor(message: string, oringinalError?: Error | unknown) {
    super(message);
    this.name = this.constructor.name;
    this.oringinalError = oringinalError;
  }
}
