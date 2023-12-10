import { Injectable } from '@nestjs/common';

import { ReservationRepository } from '@src/rental/persistence/repository/reservation.repository';
import { ReservationNotFoundException } from '../exception/reservation-not-found.exception';
import { ReservationNotPendingException } from '../exception/reservation-not-pending.exception';

export type PerformCheckoutDto = {
  reservationId: string;
  userId: string;
};

@Injectable()
export class PerformCheckoutUseCase {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  async execute({ reservationId, userId }: PerformCheckoutDto) {
    const reservation = await this.reservationRepository.findById(reservationId, userId);
    if (!reservation) {
      throw new ReservationNotFoundException(reservationId);
    } else if (!reservation.isPending()) {
      throw new ReservationNotPendingException(reservationId);
    }
    reservation.start();
    await this.reservationRepository.update(reservation);
  }
}
