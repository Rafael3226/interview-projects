import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  Equipment,
  EquipmentStatus,
  EquipmentType,
  NewEquipmentType,
} from '@src/rental/core/entity/equipment.entity';
import { MiscellaneusEquipment } from '@src/rental/core/value-object/miscellaneus-equipment.value-object';
import { InstantCheckoutDto } from '@src/rental/http/rest/dto/reservation.dto';
import { EquipmentRepository } from '@src/rental/persistence/repository/equipment.repository';
import { ReservationRepository } from '@src/rental/persistence/repository/reservation.repository';
import { randomUUID } from 'crypto';
import request from 'supertest';

describe('ReservationController (e2e)', () => {
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

  describe('/reservation/instant (POST)', () => {
    it('returns 400 if the equipment is not found', async () => {
      const createReservationParams: InstantCheckoutDto = {
        equipmentId: randomUUID(),
        userId: randomUUID(),
        jobId: '789',
        reservationEnd: new Date('2022-01-01'),
      };
      await request(app.getHttpServer())
        .post('/reservation/instant')
        .send(createReservationParams)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toEqual(
            `Equipment with id ${createReservationParams.equipmentId} not found`
          );
        });
    });

    it('return 400 if the equipment is not available', async () => {
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

      const createReservationParams: InstantCheckoutDto = {
        equipmentId: equipmentId,
        userId: randomUUID(),
        jobId: '789',
        reservationEnd: new Date('2022-01-01'),
      };
      await request(app.getHttpServer())
        .post('/reservation/instant')
        .send(createReservationParams)
        .expect(HttpStatus.BAD_REQUEST)
        .expect(() => {
          `Equipment with id ${createReservationParams.equipmentId} is not available`;
        });
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

      const createReservationParams: InstantCheckoutDto = {
        equipmentId: equipmentId,
        userId: randomUUID(),
        jobId: '789',
        reservationEnd: new Date('2024-01-01'),
      };
      await request(app.getHttpServer())
        .post('/reservation/instant')
        .send(createReservationParams)
        .expect(HttpStatus.CREATED);
    });
  });
});
