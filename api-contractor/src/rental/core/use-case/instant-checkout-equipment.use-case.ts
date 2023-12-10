import { Injectable } from '@nestjs/common';
import { EquipmentRepository } from '@src/rental/persistence/repository/equipment.repository';
import { ReservationRepository } from '@src/rental/persistence/repository/reservation.repository';
import { Reservation } from '../entity/reservation.entity';
import { EquipmentNotAvailableException } from '../exception/equipment-not-available.exception';
import { EquipmentNotFoundException } from '../exception/equipment-not-found.exception';

export type ReservationCheckoutDto = {
  jobId: string;
  equipmentId: string;
  userId: string;
  reservationEnd: Date;
};

@Injectable()
export class InstantCheckoutEquipmentUseCase {
  constructor(
    private readonly equipmentRepository: EquipmentRepository,
    private readonly reservationRepository: ReservationRepository
  ) {}
  async execute({
    jobId,
    equipmentId,
    reservationEnd,
    userId,
  }: ReservationCheckoutDto): Promise<Reservation> {
    const equipment = await this.equipmentRepository.findById(equipmentId);
    if (!equipment) {
      throw new EquipmentNotFoundException(equipmentId);
    }
    if (!equipment.isAvailable()) {
      throw new EquipmentNotAvailableException(equipmentId);
    }
    const reservation = Reservation.create({
      jobId,
      equipment,
      userId,
      reservationStart: new Date(),
      reservationEnd: new Date(reservationEnd),
    });
    reservation.start();

    await this.reservationRepository.create(reservation);
    await this.equipmentRepository.update(equipment);
    return reservation;
  }
}
