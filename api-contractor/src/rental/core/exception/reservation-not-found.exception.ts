import { CoreException } from '@src/shared/core/exception/core.exception';

export class ReservationNotFoundException extends CoreException {
  constructor(id: string) {
    super(`Reservation with id ${id} not found`);
  }
}
