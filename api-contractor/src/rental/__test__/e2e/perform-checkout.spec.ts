import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UUID, randomUUID } from 'crypto';
import request from 'supertest';

import { EquipmentRepository } from '@src/rental/persistence/repository/equipment.repository';
import { ReservationRepository } from '@src/rental/persistence/repository/reservation.repository';
import { AppModule } from '@src/app.module';
import {
  Equipment,
  EquipmentStatus,
  EquipmentType,
  NewEquipmentType,
} from '@src/rental/core/entity/equipment.entity';
import { MiscellaneusEquipment } from '@src/rental/core/value-object/miscellaneus-equipment.value-object';
import { PerformCheckoutDto } from '@src/rental/http/rest/dto/reservation.dto';
import { Reservation } from '@src/rental/core/entity/reservation.entity';

describe('PerformCheckoutUseCase (e2e)', () => {
  let app: INestApplication;
  let equipmentRepository: EquipmentRepository;
  let reservationRepository: ReservationRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    equipmentRepository = moduleFixture.get<EquipmentRepository>(EquipmentRepository);
    reservationRepository =
      moduleFixture.get<ReservationRepository>(ReservationRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await reservationRepository.clear();
    await equipmentRepository.clear();
  });

  describe('/reservation/checkout (POST)', () => {
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
    const equipmentId = randomUUID();

    it('returns 400 if the equipment is not found', async () => {
      await request(app.getHttpServer())
        .post('/reservation/checkout')
        .send(performCheckoutDto)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toEqual(
            `Reservation with id ${performCheckoutDto.reservationId} not found`
          );
        });
    });

    it('returns 400 if the reservation is not pending', async () => {
      const equipment = Equipment.create(defaultEquipment, equipmentId);
      await equipmentRepository.create(equipment);
      const reservation = Reservation.create(
        {
          equipment,
          jobId: randomUUID(),
          userId: performCheckoutDto.userId,
          reservationStart: new Date(),
          reservationEnd: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        performCheckoutDto.reservationId as UUID
      );
      reservation.start();
      await reservationRepository.create(reservation);

      await request(app.getHttpServer())
        .post('/reservation/checkout')
        .send(performCheckoutDto)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toEqual(
            `Reservation with id ${performCheckoutDto.reservationId} is not pending`
          );
        });
    });

    it('returns 200 if the reservation exist, is pending, and is updated', async () => {
      const equipment = Equipment.create(defaultEquipment, equipmentId);
      await equipmentRepository.create(equipment);
      const reservation = Reservation.create(
        {
          equipment,
          jobId: randomUUID(),
          userId: performCheckoutDto.userId,
          reservationStart: new Date(),
          reservationEnd: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        performCheckoutDto.reservationId as UUID
      );
      await reservationRepository.create(reservation);

      await request(app.getHttpServer())
        .post('/reservation/checkout')
        .send(performCheckoutDto)
        .expect(HttpStatus.OK);
    });
  });
});
