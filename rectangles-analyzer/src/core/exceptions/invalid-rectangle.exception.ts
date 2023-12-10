import { CoreException } from "./core.exception";

export class InvalidRectangleException extends CoreException {
  constructor(message: string) {
    super(message);
  }
}
