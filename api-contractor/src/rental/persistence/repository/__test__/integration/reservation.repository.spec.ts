import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';

import { Equipment, NewEquipmentType } from '@src/rental/core/entity/equipment.entity';
import { MiscellaneusEquipment } from '@src/rental/core/value-object/miscellaneus-equipment.value-object';
import { PrismaService } from '@src/shared/persistence/prisma/prisma.service';
import { EquipmentRepository } from '../../equipment.repository';
import { ReservationRepository } from '../../reservation.repository';
import { Reservation } from '@src/rental/core/entity/reservation.entity';
import { EquipmentStatus, EquipmentType, ReservationStatus } from '@prisma/client';

describe('ReservationRepository', () => {
  let prismaService: PrismaService;
  let repository: ReservationRepository;
  let equipmentRepository: EquipmentRepository;

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
  const defaultReservation = Reservation.create(
    {
      equipment,
      jobId: '789',
      userId: randomUUID(),
      reservationStart: new Date(),
      reservationEnd: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    reservationId
  );
  defaultReservation.start();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ReservationRepository, EquipmentRepository],
      providers: [PrismaService],
    }).compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
    repository = moduleRef.get<ReservationRepository>(ReservationRepository);
    equipmentRepository = moduleRef.get<EquipmentRepository>(EquipmentRepository);
  });

  beforeEach(async () => {
    await prismaService.reservation.deleteMany();
    await prismaService.equipment.deleteMany();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    jest.useRealTimers();
  });

  describe('create', () => {
    it('creates a reservation', async () => {
      //need to create the equipment first to fulfill the FK

      // jest.spyOn(equipmentRepository, 'findAll').mockImplementation(() => result);

      await equipmentRepository.create(equipment);
      await repository.create(defaultReservation);

      const createdReservation = await prismaService.reservation.findUnique({
        where: {
          id: defaultReservation.id,
        },
      });

      expect(createdReservation).toMatchObject({
        id: defaultReservation.id,
        jobId: defaultReservation.jobId,
        userId: defaultReservation.userId,
        equipmentId: defaultReservation.equipment.id,
        reservedAt: defaultReservation.reservedAt,
        reservationStart: defaultReservation.reservationStart,
        reservationEnd: defaultReservation.reservationEnd,
        status: defaultReservation.status,
      });
    });
  });

  describe('isEquipmentAvailableBetweenDates', () => {
    it('returns true if the equipment is available', async () => {
      const startDate = new Date(Date.now() + 60 * 60 * 1000);
      const endDate = new Date(Date.now() + 2 * 60 * 60 * 1000);

      const isAvailable = await repository.isEquipmentAvailableBetweenDates(
        startDate,
        endDate
      );

      expect(isAvailable).toBe(true);
    });

    it('returns false if the equipment is not available', async () => {
      await equipmentRepository.create(equipment);
      const reservationId = randomUUID();
      const reservation = Reservation.create(
        {
          equipment,
          jobId: '789',
          userId: randomUUID(),
          reservationStart: new Date('2023-08-01'),
          reservationEnd: new Date('2023-11-01'),
        },
        reservationId
      );
      await repository.create(reservation);

      const isAvailable = await repository.isEquipmentAvailableBetweenDates(
        new Date('2023-08-01'),
        new Date('2023-11-01')
      );

      expect(isAvailable).toBe(false);
    });
  });

  describe('update', () => {
    it('updates a reservation', async () => {
      await equipmentRepository.create(equipment);

      const reservationId = randomUUID();
      const reservation = Reservation.create(
        {
          equipment,
          jobId: '789',
          userId: randomUUID(),
          reservationStart: new Date('2023-08-01'),
          reservationEnd: new Date('2023-11-01'),
        },
        reservationId
      );
      await repository.create(reservation);
      reservation.status = ReservationStatus.CANCELLED;
      await repository.update(reservation);

      const updatedReservation = await prismaService.reservation.findUnique({
        where: {
          id: reservation.id,
        },
        include: {
          equipment: true,
        },
      });

      expect(updatedReservation).toMatchObject({
        id: reservation.id,
        jobId: reservation.jobId,
        userId: reservation.userId,
        reservedAt: reservation.reservedAt,
        reservationStart: reservation.reservationStart,
        reservationEnd: reservation.reservationEnd,
        status: reservation.status,
      });
    });
  });

  describe('findById', () => {
    it('returns a reservation by id', async () => {
      await equipmentRepository.create(equipment);

      const reservationId = randomUUID();
      const reservation = Reservation.create(
        {
          equipment,
          jobId: '789',
          userId: randomUUID(),
          reservationStart: new Date('2023-08-01'),
          reservationEnd: new Date('2023-11-01'),
        },
        reservationId
      );
      await repository.create(reservation);

      const foundReservation = await repository.findById(reservation.id);

      expect(foundReservation).toMatchObject(reservation);
    });

    it('returns undefined if the reservation is not found', async () => {
      const foundReservation = await repository.findById('123');

      expect(foundReservation).toBeUndefined();
    });
  });

  describe('clear', () => {
    it('deletes all reservations', async () => {
      await equipmentRepository.create(equipment);

      const reservationId = randomUUID();
      const reservation = Reservation.create(
        {
          equipment,
          jobId: '789',
          userId: randomUUID(),
          reservationStart: new Date('2023-08-01'),
          reservationEnd: new Date('2023-11-01'),
        },
        reservationId
      );
      await repository.create(reservation);

      await repository.clear();

      const reservations = await prismaService.reservation.findMany();

      expect(reservations).toHaveLength(0);
    });
  });
});
