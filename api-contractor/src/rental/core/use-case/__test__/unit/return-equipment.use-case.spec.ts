import { Test } from '@nestjs/testing';
import {
  Equipment,
  EquipmentStatus,
  EquipmentType,
  NewEquipmentType,
} from '@src/rental/core/entity/equipment.entity';
import { Reservation } from '@src/rental/core/entity/reservation.entity';
import { ReservationNotFoundException } from '@src/rental/core/exception/reservation-not-found.exception';
import { MiscellaneusEquipment } from '@src/rental/core/value-object/miscellaneus-equipment.value-object';
import { ReservationRepository } from '@src/rental/persistence/repository/reservation.repository';
import { randomUUID } from 'crypto';
import {
  ReturnEquipmentDto,
  ReturnEquipmentUseCase,
} from '../../return-equipment.use-case';

describe('ReturnEquipmentUseCase', () => {
  let reservationRepository: ReservationRepository;
  let useCase: ReturnEquipmentUseCase;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ReturnEquipmentUseCase,
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
    useCase = moduleRef.get<ReturnEquipmentUseCase>(ReturnEquipmentUseCase);
  });

  describe('execute', () => {
    const returnData: ReturnEquipmentDto = {
      reservationId: '123',
      location: 'New York',
    };

    it('throws an exception if the reservation is not found', async () => {
      jest.spyOn(reservationRepository, 'findById').mockResolvedValueOnce(undefined);

      await expect(useCase.execute(returnData)).rejects.toThrow(
        ReservationNotFoundException
      );
    });

    it('updates the reservation if it is found', async () => {
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
      const equipment = Equipment.create(defaultEquipment);
      const reservationId = randomUUID();
      const reservation = Reservation.create(
        {
          equipment,
          jobId: '789',
          userId: randomUUID(),
          reservationStart: new Date(),
          reservationEnd: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        reservationId
      );

      reservation.start();

      jest.spyOn(reservationRepository, 'findById').mockResolvedValueOnce(reservation);
      await expect(useCase.execute(returnData)).resolves.toBeUndefined();
    });
  });
});
