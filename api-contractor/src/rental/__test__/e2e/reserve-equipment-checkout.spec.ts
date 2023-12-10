import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  Equipment,
  EquipmentStatus,
  EquipmentType,
  NewEquipmentType,
} from '@src/rental/core/entity/equipment.entity';
import { Reservation } from '@src/rental/core/entity/reservation.entity';
import { MiscellaneusEquipment } from '@src/rental/core/value-object/miscellaneus-equipment.value-object';
import { ScheduledCheckoutDto } from '@src/rental/http/rest/dto/reservation.dto';
import { EquipmentRepository } from '@src/rental/persistence/repository/equipment.repository';
import { ReservationRepository } from '@src/rental/persistence/repository/reservation.repository';
import { randomUUID } from 'crypto';
import request from 'supertest';

describe('ReservationController - scheduled reservation (e2e)', () => {
  let app: INestApplication;
  let equipmentRepository: EquipmentRepository;
  let reservationRepoistory: ReservationRepository;

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

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    equipmentRepository = moduleFixture.get<EquipmentRepository>(EquipmentRepository);
    reservationRepoistory =
      moduleFixture.get<ReservationRepository>(ReservationRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await reservationRepoistory.clear();
    await equipmentRepository.clear();
  });

  describe('/reservation/schedule (POST)', () => {
    it('returns 400 if the equipment is not found', async () => {
      const createReservationParams: ScheduledCheckoutDto = {
        equipmentId: randomUUID(),
        userId: randomUUID(),
        jobId: '789',
        reservationStart: new Date('2023-11-01'),
        reservationEnd: new Date('2023-12-01'),
      };
      await request(app.getHttpServer())
        .post('/reservation/schedule')
        .send(createReservationParams)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toEqual(
            `Equipment with id ${createReservationParams.equipmentId} not found`
          );
        });
    });

    it('returns 400 if the equipment is not available in the selected dates', async () => {
      const equipmentId = randomUUID();
      const equipment = Equipment.create(
        {
          ...defaultEquipment,
          ...{
            status: EquipmentStatus.CHECKED_OUT,
          },
        },
        equipmentId
      );
      await equipmentRepository.create(equipment);

      await reservationRepoistory.create(
        Reservation.create({
          equipment,
          jobId: '789',
          userId: randomUUID(),
          reservationStart: new Date('2023-11-01'),
          reservationEnd: new Date('2023-12-01'),
        })
      );

      const createReservationParams: ScheduledCheckoutDto = {
        equipmentId,
        userId: randomUUID(),
        jobId: '789',
        reservationStart: new Date('2023-11-01'),
        reservationEnd: new Date('2023-12-01'),
      };
      await request(app.getHttpServer())
        .post('/reservation/schedule')
        .send(createReservationParams)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('returns 201 even if the equipment is checked out but available between the selected dates', async () => {
      const equipmentId = randomUUID();
      await equipmentRepository.create(
        Equipment.create(
          {
            ...defaultEquipment,
            ...{
              status: EquipmentStatus.CHECKED_OUT,
            },
          },
          equipmentId
        )
      );

      const createReservationParams: ScheduledCheckoutDto = {
        equipmentId,
        userId: randomUUID(),
        jobId: '789',
        reservationStart: new Date('2023-11-01'),
        reservationEnd: new Date('2023-12-01'),
      };
      await request(app.getHttpServer())
        .post('/reservation/schedule')
        .send(createReservationParams)
        .expect(HttpStatus.CREATED);
    });

    it('returns 201 if the equipment is available and the reservation is created', async () => {
      const equipmentId = randomUUID();
      await equipmentRepository.create(
        Equipment.create(
          {
            ...defaultEquipment,
          },
          equipmentId
        )
      );

      const createReservationParams: ScheduledCheckoutDto = {
        equipmentId,
        userId: randomUUID(),
        jobId: '789',
        reservationStart: new Date('2023-11-01'),
        reservationEnd: new Date('2023-12-01'),
      };
      await request(app.getHttpServer())
        .post('/reservation/schedule')
        .send(createReservationParams)
        .expect(HttpStatus.CREATED);
    });
  });
});
