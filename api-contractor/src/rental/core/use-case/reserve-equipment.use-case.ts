import { Injectable } from '@nestjs/common';
import { EquipmentRepository } from '@src/rental/persistence/repository/equipment.repository';
import { ReservationRepository } from '@src/rental/persistence/repository/reservation.repository';
import { Reservation } from '../entity/reservation.entity';
import { EquipmentNotAvailableException } from '../exception/equipment-not-available.exception';
import { EquipmentNotFoundException } from '../exception/equipment-not-found.exception';

export type ReservationCreationDto = {
  jobId: string;
  equipmentId: string;
  userId: string;
  reservationStart: Date;
  reservationEnd: Date;
};
@Injectable()
export class ReserveEquipmentUseCase {
  constructor(
    private readonly equipmentRepository: EquipmentRepository,
    private readonly reservationRepository: ReservationRepository
  ) {}
  async execute({
    jobId,
    equipmentId,
    userId,
    reservationEnd,
    reservationStart,
  }: ReservationCreationDto): Promise<void> {
    const equipment = await this.equipmentRepository.findById(equipmentId);
    if (!equipment) {
      throw new EquipmentNotFoundException(equipmentId);
    }
    if (
      !(await this.reservationRepository.isEquipmentAvailableBetweenDates(
        new Date(reservationStart),
        new Date(reservationEnd)
      ))
    ) {
      throw new EquipmentNotAvailableException(equipmentId);
    }
    const reservation = Reservation.create({
      jobId,
      equipment,
      userId,
      reservationStart: new Date(reservationStart),
      reservationEnd: new Date(reservationEnd),
    });

    await this.reservationRepository.create(reservation);
  }
}
