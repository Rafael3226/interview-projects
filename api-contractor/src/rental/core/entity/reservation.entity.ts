import { CoreException } from '@src/shared/core/exception/core.exception';
import { randomUUID } from 'crypto';
import { Equipment } from './equipment.entity';

export const ReservationStatus: {
  [x: string]: 'PENDING' | 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
} = {
  PENDING: 'PENDING',
  SCHEDULED: 'SCHEDULED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export type ReservationStatus =
  (typeof ReservationStatus)[keyof typeof ReservationStatus];

type ReservationProperties = {
  id: string;
  equipment: Equipment;
  jobId: string;
  userId: string;
  reservedAt: Date;
  reservationStart: Date;
  reservationEnd: Date;
  status: ReservationStatus;
};

export class Reservation {
  id: ReservationProperties['id'];
  equipment: ReservationProperties['equipment'];
  jobId: ReservationProperties['jobId'];
  userId: ReservationProperties['userId'];
  reservedAt: ReservationProperties['reservedAt'];
  reservationStart: ReservationProperties['reservationStart'];
  reservationEnd: ReservationProperties['reservationEnd'];
  status: ReservationProperties['status'];

  constructor(reservationData: ReservationProperties) {
    Object.assign(this, reservationData);
  }

  static create(
    reservationData: Omit<ReservationProperties, 'id' | 'status' | 'reservedAt'>,
    id = randomUUID()
  ): Reservation {
    if (reservationData.reservationStart > reservationData.reservationEnd) {
      throw new CoreException(
        'Reservation start date cannot be after reservation end date'
      );
    }
    //if reservation start is bigger than 24 hours it's set to scheduled
    const tomorrowDate = new Date().getTime() + 24 * 60 * 60 * 1000;
    let status = ReservationStatus.PENDING;
    if (reservationData.reservationStart.getTime() > tomorrowDate) {
      status = ReservationStatus.SCHEDULED;
    }

    return new Reservation({
      ...reservationData,
      ...{ id, status, reservedAt: new Date() },
    });
  }

  start() {
    if (!this.isReservationDue()) {
      throw new CoreException('Reservation cannot be started before its start date');
    }
    this.equipment.assignToJob(this.jobId);
    this.status = ReservationStatus.ACTIVE;
  }

  private isReservationDue() {
    const now = new Date();
    return now >= new Date(this.reservationStart) && now < new Date(this.reservationEnd);
  }

  schedule() {
    this.status = ReservationStatus.SCHEDULED;
  }

  complete(location: string) {
    this.equipment.returnFromJob(location);
    this.status = ReservationStatus.COMPLETED;
  }

  isPending() {
    return this.status === ReservationStatus.PENDING;
  }
}
