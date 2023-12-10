import { Test } from '@nestjs/testing';

import { ReservationRepository } from '@src/rental/persistence/repository/reservation.repository';
import {
  PerformCheckoutDto,
  PerformCheckoutUseCase,
} from '../../perform-checkout.use-case';
import { ReservationNotFoundException } from '@src/rental/core/exception/reservation-not-found.exception';
import {
  Equipment,
  EquipmentStatus,
  EquipmentType,
  NewEquipmentType,
} from '@src/rental/core/entity/equipment.entity';
import { MiscellaneusEquipment } from '@src/rental/core/value-object/miscellaneus-equipment.value-object';
import { UUID, randomUUID } from 'crypto';
import { Reservation } from '@src/rental/core/entity/reservation.entity';
import { ReservationNotPendingException } from '@src/rental/core/exception/reservation-not-pending.exception';

describe('PerformCheckoutUseCase', () => {
  let reservationRepository: ReservationRepository;
  let useCase: PerformCheckoutUseCase;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PerformCheckoutUseCase,
        {
          provide: ReservationRepository,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    reservationRepository = moduleRef.get<ReservationRepository>(ReservationRepository);
    useCase = moduleRef.get<PerformCheckoutUseCase>(PerformCheckoutUseCase);
  });

  describe('execute', () => {
    const performCheckoutDto: PerformCheckoutDto = {
      reservationId: randomUUID(),
      userId: randomUUID(),
    };
    const defaultEquipment: NewEquipmentType = {
      name: 'Power Generator One',
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

    it('throws an exception if the reservation is not found', async () => {
      jest.spyOn(reservationRepository, 'findById').mockResolvedValueOnce(undefined);
      await expect(useCase.execute(performCheckoutDto)).rejects.toThrow(
        ReservationNotFoundException
      );
    });

    it('throws an exception if the reservation is not pending', async () => {
      const equipment = Equipment.create(defaultEquipment);
      const reservation = Reservation.create(
        {
          equipment,
          jobId: '789',
          userId: performCheckoutDto.userId,
          reservationStart: new Date(),
          reservationEnd: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        performCheckoutDto.reservationId as UUID
      );
      reservation.start();

      jest.spyOn(reservationRepository, 'findById').mockResolvedValueOnce(reservation);

      await expect(useCase.execute(performCheckoutDto)).rejects.toThrow(
        ReservationNotPendingException
      );
    });

    it('updates the reservation if it is found', async () => {
      const equipment = Equipment.create(defaultEquipment);
      const reservation = Reservation.create(
        {
          equipment,
          jobId: '789',
          userId: performCheckoutDto.userId,
          reservationStart: new Date(),
          reservationEnd: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        performCheckoutDto.reservationId as UUID
      );
      jest.spyOn(reservationRepository, 'findById').mockResolvedValueOnce(reservation);
      await expect(useCase.execute(performCheckoutDto)).resolves.toBeUndefined();
    });
  });
});
