import { Injectable } from '@nestjs/common';
import { ReservationRepository } from '@src/rental/persistence/repository/reservation.repository';
import { ReservationNotFoundException } from '../exception/reservation-not-found.exception';

export type ReturnEquipmentDto = {
  reservationId: string;
  location: string;
};
@Injectable()
export class ReturnEquipmentUseCase {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  async execute({ reservationId, location }: ReturnEquipmentDto): Promise<void> {
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new ReservationNotFoundException(reservationId);
    }
    reservation.complete(location);
    await this.reservationRepository.update(reservation);
  }
}
