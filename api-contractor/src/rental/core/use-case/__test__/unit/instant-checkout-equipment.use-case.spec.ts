import { Test } from '@nestjs/testing';
import {
  Equipment,
  EquipmentStatus,
  EquipmentType,
  NewEquipmentType,
} from '@src/rental/core/entity/equipment.entity';
import { ReservationStatus } from '@src/rental/core/entity/reservation.entity';
import { EquipmentNotAvailableException } from '@src/rental/core/exception/equipment-not-available.exception';
import { EquipmentNotFoundException } from '@src/rental/core/exception/equipment-not-found.exception';
import { MiscellaneusEquipment } from '@src/rental/core/value-object/miscellaneus-equipment.value-object';
import { EquipmentRepository } from '@src/rental/persistence/repository/equipment.repository';
import { ReservationRepository } from '@src/rental/persistence/repository/reservation.repository';
import { randomUUID } from 'crypto';
import {
  InstantCheckoutEquipmentUseCase,
  ReservationCheckoutDto,
} from '../../instant-checkout-equipment.use-case';

describe('InstantCheckoutEquipmentUseCase', () => {
  let equipmentRepository: EquipmentRepository;
  let reservationRepository: ReservationRepository;
  let useCase: InstantCheckoutEquipmentUseCase;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        InstantCheckoutEquipmentUseCase,
        {
          provide: EquipmentRepository,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: ReservationRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    equipmentRepository = moduleRef.get<EquipmentRepository>(EquipmentRepository);
    reservationRepository = moduleRef.get<ReservationRepository>(ReservationRepository);
    useCase = moduleRef.get<InstantCheckoutEquipmentUseCase>(
      InstantCheckoutEquipmentUseCase
    );
  });

  describe('execute', () => {
    const reservationData: ReservationCheckoutDto = {
      jobId: '123',
      equipmentId: randomUUID(),
      userId: randomUUID(),
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
      await expect(useCase.execute(reservationData)).rejects.toThrow(
        EquipmentNotAvailableException
      );
    });

    it('creates a reservation and update the equipment', async () => {
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
      jest.spyOn(reservationRepository, 'create').mockResolvedValueOnce(undefined);
      const response = await useCase.execute(reservationData);
      expect(response.status).toEqual(ReservationStatus.ACTIVE);
    });
  });
});
