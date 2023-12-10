import { Test } from '@nestjs/testing';
import {
  Equipment,
  EquipmentStatus,
  EquipmentType,
  NewEquipmentType,
} from '@src/rental/core/entity/equipment.entity';
import { EquipmentNotAvailableException } from '@src/rental/core/exception/equipment-not-available.exception';
import { EquipmentNotFoundException } from '@src/rental/core/exception/equipment-not-found.exception';
import { MiscellaneusEquipment } from '@src/rental/core/value-object/miscellaneus-equipment.value-object';
import { EquipmentRepository } from '@src/rental/persistence/repository/equipment.repository';
import { ReservationRepository } from '@src/rental/persistence/repository/reservation.repository';
import { randomUUID } from 'crypto';
import {
  ReservationCreationDto,
  ReserveEquipmentUseCase,
} from '../../reserve-equipment.use-case';

describe('ReserveEquipmentUseCase', () => {
  let equipmentRepository: EquipmentRepository;
  let reservationRepository: ReservationRepository;
  let useCase: ReserveEquipmentUseCase;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ReserveEquipmentUseCase,
        {
          provide: EquipmentRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: ReservationRepository,
          useValue: {
            isEquipmentAvailableBetweenDates: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    equipmentRepository = moduleRef.get<EquipmentRepository>(EquipmentRepository);
    reservationRepository = moduleRef.get<ReservationRepository>(ReservationRepository);
    useCase = moduleRef.get<ReserveEquipmentUseCase>(ReserveEquipmentUseCase);
  });

  describe('execute', () => {
    const reservationData: ReservationCreationDto = {
      jobId: '123',
      equipmentId: randomUUID(),
      userId: randomUUID(),
      reservationStart: new Date(Date.now() + 60 * 60 * 1000),
      reservationEnd: new Date(Date.now() + 2 * 60 * 60 * 1000),
    };

    it('throws an exception if the equipment is not found', async () => {
      jest.spyOn(equipmentRepository, 'findById').mockResolvedValueOnce(undefined);
      await expect(useCase.execute(reservationData)).rejects.toThrow(
        EquipmentNotFoundException
      );
    });

    it('throws an exception if the equipment is not available', async () => {
      const equipmenData: NewEquipmentType = {
        name: 'Power Gnerator One',
        serialNumber: '123456789',
        year: 2021,
        manufacturer: 'Electrify Inc',
        widthCm: 300,
        heightCm: 50,
        weightKg: 50,
        status: EquipmentStatus.CHECKED_OUT,
        type: EquipmentType.MISCELLANEUS,
        specificDetails: new MiscellaneusEquipment({
          powerCapacityW: 1000,
        }),
      };
      const equipment = Equipment.create(equipmenData);
      jest.spyOn(equipmentRepository, 'findById').mockResolvedValueOnce(equipment);
      jest
        .spyOn(reservationRepository, 'isEquipmentAvailableBetweenDates')
        .mockResolvedValueOnce(false);

      await expect(useCase.execute(reservationData)).rejects.toThrow(
        EquipmentNotAvailableException
      );
    });

    it('creates a reservation if the equipment is found and available', async () => {
      const equipmenData: NewEquipmentType = {
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
      const equipment = Equipment.create(equipmenData);
      jest.spyOn(equipmentRepository, 'findById').mockResolvedValueOnce(equipment);

      jest
        .spyOn(reservationRepository, 'isEquipmentAvailableBetweenDates')
        .mockResolvedValueOnce(true);
      await expect(useCase.execute(reservationData)).resolves.toBeUndefined();
      expect(reservationRepository.create).toHaveBeenCalledWith(expect.anything());
    });
  });
});
