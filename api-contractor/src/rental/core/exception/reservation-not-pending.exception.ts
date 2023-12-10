import { CoreException } from '@src/shared/core/exception/core.exception';

export class ReservationNotPendingException extends CoreException {
  constructor(id: string) {
    super(`Reservation with id ${id} is not pending`);
  }
}
