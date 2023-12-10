import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Reservation } from '@src/rental/core/entity/reservation.entity';
import { PersistenceValidationException } from '@src/shared/persistence/exception/persistence-validatio.exception';
import { PersistenceException } from '@src/shared/persistence/exception/persistence.exception';
import { PrismaService } from '@src/shared/persistence/prisma/prisma.service';
import { EquipmentFactory } from '../factory/equipment.factory';

@Injectable()
export class ReservationRepository {
  private readonly model: PrismaService['reservation'];
  constructor(private readonly prismaService: PrismaService) {
    this.model = this.prismaService.reservation;
  }

  async create(reservation: Reservation): Promise<void> {
    try {
      await this.model.create({
        data: {
          id: reservation.id,
          jobId: reservation.jobId,
          userId: reservation.userId,
          equipmentId: reservation.equipment.id,
          reservedAt: reservation.reservedAt,
          reservationStart: reservation.reservationStart,
          reservationEnd: reservation.reservationEnd,
          status: reservation.status,
        },
      });
    } catch (error) {
      this.handleAndThrowError(error);
    }
  }

  async isEquipmentAvailableBetweenDates(
    startDate: Date,
    endDate: Date
  ): Promise<boolean> {
    try {
      const reservations = await this.model.findMany({
        where: {
          reservationStart: {
            gte: startDate,
          },
          reservationEnd: {
            lte: endDate,
          },
        },
      });
      if (reservations.length > 0) {
        return false;
      }
      return true;
    } catch (error) {
      this.handleAndThrowError(error);
    }
  }

  async update(reservation: Reservation): Promise<void> {
    console.log(reservation.status);
    try {
      await this.model.update({
        where: {
          id: reservation.id,
        },
        data: {
          id: reservation.id,
          jobId: reservation.jobId,
          reservedAt: reservation.reservedAt,
          userId: reservation.userId,
          reservationStart: reservation.reservationStart,
          reservationEnd: reservation.reservationEnd,
          status: reservation.status,
          equipment: {
            update: {
              status: reservation.equipment.status,
              currentJobId: reservation.equipment.currentJobId,
              lastLocation: reservation.equipment.lastLocation,
            },
          },
        },
      });
    } catch (error) {
      this.handleAndThrowError(error);
    }
  }

  async findById(id: string, userId?: string): Promise<Reservation | undefined> {
    try {
      const reservation = await this.model.findUnique({
        where: {
          id,
          userId,
        },
        include: {
          equipment: true,
        },
      });
      if (!reservation) {
        return undefined;
      }
      return new Reservation({
        ...reservation,
        equipment: EquipmentFactory.create(reservation.equipment),
      });
    } catch (error) {
      this.handleAndThrowError(error);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.model.deleteMany();
    } catch (error) {
      this.handleAndThrowError(error);
    }
  }

  protected handleAndThrowError(error: unknown): never {
    const errorMessage = this.extractErrorMessage(error);
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new PersistenceValidationException(error.message, error);
    }

    throw new PersistenceException(errorMessage, error);
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return 'An unexpected error occurred.';
  }
}
