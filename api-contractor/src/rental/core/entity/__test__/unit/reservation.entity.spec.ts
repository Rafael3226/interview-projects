import { MiscellaneusEquipment } from '@src/rental/core/value-object/miscellaneus-equipment.value-object';
import { CoreException } from '@src/shared/core/exception/core.exception';
import {
  Equipment,
  EquipmentStatus,
  EquipmentType,
  NewEquipmentType,
} from '../../equipment.entity';
import { Reservation, ReservationStatus } from '../../reservation.entity';

describe('Reservation', () => {
  let equipment: Equipment;

  const defaultEquipment: NewEquipmentType = {
    name: 'Power Gnerator One',
    serialNumber: '123456789',
    year: 2021,
    manufacturer: 'Electrify Inc',
    widthCm: 300,
    heightCm: 50,
    weightKg: 50,
    status: EquipmentStatus.AVAILABLE,
    type: EquipmentType.MISCELLANEUS,
    specificDetails: new MiscellaneusEquipment({
      powerCapacityW: 1000,
    }),
  };
  beforeEach(() => {
    equipment = Equipment.create(defaultEquipment);
  });

  describe('create', () => {
    it('creates a reservation with PENDING status if the reservation start date is within 24 hours', () => {
      const reservationData = {
        equipment,
        jobId: '789',
        userId: '456',
        reservationStart: new Date(),
        reservationEnd: new Date(Date.now() + 2 * 60 * 60 * 1000),
      };
      const reservation = Reservation.create(reservationData);
      expect(reservation.status).toEqual(ReservationStatus.PENDING);
    });

    it('creates a reservation with SCHEDULED status if the reservation start date is after 24 hours', () => {
      const reservationData = {
        equipment,
        jobId: '789',
        userId: '456',
        reservationStart: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        reservationEnd: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      };
      const reservation = Reservation.create(reservationData);
      expect(reservation.status).toEqual(ReservationStatus.SCHEDULED);
    });

    it('throws an exception if the reservation start date is after the reservation end date', () => {
      const reservationData = {
        equipment,
        jobId: '789',
        userId: '456',
        reservationStart: new Date(Date.now() + 2 * 60 * 60 * 1000),
        reservationEnd: new Date(),
      };
      expect(() => {
        Reservation.create(reservationData);
      }).toThrow(CoreException);
    });
  });

  describe('start', () => {
    it('throws an exception if the reservation start date has not yet arrived', () => {
      const reservationData = {
        id: '123',
        equipment,
        jobId: '789',
        userId: '456',
        reservedAt: new Date(),
        reservationStart: new Date(Date.now() + 2 * 60 * 60 * 1000),
        reservationEnd: new Date(Date.now() + 3 * 60 * 60 * 1000),
        status: ReservationStatus.PENDING,
      };
      const reservation = new Reservation(reservationData);
      expect(() => {
        reservation.start();
      }).toThrow(CoreException);
    });

    it('assigns the equipment to the job and set the status to ACTIVE', () => {
      const reservationData = {
        id: '123',
        equipment,
        jobId: '789',
        userId: '456',
        reservedAt: new Date(),
        reservationStart: new Date(),
        reservationEnd: new Date(Date.now() + 2 * 60 * 60 * 1000),
        status: ReservationStatus.PENDING,
      };
      const reservation = new Reservation(reservationData);
      reservation.start();
      expect(reservation.status).toEqual(ReservationStatus.ACTIVE);
      expect(equipment.currentJobId).toEqual('789');
    });
  });

  describe('complete', () => {
    it('returns the equipment from the job and set the status to COMPLETED', () => {
      equipment.status = EquipmentStatus.CHECKED_OUT;
      const reservationData = {
        id: '123',
        equipment,
        jobId: '789',
        userId: '456',
        reservedAt: new Date(),
        reservationStart: new Date(),
        reservationEnd: new Date(Date.now() + 2 * 60 * 60 * 1000),
        status: ReservationStatus.ACTIVE,
      };
      const reservation = new Reservation(reservationData);
      reservation.complete('location');
      expect(reservation.status).toEqual(ReservationStatus.COMPLETED);
      expect(equipment.currentJobId).toBeUndefined();
    });
  });
});
